import Crypto from 'crypto';
// import Assert from 'assert';

class BlufiDH {
    mP = null;
    mG = null;

    mPrivateKey = null;
    mPublicKey = null;

    mSecretKey = null;

    constructor(p, g, length) {
        this.mP = p;
        this.mG = g;
        const keys = this.generateKeys(p, g, length);
        // Assert.notEqual(keys, null);
        this.mPrivateKey = keys[0];
        this.mPublicKey = keys[1];
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
        // try {
        //     DHPublicKeySpec pbks = new DHPublicKeySpec(y, mP, mG);
        //     KeyFactory keyFact = KeyFactory.getInstance("DH");
        //     PublicKey publicKey = keyFact.generatePublic(pbks);
        //
        //     // Prepare to generate the secret key with the private key and public key of the other party
        //     KeyAgreement ka = KeyAgreement.getInstance("DH");
        //     ka.init(mPrivateKey);
        //     ka.doPhase(publicKey, true);
        //
        //     // Generate the secret key
        //     mSecretKey = ka.generateSecret();
        // } catch (NoSuchAlgorithmException | InvalidKeySpecException | InvalidKeyException e) {
        //     e.printStackTrace();
        // }
    }

    generateKeys(p, g, length) {
        // Use the values to generate a key pair
        const Dh = Crypto.createDiffieHellman(p, g);
        const keys = Dh.generateKeys();
        return [Dh.getPrivateKey(), Dh.getPublicKey()];
    }
}

export default BlufiDH;
