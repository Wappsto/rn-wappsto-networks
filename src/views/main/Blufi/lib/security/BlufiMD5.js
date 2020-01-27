import Crypto from 'crypto';

export default {
  getMD5Bytes(data) {
    try {
        // MessageDigest digest = MessageDigest.getInstance("md5");
        // digest.update(data);
        // return digest.digest();
        return Crypto.createHash('md5').update(data).digest();
    } catch (e) {
        console.log(e);
    }

    return null;
  }
}
