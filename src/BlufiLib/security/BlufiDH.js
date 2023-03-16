import Crypto from 'crypto';

class BlufiDH {
  mP = null;
  mG = null;

  mPrivateKey = null;
  mPublicKey = null;

  mSecretKey = null;

  mDh = null;

  constructor(p, g, length) {
    this.mP = p;
    this.mG = g;
    this.mDh = Crypto.createDiffieHellman(p, 'hex', g, 'binary');
    this.mDh.generateKeys();
    this.mPrivateKey = this.mDh.getPrivateKey();
    this.mPublicKey = this.mDh.getPublicKey();
  }

  getP() {
    return this.mP;
  }

  getG() {
    return this.mG;
  }

  getPrivateKey() {
    return this.mPrivateKey;
  }

  getPublicKey() {
    return this.mPublicKey;
  }

  getSecretKey() {
    return this.mSecretKey;
  }

  generateSecretKey(y) {
    this.mSecretKey = this.mDh.computeSecret(y);
  }
}

export default BlufiDH;
