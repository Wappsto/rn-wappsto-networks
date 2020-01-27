import AES from 'crypto-js/aes';

class BlufiAES {
    mKey = null;
    mIV = null;
    mTransformation = null;;

    constructor(key, transformation, iv) {
        this.mKey = key;
        this.mIV = iv;
        this.mTransformation = transformation;
    }

    encrypt(content) {
        try {
            return AES.encrypt(content, this.mKey, { iv: this.mIV });
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    decrypt(content) {
        try {
            return AES.decrypt(content, this.mKey, { iv: this.mIV });
        } catch (e) {
            console.log(e);
        }

        return null;
    }
}

export default BlufiAES;
