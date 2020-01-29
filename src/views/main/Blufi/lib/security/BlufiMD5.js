import Crypto from 'crypto';

export default {
  getMD5Bytes(data) {
    try {
        // MessageDigest digest = MessageDigest.getInstance("md5");
        // digest.update(data);
        // return digest.digest();
        const digest = Crypto.createHash('md5');
        digest.update(data);
        return digest.digest();
    } catch (e) {
        console.log(e);
    }

    return null;
  }
}
