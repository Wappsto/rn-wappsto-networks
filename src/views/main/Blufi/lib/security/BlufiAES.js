import Crypto from 'crypto';

const algorithm = 'AES-128-CFB';

class BlufiAESCrypto {
  mKey = null;
  mIV = null;
  mEncryptCipher = null;
  mDecryptCipher = null;

  constructor(key, iv) {
    this.mKey = key;
    this.mIV = iv;

    this.mEncryptCipher = this.createEncryptCipher();
    this.mDecryptCipher = this.createDecryptCipher();
  }

  createEncryptCipher() {
    const cipher = Crypto.createCipheriv(algorithm, this.mKey, this.mIV);
    cipher.setAutoPadding(false);
    return cipher;
  }

  createDecryptCipher() {
    const decipher = Crypto.createDecipheriv(algorithm, this.mKey, this.mIV);
    decipher.setAutoPadding(false);
    return decipher;
  }

  encrypt(content) {
    return this.mEncryptCipher.update(content);
    // return this.mEncryptCipher.final();
  }

  decrypt(content) {
    return this.mDecryptCipher.update(content);
    // return this.mDecryptCipher.final();
  }
}


export default BlufiAESCrypto;
