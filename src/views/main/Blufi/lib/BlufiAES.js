class BlufiAES {
    mKey = null;
    mIV = null;
    mTransformation = null;
    mEncryptCipher = null;
    mDecryptCipher = null;

    constructor(key, transformation, iv) {
        this.mKey = key;
        this.mIV = iv;
        this.mTransformation = transformation;

        this.mEncryptCipher = this.createEncryptCipher();
        this.mDecryptCipher = this.createDecryptCipher();
    }

    createEncryptCipher() {
        // try {
        //     Cipher cipher = Cipher.getInstance(mTransformation);
        //
        //     SecretKeySpec secretKeySpec = new SecretKeySpec(mKey, "AES");
        //     if (mIV == null) {
        //         cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
        //     } else {
        //         IvParameterSpec parameterSpec = new IvParameterSpec(mIV);
        //         cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, parameterSpec);
        //     }
        //
        //     return cipher;
        // } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | InvalidAlgorithmParameterException
        //         e) {
        //     e.printStackTrace();
        // }
        //
        // return null;
    }

    createDecryptCipher() {
        // try {
        //     Cipher cipher = Cipher.getInstance(mTransformation);
        //
        //     SecretKeySpec secretKeySpec = new SecretKeySpec(mKey, "AES");
        //     if (mIV == null) {
        //         cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
        //     } else {
        //         IvParameterSpec parameterSpec = new IvParameterSpec(mIV);
        //         cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, parameterSpec);
        //     }
        //
        //     return cipher;
        // } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | InvalidAlgorithmParameterException
        //         e) {
        //     e.printStackTrace();
        // }
        //
        // return null;
    }

    encrypt(content) {
        // try {
        //     return mEncryptCipher.doFinal(content);
        // } catch (BadPaddingException | IllegalBlockSizeException e) {
        //     e.printStackTrace();
        // }
        // return null;
    }

    decrypt(content) {
        // try {
        //     return mDecryptCipher.doFinal(content);
        // } catch (BadPaddingException | IllegalBlockSizeException e) {
        //     e.printStackTrace();
        // }
        //
        // return null;
    }
}

export default BlufiAES;
