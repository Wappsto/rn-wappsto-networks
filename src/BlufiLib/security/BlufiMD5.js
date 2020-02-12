import Crypto from 'crypto';

export default {
  getMD5Bytes(data) {
    try {
      const digest = Crypto.createHash('md5');
      digest.update(data);
      return digest.digest();
    } catch (e) {
      console.log(e);
    }

    return null;
  }
}
