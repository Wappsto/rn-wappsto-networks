import { BlufiParameter, BlufiCallback } from './util/params';
import { stringToBytes } from 'convert-string';
import { FrameCtrlData } from './FrameCtrlData';
import { Buffer } from 'buffer';
import BleManager from 'react-native-ble-manager';
import BlufiCRC from './BlufiCRC';
import BlufiAES from './BlufiAES';
import ByteArrayInputStream from './ByteArrayInputStream';
import LinkedBlockingQueue from './LinkedBlockingQueue';
import Log from './Log';

// workaround-------------------
//------------------------------
const TAG = 'BlufiClientImpl';
const mEncrypted = false;
const mChecksum = false;
const mRequireAck = false;
const mAck = new LinkedBlockingQueue();
const mAESKey = null;

const DEFAULT_PACKAGE_LENGTH = 20;
const PACKAGE_HEADER_LENGTH = 4;
const MIN_PACKAGE_LENGTH = 7;
const AES_TRANSFORMATION = 'AES/CFB/NoPadding';

let connectedDevice = null;
let mSendSequence = 0;
let mReadSequence = -1;

function getTypeValue(type, subtype) {
  return (subtype << 2) | type;
}

function generateSendSequence() {
  const prev = mSendSequence;
  mSendSequence++;
  return prev;
}

function generateReadSequence() {
  return mReadSequence++;
}

function generateAESIV(sequence) {
  let result = Buffer.alloc(16);
  // SAMI: MAYBE buffer.write !!!
  result[0] = sequence;

  return result;
}

function toInt(b) {
  return b & 0xff;
}

function getPackageType(typeValue) {
  return typeValue & 0b11;
}

function getSubType(typeValue) {
  return ((typeValue & 0b11111100) >> 2);
}

//-----------------------------------------  HANDLE WRITE --------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

function gattWrite(data) {
  BleManager.write(connectedDevice.id, BlufiParameter.UUID_SERVICE, BlufiParameter.UUID_WRITE_CHARACTERISTIC, data);
}

async function receiveAck(sequence) {
  try {
    const ack = await mAck.take();
    return ack === sequence;
  } catch (e) {
    return false;
  }
}

function getPostBytes(type, frameCtrl, sequence, dataLength, data) {
  let byteOS = Buffer.from([type, frameCtrl, sequence, dataLength]);

  let frameCtrlData = FrameCtrlData.setData(frameCtrl);
  let checksumBytes;
  if (frameCtrlData.isChecksum()) {
    let willCheckBytes = Buffer.from([sequence, dataLength]);
    if (data != null) {
      // ByteArrayOutputStream os = new ByteArrayOutputStream(willCheckBytes.length + data.length);
      let os = Buffer.from(willCheckBytes.length + data.length);
      os.write(willCheckBytes, 0, willCheckBytes.length);
      os.write(data, 0, data.length);
      willCheckBytes = os.slice(0);
    }
    let checksum = BlufiCRC.calcCRC(0, willCheckBytes);
    let checksumByte1 = (checksum & 0xff);
    let checksumByte2 = ((checksum >> 8) & 0xff);
    checksumBytes = Buffer.from(checksumByte1, checksumByte2);
  }

  // SAMI: HANDLE ENCRYPTION!!!
  if (frameCtrlData.isEncrypted() && data != null) {
    const aes = new BlufiAES(mAESKey, AES_TRANSFORMATION, generateAESIV(sequence));
    data = aes.encrypt(data);
  }
  if (data != null) {
    byteOS.write(data, 0, data.length);
  }

  if (checksumBytes != null) {
    byteOS.write(checksumBytes[0]);
    byteOS.write(checksumBytes[1]);
  }

  return byteOS.slice(0);
}

async function postNonData(encrypt, checksum, requireAck, type) {
  const frameCtrl = FrameCtrlData.getFrameCTRLValue(encrypt, checksum, BlufiParameter.DIRECTION_OUTPUT, requireAck, false);
  const sequence = generateSendSequence();
  const dataLen = 0;

  const postBytes = getPostBytes(type, frameCtrl, sequence, dataLen, null);
  gattWrite(postBytes);

  return !requireAck || await receiveAck(sequence);
}

