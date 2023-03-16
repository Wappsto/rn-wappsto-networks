import { BlufiParameter, BlufiCallback } from './util/params';
import FrameCtrlData from './FrameCtrlData';
import BleManager from 'react-native-ble-manager';
import ByteArrayInputStream from './ByteArrayInputStream';
import LinkedBlockingQueue from './LinkedBlockingQueue';
import BlufiCRC from './security/BlufiCRC';
import BlufiAES from './security/BlufiAES';
import BlufiDH from './security/BlufiDH';
import BlufiMD5 from './security/BlufiMD5';
import Log from './Log';
const Buffer = require('buffer/').Buffer;
// workaround-------------------
//------------------------------
const TAG = 'BlufiClientImpl';
let mEncrypted = false;
let mChecksum = false;
let mAESKey = null;
const mRequireAck = false;
const mAck = new LinkedBlockingQueue();
const mDevicePublicKeyQueue = new LinkedBlockingQueue();
let notification = {};

const DEFAULT_PACKAGE_LENGTH = 20;
const PACKAGE_HEADER_LENGTH = 4;
const MIN_PACKAGE_LENGTH = 7;
const DH_P =
  'cf5cf5c38419a724957ff5dd323b9c45c3cdd261eb740f69aa94b8bb1a5c9640' +
  '9153bd76b24222d03274e4725a5406092e9e82e9135c643cae98132b0d95f7d6' +
  '5347c68afc1e677da90e51bbab5f5cf429c291b4ba39c6b2dc5e8c7231e46aa7' +
  '728e87664532cdf547be20c9a3fa8342be6e34371a27c06f7dc0edddd2f86373';
const DH_G = '2';

let mSendSequence = 0;
let mReadSequence = -1;

const Blufi = {
  setConnectedDevice(device) {
    Blufi.connectedDevice = device;
  },

  configure(ssid, password) {
    if (!Blufi.connectedDevice) {
      console.error('Blufi: no connected device');
      return;
    }
    return new Promise(async (resolve, reject) => {
      if (!(await postDeviceMode(BlufiParameter.OP_MODE_STA))) {
        reject(BlufiCallback.CODE_CONF_ERR_SET_OPMODE);
      }
      if (!(await postStaWifiInfo(ssid, password))) {
        reject(BlufiCallback.CODE_CONF_ERR_POST_STA);
      }

      resolve(BlufiCallback.STATUS_SUCCESS);
    });
  },

  async postCustomData(data) {
    if (!Blufi.connectedDevice) {
      console.error('Blufi: no connected device');
      return;
    }
    const status = await _postCustomData(data);
    return status;
  },

  async requestDeviceVersion() {
    if (!Blufi.connectedDevice) {
      console.error('Blufi: no connected device');
      return;
    }
    const type = getTypeValue(
      BlufiParameter.Type.Ctrl.PACKAGE_VALUE,
      BlufiParameter.Type.Ctrl.SUBTYPE_GET_VERSION,
    );
    let request;
    try {
      request = await post(mEncrypted, mChecksum, false, type, null);
    } catch (e) {
      Log.w(TAG, 'post requestDeviceVersion interrupted');
      request = false;
    }

    if (!request) {
      onVersionResponse(BlufiCallback.CODE_WRITE_DATA_FAILED, null);
    }
  },

  async requestDeviceWifiScan() {
    if (!Blufi.connectedDevice) {
      console.error('Blufi: no connected device');
      return;
    }
    const type = getTypeValue(
      BlufiParameter.Type.Ctrl.PACKAGE_VALUE,
      BlufiParameter.Type.Ctrl.SUBTYPE_GET_WIFI_LIST,
    );
    let request, error;
    try {
      request = await post(mEncrypted, mChecksum, mRequireAck, type, null);
    } catch (e) {
      Log.w(TAG, 'post requestDeviceWifiScan interrupted');
      error = e;
      request = false;
    }

    if (!request) {
      onDeviceScanResult(BlufiCallback.CODE_WRITE_DATA_FAILED, [], error);
    }
  },

  negotiateSecurity() {
    if (!Blufi.connectedDevice) {
      console.error('Blufi: no connected device');
      return;
    }
    return _negotiateSecurity();
  },

  onCharacteristicChanged(data) {
    const parse = parseNotification(data);
    if (parse < 0) {
      onError(BlufiCallback.CODE_INVALID_NOTIFICATION);
    } else if (parse === 0) {
      parseBlufiNotifyData(notification);
      notification = {};
    }
  },

  onCustomCharacteristicChanged({ value }) {
    Blufi.onCharacteristicChanged(value);
  },

  reset() {
    Blufi.connectedDevice = null;
    mSendSequence = 0;
    mReadSequence = -1;
    mAck.clear();
    mDevicePublicKeyQueue.clear();
  },
};

