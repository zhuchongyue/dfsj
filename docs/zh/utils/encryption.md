# 加密解密

## CryptoUtils
> 基于`crypto-js`实现对称加密和非对称HASH加密，返回工厂方法 `EncryptionFactory` `HashingFactory`使用；
 - AesEncryption
 - Base64Encryption
 - MD5Hashing
 - SHA256Hashing
 - SHA512Hashing
```ts
export class EncryptionFactory {
    public static createAesEncryption(params: EncryptionParams): Encryption {
        return new AesEncryption(params);
    }

    public static createBase64Encryption(): Encryption {
        return Base64Encryption.getInstance();
    }
}

export class HashingFactory {
    public static createMD5Hashing(): Hashing {
        return MD5Hashing.getInstance();
    }

    public static createSHA256Hashing(): Hashing {
        return SHA256Hashing.getInstance();
    }

    public static createSHA512Hashing(): Hashing {
        return SHA512Hashing.getInstance();
    }
}
```

## MD5HttpSignUtils
> http参数签名
## SM4Utils
>国密