async function postContainData(encrypt, checksum, requireAck, type, data) {
  let dataIS = new ByteArrayInputStream(data);
  let postOS = Buffer.from();
  // SAMI: HANDLE THIS SOMEHOW !!!
  // let pkgLengthLimit = mPackageLengthLimit > 0 ? mPackageLengthLimit :
  //   (mBlufiMTU > 0 ? mBlufiMTU : DEFAULT_PACKAGE_LENGTH); !!!!
  let pkgLengthLimit = DEFAULT_PACKAGE_LENGTH;
  let postDataLengthLimit = pkgLengthLimit - PACKAGE_HEADER_LENGTH;
  postDataLengthLimit -= 2; // if flag, two bytes total length in data
  if (checksum) {
    postDataLengthLimit -= 2;
  }
  let dateBuf = Buffer.alloc(postDataLengthLimit);
  while (true) {
    let read = dataIS.read(dateBuf, 0, dateBuf.length);
    if (read === -1) {
      break;
    }

    postOS.write(dateBuf, 0, read);
    if (dataIS.available() === 2) {
      postOS.write(dataIS.read());
      postOS.write(dataIS.read());
    }
    let frag = dataIS.available() > 0;
    let frameCtrl = FrameCtrlData.getFrameCTRLValue(encrypt, checksum, BlufiParameter.DIRECTION_OUTPUT, requireAck, frag);
    let sequence = generateSendSequence();
    if (frag) {
      let totalLen = postOS.size() + dataIS.available();
      let tempData = postOS.slice(0);
      postOS = Buffer.from([totalLen & 0xff, totalLen >> 8 & 0xff, tempData, 0, tempData.length]);
    }
    let postBytes = getPostBytes(type, frameCtrl, sequence, postOS.size(), postOS.slice(0));
    postOS = Buffer.from();
    gattWrite(postBytes);
    if (frag) {
      if (requireAck && !await receiveAck(sequence)) {
        return false;
      }
    } else {
      return !requireAck || receiveAck(sequence);
    }
  }

  return true;
}

async function post(encrypt, checksum, requireAck, type, data) {
  if (data == null || data.length === 0) {
    return await postNonData(encrypt, checksum, requireAck, type);
  } else {
    return await postContainData(encrypt, checksum, requireAck, type, data);
  }
}

async function postDeviceMode(deviceMode) {
  const type = getTypeValue(BlufiParameter.Type.Ctrl.PACKAGE_VALUE, BlufiParameter.Type.Ctrl.SUBTYPE_SET_OP_MODE);
  // byte[] data = {(byte) deviceMode}; !!!
  let data = stringToBytes(deviceMode + '');

  try {
    return await post(mEncrypted, mChecksum, true, type, data);
  } catch (e) {
    return false;
  }
}

async function postStaWifiInfo(ssid, password) {
  try {
    let ssidType = getTypeValue(BlufiParameter.Type.Data.PACKAGE_VALUE, BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_SSID);
    if (!await post(mEncrypted, mChecksum, mRequireAck, ssidType, stringToBytes(ssid))) {
      return false;
    }
    // sleep(10);

    let pwdType = getTypeValue(BlufiParameter.Type.Data.PACKAGE_VALUE, BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_PASSWORD);
    if (!await post(mEncrypted, mChecksum, mRequireAck, pwdType, stringToBytes(password))) {
      return false;
    }
    // sleep(10);

    let comfirmType = getTypeValue(BlufiParameter.Type.Ctrl.PACKAGE_VALUE, BlufiParameter.Type.Ctrl.SUBTYPE_CONNECT_WIFI);
    return await post(false, false, mRequireAck, comfirmType, null);
  } catch (e) {
    return false;
  }
}

//-------------------------------------- END HANDLE WRITE --------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

//-------------------------------------- HANDLE NOTIFICATIONS ----------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
function parseVersion(data) {
  if (data.length !== 2) {
    onVersionResponse(BlufiCallback.CODE_INVALID_DATA, null);
  }

  onVersionResponse(BlufiCallback.STATUS_SUCCESS, toInt(data[0]) + '.' + toInt(data[1]));
}