function getTypeValue(type, subtype) {
  return (subtype << 2) | type;
}

function generateSendSequence() {
  return mSendSequence++;
}

function generateReadSequence() {
  mReadSequence++;
  return mReadSequence;
}

function generateAESIV(sequence) {
  const result = Buffer.alloc(16, 0);
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
  return (typeValue & 0b11111100) >> 2;
}

function toBytes(hex) {
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  const result = Buffer.alloc(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return result;
}

function toHex(byteArray) {
  let result = '';
  byteArray.forEach((b) => {
    const number = b & 0xff;
    const str = number.toString(16);
    if (str.length === 1) {
      result += '0';
    }
    result += str;
  });
  return result;
}
//-----------------------------------------  HANDLE WRITE --------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

async function gattWrite(data) {
  if (Blufi.connectedDevice && Blufi.connectedDevice.id) {
    await BleManager.write(
      Blufi.connectedDevice.id,
      BlufiParameter.UUID_SERVICE,
      BlufiParameter.UUID_WRITE_CHARACTERISTIC,
      data,
    );
  }
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

  const frameCtrlData = new FrameCtrlData(frameCtrl);
  let checksumBytes = null;
  if (frameCtrlData.isChecksum()) {
    let willCheckBytes = Buffer.from([sequence, dataLength]);
    if (data !== null) {
      const os = Buffer.from([...willCheckBytes, ...data]);
      willCheckBytes = Array.prototype.slice.call(os, 0);
    }
    let checksum = BlufiCRC.calcCRC(0, willCheckBytes);
    let checksumByte1 = checksum & 0xff;
    let checksumByte2 = (checksum >> 8) & 0xff;
    checksumBytes = Buffer.from([checksumByte1, checksumByte2]);
  }

  if (frameCtrlData.isEncrypted() && data !== null) {
    const aes = new BlufiAES(mAESKey, generateAESIV(sequence));
    data = aes.encrypt(Buffer.from(data));
  }
  if (data !== null) {
    byteOS = Buffer.from([...byteOS, ...data]);
  }

  if (checksumBytes !== null) {
    byteOS = Buffer.from([...byteOS, checksumBytes[0], checksumBytes[1]]);
  }

  return Array.prototype.slice.call(byteOS, 0);
}

async function postNonData(encrypt, checksum, requireAck, type) {
  const frameCtrl = FrameCtrlData.getFrameCTRLValue(
    encrypt,
    checksum,
    BlufiParameter.DIRECTION_OUTPUT,
    requireAck,
    false,
  );
  const sequence = generateSendSequence();
  const dataLen = 0;
  const postBytes = getPostBytes(type, frameCtrl, sequence, dataLen, null);
  await gattWrite(postBytes);

  return !requireAck || (await receiveAck(sequence));
}

async function postContainData(encrypt, checksum, requireAck, type, data) {
  let dataIS = new ByteArrayInputStream(data);
  let postOS = Buffer.from([]);
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

    postOS = Buffer.from([...postOS, ...Array.prototype.slice.call(dateBuf, 0, read)]);
    if (dataIS.available() === 2) {
      postOS = Buffer.from([...postOS, dataIS.read(), dataIS.read()]);
    }
    let frag = dataIS.available() > 0;
    let frameCtrl = FrameCtrlData.getFrameCTRLValue(
      encrypt,
      checksum,
      BlufiParameter.DIRECTION_OUTPUT,
      requireAck,
      frag,
    );
    let sequence = generateSendSequence();
    if (frag) {
      let totalLen = postOS.length + dataIS.available();
      postOS = Buffer.from([
        totalLen & 0xff,
        (totalLen >> 8) & 0xff,
        ...Array.prototype.slice.call(postOS, 0),
      ]);
    }
    let postBytes = getPostBytes(
      type,
      frameCtrl,
      sequence,
      postOS.length,
      Array.prototype.slice.call(postOS, 0),
    );
    postOS = Buffer.from([]);
    await gattWrite(postBytes);
    if (frag) {
      if (requireAck && !(await receiveAck(sequence))) {
        return false;
      }
    } else {
      const result = !requireAck || (await receiveAck(sequence));
      return result;
    }
  }

  return true;
}

