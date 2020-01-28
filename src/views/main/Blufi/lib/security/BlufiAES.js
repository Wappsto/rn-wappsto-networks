import AES from 'crypto-js/aes';
import Crypto from 'crypto';

const algorithm = 'AES-128-CFB';

class BlufiAES {
  mKey = null;
  mIV = null;
  mTransformation = null;

  constructor(key, iv) {
    this.mKey = key;
    this.mIV = iv;
  }

  encrypt(content) {
    return AES.encrypt(content, this.mKey, { iv: this.mIV });
  }

  decrypt(content) {
    return AES.decrypt(content, this.mKey, { iv: this.mIV });
  }
}

class BlufiAESCrypto {
  mKey = null;
  mIV = null;
  mTransformation = null;
  mEncryptCipher = null;
  mDecryptCipher = null;

  constructor(key, iv) {
    this.mKey = key;
    this.mIV = iv;

    this.mEncryptCipher = this.createEncryptCipher();
    this.mDecryptCipher = this.createDecryptCipher();
  }

  createEncryptCipher() {
    return Crypto.createCipheriv(algorithm, this.mKey, this.mIV);
  }

  createDecryptCipher() {
    return Crypto.createDecipheriv(algorithm, this.mKey, this.mIV);
  }

  encrypt(content) {
    this.mEncryptCipher.update(content);
    return this.mEncryptCipher.final();
  }

  decrypt(content) {
    this.mDecryptCipher.update(content);
    return this.mDecryptCipher.final();
  }
}


export default BlufiAESCrypto;