function parseWifiState(data) {
  // if (data.length < 3) {
  //   onStatusResponse(BlufiCallback.CODE_INVALID_DATA, null);
  //   return;
  // }
  //
  // BlufiStatusResponse response = new BlufiStatusResponse();
  //
  // ByteArrayInputStream dataIS = new ByteArrayInputStream(data);
  //
  // int opMode = dataIS.read() & 0xff;
  // response.setOpMode(opMode);
  //
  // int staConn = dataIS.read() & 0xff;
  // response.setStaConnectionStatus(staConn);
  //
  // int softAPConn = dataIS.read() & 0xff;
  // response.setSoftAPConnectionCount(softAPConn);
  //
  // while (dataIS.available() > 0) {
  //   int infoType = dataIS.read() & 0xff;
  //   int len = dataIS.read() & 0xff;
  //   byte[] stateBytes = new byte[len];
  //   for (int i = 0; i < len; i++) {
  //     stateBytes[i] = (byte) dataIS.read();
  //   }
  //
  //   parseWifiStateData(response, infoType, stateBytes);
  // }
  //
  // onStatusResponse(BlufiCallback.STATUS_SUCCESS, response);
}

function parseWifiScanList(data) {
  // List < BlufiScanResult > result = new LinkedList < > ();
  //
  // ByteArrayInputStream dataReader = new ByteArrayInputStream(data);
  // while (dataReader.available() > 0) {
  //   int length = dataReader.read() & 0xff;
  //   byte rssi = (byte) dataReader.read();
  //   byte[] ssidBytes = new byte[length - 1];
  //   int ssidRead = dataReader.read(ssidBytes, 0, ssidBytes.length);
  //   if (ssidRead != ssidBytes.length) {
  //     Log.w(TAG, 'Parse WifiScan failed');
  //     break;
  //   }
  //
  //   BlufiScanResult sr = new BlufiScanResult();
  //   sr.setType(BlufiScanResult.TYPE_WIFI);
  //   sr.setRssi(rssi);
  //   String ssid = new String(ssidBytes);
  //   sr.setSsid(ssid);
  //   result.add(sr);
  // }
  //
  // onDeviceScanResult(BlufiCallback.STATUS_SUCCESS, result);
}

function parseDataData(subType, data) {
  switch (subType) {
    case BlufiParameter.Type.Data.SUBTYPE_NEG:
      // SAMI: HANDLE THIS SOMEHOW !!!
      // mSecurityCallback.onReceiveDevicePublicKey(data);
      break;
    case BlufiParameter.Type.Data.SUBTYPE_VERSION:
      parseVersion(data);
      break;
    case BlufiParameter.Type.Data.SUBTYPE_WIFI_CONNECTION_STATE:
      parseWifiState(data);
      break;
    case BlufiParameter.Type.Data.SUBTYPE_WIFI_LIST:
      parseWifiScanList(data);
      break;
    case BlufiParameter.Type.Data.SUBTYPE_CUSTOM_DATA:
      onReceiveCustomData(BlufiCallback.STATUS_SUCCESS, data);
      break;
    case BlufiParameter.Type.Data.SUBTYPE_ERROR:
      const errCode = data.length > 0 ? (data[0] & 0xff) : 0xff;
      onError(errCode);
      break;
  }
}

function parseAck(data) {
  let ack = -1;
  if (data.length > 0) {
    ack = data[0] & 0xff;
  }

  mAck.add(ack);
}

function parseCtrlData(subType, data) {
  if (subType === BlufiParameter.Type.Ctrl.SUBTYPE_ACK) {
    parseAck(data);
  }
}

function parseBlufiNotifyData(data) {
  const pkgType = data.pkgType;
  const subType = data.subType;

  switch (pkgType) {
    case BlufiParameter.Type.Ctrl.PACKAGE_VALUE:
      parseCtrlData(subType, data.getDataArray());
      break;
    case BlufiParameter.Type.Data.PACKAGE_VALUE:
      parseDataData(subType, data.getDataArray());
      break;
  }
}