async function post(encrypt, checksum, requireAck, type, data) {
  if (data === null || data.length === 0) {
    return await postNonData(encrypt, checksum, requireAck, type);
  } else {
    return await postContainData(encrypt, checksum, requireAck, type, data);
  }
}

async function postDeviceMode(deviceMode) {
  const type = getTypeValue(
    BlufiParameter.Type.Ctrl.PACKAGE_VALUE,
    BlufiParameter.Type.Ctrl.SUBTYPE_SET_OP_MODE,
  );
  const data = Buffer.from([deviceMode]);

  try {
    const result = await post(mEncrypted, mChecksum, true, type, data);
    return result;
  } catch (e) {
    return false;
  }
}

async function postStaWifiInfo(ssid, password) {
  try {
    let ssidType = getTypeValue(
      BlufiParameter.Type.Data.PACKAGE_VALUE,
      BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_SSID,
    );
    if (!(await post(mEncrypted, mChecksum, mRequireAck, ssidType, Buffer.from(ssid)))) {
      return false;
    }
    // await sleep(10);

    let pwdType = getTypeValue(
      BlufiParameter.Type.Data.PACKAGE_VALUE,
      BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_PASSWORD,
    );
    if (!(await post(mEncrypted, mChecksum, mRequireAck, pwdType, Buffer.from(password)))) {
      return false;
    }
    // await sleep(10);

    let comfirmType = getTypeValue(
      BlufiParameter.Type.Ctrl.PACKAGE_VALUE,
      BlufiParameter.Type.Ctrl.SUBTYPE_CONNECT_WIFI,
    );
    return await post(false, false, mRequireAck, comfirmType, null);
  } catch (e) {
    return false;
  }
}

async function _postCustomData(data) {
  const type = getTypeValue(
    BlufiParameter.Type.Data.PACKAGE_VALUE,
    BlufiParameter.Type.Data.SUBTYPE_CUSTOM_DATA,
  );
  const suc = await post(mEncrypted, mChecksum, mRequireAck, type, Buffer.from(data));
  const status = suc ? BlufiCallback.STATUS_SUCCESS : BlufiCallback.CODE_WRITE_DATA_FAILED;
  return status;
}

function getPublicValue(espDH) {
  const publicKey = espDH.getPublicKey().toString('hex');
  if (publicKey) {
    let keySB = publicKey;
    while (keySB.length < 256) {
      keySB = '0' + keySB;
    }
    return keySB;
  }

  return null;
}

async function postSetSecurity(ctrlEncrypted, ctrlChecksum, dataEncrypted, dataChecksum) {
  const type = getTypeValue(
    BlufiParameter.Type.Ctrl.PACKAGE_VALUE,
    BlufiParameter.Type.Ctrl.SUBTYPE_SET_SEC_MODE,
  );
  let data = 0;
  if (dataChecksum) {
    data |= 1;
  }
  if (dataEncrypted) {
    data |= 0b10;
  }
  if (ctrlChecksum) {
    data |= 0b10000;
  }
  if (ctrlEncrypted) {
    data |= 0b100000;
  }

  const postData = Buffer.from([data]);

  return await post(false, true, mRequireAck, type, postData);
}

async function postNegotiateSecurity() {
  const type = getTypeValue(
    BlufiParameter.Type.Data.PACKAGE_VALUE,
    BlufiParameter.Type.Data.SUBTYPE_NEG,
  );

  const dhLength = 1024;
  const dhP = DH_P;
  const dhG = DH_G;
  let espDH;

  espDH = new BlufiDH(dhP, dhG, dhLength);
  const pBytes = espDH.mDh.getPrime();
  const gBytes = espDH.mDh.getGenerator();
  const kBytes = espDH.mDh.getPublicKey();

  let dataOS;

  const pgkLength = pBytes.length + gBytes.length + kBytes.length + 6;
  const pgkLen1 = (pgkLength >> 8) & 0xff;
  const pgkLen2 = pgkLength & 0xff;

  dataOS = Buffer.from([BlufiParameter.NEG_SET_SEC_TOTAL_LEN, pgkLen1, pgkLen2]);

  const postLength = await post(false, false, mRequireAck, type, dataOS);
  if (!postLength) {
    return null;
  }
  // await sleep(10);

  const pLength = pBytes.length;
  const pLen1 = (pLength >> 8) & 0xff;
  const pLen2 = pLength & 0xff;

  const gLength = gBytes.length;
  const gLen1 = (gLength >> 8) & 0xff;
  const gLen2 = gLength & 0xff;

  const kLength = kBytes.length;
  const kLen1 = (kLength >> 8) & 0xff;
  const kLen2 = kLength & 0xff;
  dataOS = Buffer.from([
    BlufiParameter.NEG_SET_SEC_ALL_DATA,
    pLen1,
    pLen2,
    ...pBytes,
    gLen1,
    gLen2,
    ...gBytes,
    kLen1,
    kLen2,
    ...kBytes,
  ]);

  const postPGK = await post(false, false, mRequireAck, type, dataOS);
  if (!postPGK) {
    return null;
  }
  return espDH;
}

