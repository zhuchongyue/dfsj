/***
 * 国密4 加解密
 *（1）：对称加密   后台生成密钥对
 *（2）: 非对称加密  后台生成密钥对   验签操作
 */
import {sm2, sm4} from 'sm-crypto'

// privateKey ： 对称加密 'A54595783FBADC9C23E1D300E36B5AEE' // 任何包含 32 个十六进制数字的字符串
/**
 * 分组密码模式:
 * - ECB: 电子密码本
 * - CBC: 密码块链接
 */

class SM4Utils {
	/**
	 * 验签过程
	 * @param msg
	 * @param signHex
	 * @param publicKey
	 */
	static verified(msg, signHex, publicKey) {
		const verified = sm2.doVerifySignature(msg, signHex, publicKey)
		if (verified) {
			console.log('Signature is valid')
		} else {
			console.log('Signature is invalid')
		}
		return verified
	}

	/***
	 * 加密
	 * @param originalData
	 */
	static encrypt(publicKey, originalData: string) {
		try {
			return sm4.encrypt(publicKey, originalData)
		} catch (e) {
			return null
		}
	}

	/**
	 * 解密
	 * @param encryptedData
	 */
	static decrypt(privateKey, encryptedData: string) {
		try {
			return sm4.decrypt(privateKey, encryptedData)
		} catch (e) {
			return null
		}
	}
}
export {
	SM4Utils
}