function parseNotification(response, notification) {
  if (response == null) {
    Log.w(TAG, 'parseNotification null data');
    return -1;
  }

  if (response.length < 4) {
    Log.w(TAG, 'parseNotification data length less than 4');
    return -2;
  }

  let sequence = toInt(response[2]);
  if (sequence !== generateReadSequence()) {
    Log.w(TAG, 'parseNotification read sequence wrong');
    return -3;
  }

  let type = toInt(response[0]);
  let pkgType = getPackageType(type);
  let subType = getSubType(type);
  notification.type = type;
  notification.pkgType = pkgType;
  notification.subType = subType;

  let frameCtrl = toInt(response[1]);
  notification.frameCtrl = frameCtrl;
  let frameCtrlData = new FrameCtrlData(frameCtrl);

  let dataLen = toInt(response[3]);
  let dataBytes = new Buffer.alloc(dataLen);
  let dataOffset = 4;
  try {
    // SAMI: CHECK THIS !!!
    // public static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
    // System.arraycopy(response, dataOffset, dataBytes, 0, dataLen);
    response.copy(dataBytes, 0, dataOffset, dataOffset + dataLen);
  } catch (e) {
    Log.w(TAG, e);
    return -100;
  }

  // SAMI: HANDLE ENCRYPTION!!!
  if (frameCtrlData.isEncrypted()) {
    const aes = new BlufiAES(mAESKey, AES_TRANSFORMATION, generateAESIV(sequence));
    dataBytes = aes.decrypt(dataBytes);
  }

  if (frameCtrlData.isChecksum()) {
    console.log('IT IS CHECK SUMMMMMMMMMMMMMMMMM');
    let respChecksum1 = toInt(response[response.length - 1]);
    let respChecksum2 = toInt(response[response.length - 2]);

    let checkByteOS = Buffer.from([sequence, dataLen]);
    for (let b in dataBytes) {
      checkByteOS.write(b);
    }
    let checksum = BlufiCRC.calcCRC(0, checkByteOS.slice(0));

    let calcChecksum1 = (checksum >> 8) & 0xff;
    let calcChecksum2 = checksum & 0xff;
    if (respChecksum1 !== calcChecksum1 || respChecksum2 !== calcChecksum2) {
      return -4;
    }
  }

  if (frameCtrlData.hasFrag()) {
    //            int totalLen = dataBytes[0] | (dataBytes[1] << 8);
    dataOffset = 2;
  } else {
    dataOffset = 0;
  }
  // SAMI: HANDLE CHUNKS(make sure code below is working) !!!
  // for (let i = dataOffset; i < dataBytes.length; i++) {
  //   notification.addData(dataBytes[i]);
  // }
  notification.data = Buffer.from([notification.data || '', dataBytes.slice(dataOffset, dataBytes.length)]);

  return frameCtrlData.hasFrag() ? 1 : 0;
}

//----------------------------------- END HANDLE NOTIFICATIONS ---------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------


function onError(...args) {
  console.log('onError: ', ...args);
}

function onVersionResponse(...args) {
  console.log('onVersionResponse: ', ...args);
}

function onReceiveCustomData(...args) {
  console.log('onReceiveCustomData: ', ...args);
}

function onStatusResponse(...args) {
  console.log('onStatusResponse: ', ...args);
}

function onDeviceScanResult(...args) {
  console.log('onDeviceScanResult: ', ...args);
}

const Blufi = {
  configure(device, ssid, password) {
    connectedDevice = device;
    return new Promise(async (resolve, reject) => {
      if (!await postDeviceMode(BlufiParameter.OP_MODE_STA)) {
        reject(BlufiCallback.CODE_CONF_ERR_SET_OPMODE);
        return;
      }
      if (!await postStaWifiInfo(ssid, password)) {
        reject(BlufiCallback.CODE_CONF_ERR_POST_STA);
        return;
      }

      resolve(BlufiCallback.STATUS_SUCCESS);
    });
  },

  onCharacteristicChanged(data) {
    // if (!characteristic.equals(mNotifyChar)) { !!!
    //     return;
    // }
    //
    // if (mNotifyData == null) {
    //     mNotifyData = new BlufiNotifyData();
    // }
    //
    // byte[] data = characteristic.getValue();

    // lt 0 is error, eq 0 is complete, gt 0 is continue
    const notification = {};
    const parse = parseNotification(data, notification);
    if (parse < 0) {
      onError(BlufiCallback.CODE_INVALID_NOTIFICATION);
    } else if (parse === 0) {
      parseBlufiNotifyData(notification);
      // notification = {};
    }
  },

  requestDeviceVersion(){
    const type = getTypeValue(BlufiParameter.Type.Ctrl.PACKAGE_VALUE, BlufiParameter.Type.Ctrl.SUBTYPE_GET_VERSION);
    let request;
    try {
        request = post(mEncrypted, mChecksum, false, type, null);
    } catch (e) {
        Log.w(TAG, 'post requestDeviceVersion interrupted');
        request = false;
    }

    if (!request) {
        onVersionResponse(BlufiCallback.CODE_WRITE_DATA_FAILED, null);
    }
  }
}

export default Blufi;
