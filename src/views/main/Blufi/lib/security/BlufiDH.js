import Crypto from 'crypto';
// import Assert from 'assert';

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
        this.mDh = Crypto.createDiffieHellman(p, 'hex', g);
        this.mDh.generateKeys();
        this.mPrivateKey = this.mDh.getPrivateKey();
        this.mPublicKey = this.mDh.getPublicKey();
        // Assert.notEqual(this.mPrivateKey, null);
        // Assert.notEqual(this.mPublicKey, null);
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
