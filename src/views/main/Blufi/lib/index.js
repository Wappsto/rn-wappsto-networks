import {
  BlufiParameter,
  BlufiCallback
} from './util/params';
import {
  stringToBytes
} from 'convert-string';
import {
  FrameCtrlData
} from './FrameCtrlData';
import {
  Buffer
} from 'buffer';
import BleManager from 'react-native-ble-manager';

// workaround-------------------
const BlufiCRC = {};
//------------------------------

const mEncrypted = false;
const mChecksum = false;
const mRequireAck = false;
const mAck = [];

let connectedDevice = null;
let mSendSequence = 0;

function getTypeValue(type, subtype) {
  return (subtype << 2) | type;
}

function generateSendSequence() {
  const prev = mSendSequence;
  mSendSequence++;
  return prev;
}

function receiveAck(sequence) {
  try {
    const ack = mAck.shift();
    return ack === sequence;
  } catch (e) {
    return false;
  }
}

function getPostBytes(type, frameCtrl, sequence, dataLength, data) {
  let byteOS = Buffer.from([type, frameCtrl, sequence, dataLength]);

  let frameCtrlData = FrameCtrlData.setData(frameCtrl);
  // byte[] checksumBytes = null;
  let checksumBytes = null;
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
    // checksumBytes = new byte[] {
    //   checksumByte1,
    //   checksumByte2
    // };
    checksumBytes = Buffer.from(checksumByte1, checksumByte2);
  }

  // SAMI: HANDLE ENCRYPTION!!!
  // if (frameCtrlData.isEncrypted() && data != null) {
  //   BlufiAES aes = new BlufiAES(mAESKey, AES_TRANSFORMATION, generateAESIV(sequence));
  //   data = aes.encrypt(data);
  // }
  if (data != null) {
    byteOS.write(data, 0, data.length);
  }

  if (checksumBytes != null) {
    byteOS.write(checksumBytes[0]);
    byteOS.write(checksumBytes[1]);
  }

  return byteOS.slice(0);
}

function postNonData(encrypt, checksum, requireAck, type) {
  const frameCtrl = FrameCtrlData.getFrameCTRLValue(encrypt, checksum, BlufiParameter.DIRECTION_OUTPUT, requireAck, false);
  const sequence = generateSendSequence();
  const dataLen = 0;

  const postBytes = getPostBytes(type, frameCtrl, sequence, dataLen, null);
  // gattWrite(postBytes);

  BleManager.write(connectedDevice.id, BlufiParameter.UUID_SERVICE, BlufiParameter.UUID_WRITE_CHARACTERISTIC, postBytes);
  return !requireAck || receiveAck(sequence);
}

function postContainData(encrypt, checksum, requireAck, type, data) {
  // ByteArrayInputStream dataIS = new ByteArrayInputStream(data);
  // ByteArrayOutputStream postOS = new ByteArrayOutputStream();
  // int pkgLengthLimit = mPackageLengthLimit > 0 ? mPackageLengthLimit :
  //   (mBlufiMTU > 0 ? mBlufiMTU : DEFAULT_PACKAGE_LENGTH);
  // int postDataLengthLimit = pkgLengthLimit - PACKAGE_HEADER_LENGTH;
  // postDataLengthLimit -= 2; // if flag, two bytes total length in data
  // if (checksum) {
  //   postDataLengthLimit -= 2;
  // }
  // byte[] dateBuf = new byte[postDataLengthLimit];
  // while (true) {
  //   int read = dataIS.read(dateBuf, 0, dateBuf.length);
  //   if (read == -1) {
  //     break;
  //   }
  //
  //   postOS.write(dateBuf, 0, read);
  //   if (dataIS.available() == 2) {
  //     postOS.write(dataIS.read());
  //     postOS.write(dataIS.read());
  //   }
  //   boolean frag = dataIS.available() > 0;
  //   int frameCtrl = FrameCtrlData.getFrameCTRLValue(encrypt, checksum, DIRECTION_OUTPUT, requireAck, frag);
  //   int sequence = generateSendSequence();
  //   if (frag) {
  //     int totalLen = postOS.size() + dataIS.available();
  //     byte[] tempData = postOS.toByteArray();
  //     postOS.reset();
  //     postOS.write(totalLen & 0xff);
  //     postOS.write(totalLen >> 8 & 0xff);
  //     postOS.write(tempData, 0, tempData.length);
  //   }
  //   byte[] postBytes = getPostBytes(type, frameCtrl, sequence, postOS.size(), postOS.toByteArray());
  //   postOS.reset();
  //   gattWrite(postBytes);
  //   if (frag) {
  //     if (requireAck && !receiveAck(sequence)) {
  //       return false;
  //     }
  //     sleep(10 L);
  //   } else {
  //     return !requireAck || receiveAck(sequence);
  //   }
  // }
  //
  // return true;
}

function post(encrypt, checksum, requireAck, type, data) {
  if (data == null || data.length === 0) {
    return postNonData(encrypt, checksum, requireAck, type);
  } else {
    return postContainData(encrypt, checksum, requireAck, type, data);
  }
}

function postDeviceMode(deviceMode) {
  const type = getTypeValue(BlufiParameter.Type.Ctrl.PACKAGE_VALUE, BlufiParameter.Type.Ctrl.SUBTYPE_SET_OP_MODE);
  // byte[] data = {(byte) deviceMode}; !!!
  let data = stringToBytes(deviceMode);

  try {
    return post(mEncrypted, mChecksum, true, type, data);
  } catch (e) {
    return false;
  }
}

function postStaWifiInfo(ssid, password) {
  try {
    let ssidType = getTypeValue(BlufiParameter.Type.Data.PACKAGE_VALUE, BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_SSID);
    if (!post(mEncrypted, mChecksum, mRequireAck, ssidType, stringToBytes(ssid))) {
      return false;
    }
    // sleep(10);

    let pwdType = getTypeValue(BlufiParameter.Type.Data.PACKAGE_VALUE, BlufiParameter.Type.Data.SUBTYPE_STA_WIFI_PASSWORD);
    if (!post(mEncrypted, mChecksum, mRequireAck, pwdType, stringToBytes(password))) {
      return false;
    }
    // sleep(10);

    let comfirmType = getTypeValue(BlufiParameter.Type.Ctrl.PACKAGE_VALUE, BlufiParameter.Type.Ctrl.SUBTYPE_CONNECT_WIFI);
    return post(false, false, mRequireAck, comfirmType, null);
  } catch (e) {
    return false;
  }
}

const Blufi = {
  onConfigureResult() {
    // SAMI: Handle this!!!
    console.log.apply(this, arguments);
  },

  configure(device, ssid, password) {
    connectedDevice = device;
    if (!postDeviceMode(BlufiParameter.OP_MODE_STA)) {
      this.onConfigureResult(BlufiCallback.CODE_CONF_ERR_SET_OPMODE);
      return;
    }
    if (!postStaWifiInfo(ssid, password)) {
      this.onConfigureResult(BlufiCallback.CODE_CONF_ERR_POST_STA);
      return;
    }

    this.onConfigureResult(BlufiCallback.STATUS_SUCCESS);
  }
}

export default Blufi;