async function _negotiateSecurity() {
  const espDH = await postNegotiateSecurity();
  if (espDH === null) {
    Log.w(TAG, 'negotiateSecurity postNegotiateSecurity failed');
    onNegotiateSecurityResult(BlufiCallback.CODE_NEG_POST_FAILED);
  }
  const devicePublicKey = await mDevicePublicKeyQueue.take();
  if (devicePublicKey.length === 0) {
    onNegotiateSecurityResult(BlufiCallback.CODE_NEG_ERR_DEV_KEY);
  }

  espDH.generateSecretKey(devicePublicKey);
  if (espDH.getSecretKey() === null) {
    onNegotiateSecurityResult(BlufiCallback.CODE_NEG_ERR_SECURITY);
  }

  mAESKey = BlufiMD5.getMD5Bytes(espDH.getSecretKey());

  const setSecurity = await postSetSecurity(false, false, true, true);

  if (setSecurity) {
    mEncrypted = true;
    mChecksum = true;
    onNegotiateSecurityResult(BlufiCallback.STATUS_SUCCESS);
  } else {
    mEncrypted = false;
    mChecksum = false;
    onNegotiateSecurityResult(BlufiCallback.CODE_NEG_ERR_SET_SECURITY);
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

function parseWifiStateData(response, infoType, data) {
  switch (infoType) {
    case BlufiParameter.Type.Data.SUBTYPE_SOFTAP_AUTH_MODE:
      const authMode = toInt(data[0]);
      response.softAPSecrity = authMode;
      break;
    case BlufiParameter.Type.Data.SUBTYPE_SOFTAP_CHANNEL:
      const softAPChannel = toInt(data[0]);
      response.softAPChannel = softAPChannel;
      break;
    case BlufiParameter.Type.Data.SUBTYPE_SOFTAP_MAX_CONNECTION_COUNT:
      const softAPMaxConnCount = toInt(data[0]);
      response.softAPMaxConnectionCount = softAPMaxConnCount;
      break;
    case BlufiParameter.Type.Data.SUBTYPE_SOFTAP_WIFI_PASSWORD:
      const softapPassword = data.toString();
      response.softAPPassword = softapPassword;
      break;
    case BlufiParameter.Type.Data.SUBTYPE_SOFTAP_WIFI_SSID:
      const softapSSID = data.toString();
      response.softAPSSID = softapSSID;
      break;
    case BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_BSSID:
      const staBssid = toHex(data);
      response.staBSSID = staBssid;
      break;
    case BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_SSID:
      const staSsid = data.toString();
      response.staSSID = staSsid;
      break;
    case BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_PASSWORD:
      const staPassword = data.toString();
      response.staPassword = staPassword;
      break;
  }
}

function parseWifiState(data) {
  if (data.length < 3) {
    onStatusResponse(BlufiCallback.CODE_INVALID_DATA, null);
    return;
  }

  const response = {};

  const dataIS = new ByteArrayInputStream(data);

  const opMode = dataIS.read() & 0xff;
  response.opMode = opMode;

  const staConn = dataIS.read() & 0xff;
  response.staConnectionStatus = staConn;

  const softAPConn = dataIS.read() & 0xff;
  response.softAPConnectionCount = softAPConn;

  while (dataIS.available() > 0) {
    const infoType = dataIS.read() & 0xff;
    const len = dataIS.read() & 0xff;
    const stateBytes = Buffer.alloc(len);
    for (let i = 0; i < len; i++) {
      stateBytes[i] = dataIS.read();
    }

    parseWifiStateData(response, infoType, stateBytes);
  }

  onStatusResponse(BlufiCallback.STATUS_SUCCESS, response);
}

function parseWifiScanList(data) {
  const result = [];
  const dataReader = new ByteArrayInputStream(data);
  while (dataReader.available() > 0) {
    const length = dataReader.read() & 0xff;
    const rssi = dataReader.read();
    const ssidBytes = Buffer.alloc(length - 1);
    const ssidRead = dataReader.read(ssidBytes, 0, ssidBytes.length);
    if (ssidRead !== ssidBytes.length) {
      Log.w(TAG, 'Parse WifiScan failed');
      break;
    }

    const scanResult = {};
    scanResult.type = 0x01;
    scanResult.rssi = rssi > 0x7f ? rssi - 0x100 : rssi;
    scanResult.ssid = ssidBytes.toString();
    result.push(scanResult);
  }

  onDeviceScanResult(BlufiCallback.STATUS_SUCCESS, result);
}

function parseDataData(subType, data) {
  switch (subType) {
    case BlufiParameter.Type.Data.SUBTYPE_NEG:
      onReceiveDevicePublicKey(data);
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
      const errCode = data.length > 0 ? data[0] & 0xff : 0xff;
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
      parseCtrlData(subType, data.data);
      break;
    case BlufiParameter.Type.Data.PACKAGE_VALUE:
      parseDataData(subType, data.data);
      break;
  }
}

function parseNotification(response) {
  if (response === null) {
    Log.w(TAG, 'parseNotification null data');
    return -1;
  }
  response = Buffer.from(response);

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
    response.copy(dataBytes, 0, dataOffset, dataOffset + dataLen);
  } catch (e) {
    Log.w(TAG, e);
    return -100;
  }

  if (frameCtrlData.isEncrypted()) {
    const aes = new BlufiAES(mAESKey, generateAESIV(sequence));
    dataBytes = aes.decrypt(dataBytes);
  }

  if (frameCtrlData.isChecksum()) {
    let respChecksum1 = toInt(response[response.length - 1]);
    let respChecksum2 = toInt(response[response.length - 2]);

    let checkByteOS = Buffer.from([sequence, dataLen, ...dataBytes]);
    let checksum = BlufiCRC.calcCRC(0, checkByteOS);

    let calcChecksum1 = (checksum >> 8) & 0xff;
    let calcChecksum2 = checksum & 0xff;
    if (respChecksum1 !== calcChecksum1 || respChecksum2 !== calcChecksum2) {
      return -4;
    }
  }

  if (frameCtrlData.hasFrag()) {
    dataOffset = 2;
  } else {
    dataOffset = 0;
  }
  notification.data = Buffer.from([...(notification.data || []), ...dataBytes.slice(dataOffset)]);
  return frameCtrlData.hasFrag() ? 1 : 0;
}

//----------------------------------- END HANDLE NOTIFICATIONS ---------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

function onError(...args) {
  console.log('onError: ', ...args);
  if (Blufi.onError) {
    Blufi.onError.apply(this, arguments);
  }
}

function onVersionResponse(...args) {
  console.log('onVersionResponse: ', ...args);
  if (Blufi.onVersionResponse) {
    Blufi.onVersionResponse.apply(this, arguments);
  }
}

function onReceiveCustomData(...args) {
  console.log('onReceiveCustomData: ', ...args);
  if (Blufi.onReceiveCustomData) {
    Blufi.onReceiveCustomData.apply(this, arguments);
  }
}

function onStatusResponse(...args) {
  console.log('onStatusResponse: ', ...args);
  if (Blufi.onStatusResponse) {
    Blufi.onStatusResponse.apply(this, arguments);
  }
}

function onDeviceScanResult(...args) {
  console.log('onDeviceScanResult: ', ...args);
  if (Blufi.onDeviceScanResult) {
    Blufi.onDeviceScanResult.apply(this, arguments);
  }
}

function onNegotiateSecurityResult(...args) {
  console.log('onNegotiateSecurityResult: ', ...args);
  if (Blufi.onNegotiateSecurityResult) {
    Blufi.onNegotiateSecurityResult.apply(this, arguments);
  }
}

function onReceiveDevicePublicKey(keyData) {
  const keyStr = toHex(keyData);
  mDevicePublicKeyQueue.add(Buffer.from(keyStr, 'hex'));
}

export default Blufi;
