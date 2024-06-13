// @ts-ignore
import {SM4Utils} from '@dfsj/utils'
import {GuestOptions, GuestResult, Signature} from '../typings'

/***
 * 默认的配置信息
 */
const DEFAULT_OPT: GuestOptions = {
	guestPublicKeyUrl: 'http://localhost:8081/user/guest/getPublicKeyBase64',
	guestValidateUrl: 'http://localhost:8081/user/guest/validate',
	appId: 'dfsj2023050100001',
	username: 'guest',
	role: 'ROLE_GUEST',
	router: '*',
	origin: location.href,
	receiveMessageCallback: (message) => console.log('message---->>', { ...message })
}
/**
 * rsa加密字符串和密码
 * @param value 需要加密的字符串
 */
const publicKeyEncryption = (key, value) => {
	//@ts-ignore
	return SM4Utils.encrypt(key, value)
}

class Guest {
	private static SUFFIX = 'DFSJ_APP_GUEST'
	options: GuestOptions

	constructor(options: GuestOptions) {
		this.options = {
			...DEFAULT_OPT,
			...options
		}
	}

	private get digest() {
		//需要签名的文本
		//外部系统地址   +  内部系统标识  +  内部系统用户
		return this.options?.origin + '&' + this.options?.appId + '&' + this.options?.username
	}

	/***
	 * 请求公钥信息
	 * @return
	 * 公钥 publickey
	 * 签名 signStr
	 */
	async getPublicKey() {
		if (!Reflect.has(this.options, 'appId')) throw Error('参数appId缺失！')
		return new Promise<Omit<Signature, 'digest'>>(async (resolve, reject) => {
			const params = {
				digest: this.digest
			}
			try {
				const response = await fetch(this.options.guestPublicKeyUrl, {
					method: 'post',
					body: JSON.stringify(params),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				resolve(response.json())
			} catch (e) {
				reject(null)
			}
		})
	}

	/***
	 * 验证签名与获取信息
	 * @param params
	 */
	async validate(params: Partial<Signature & GuestOptions>) {
		if (!Reflect.has(this.options, 'guestValidateUrl'))
			throw Error('验证地址错误，guestValidateUrl参数必传！')
		const { publicKey, username, signStr, role, digest, router, guestValidateUrl } = params
		//验证是否通过
		//@ts-ignore
		const isSignature = SM4Utils.verified(this.digest, signStr, publicKey)
		if (!isSignature) throw Error('签名验证不通过！,公钥不可信已被串改')
		return new Promise<GuestResult>(async (resolve, reject) => {
			const params = {
				usename: publicKeyEncryption(publicKey, username),
				digest: publicKeyEncryption(publicKey, digest),
				referer: publicKeyEncryption(publicKey, origin)
			}
			try {
				const response = await fetch(guestValidateUrl, {
					method: 'post',
					body: JSON.stringify(params),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				resolve(response.json())
			} catch (e) {
				reject(null)
			}
		})
	}

	/**
	 * 跨域发送信息
	 * @param iframe
	 * 必须在onload之后进行通信，不然iframe内部系统可能无法获取参数
	 */
	async postMessage(iframe: any) {
		const result = await this.getPublicKey()
		iframe &&
			iframe.contentWindow.postMessage(
				{
					type: 'iframe',
					data: {
						username: this.options.username, //如果怕usename会允许更改那就考虑使用userId字段
						publicKey: result.publicKey, //公钥
						signStr: result.signStr, //签名密串
						appId: this.options.appId, //应用id
						origin: location.href, // referer记录引用原地址，到时候发现异常可以开启禁用
						router: this.options.router, //重定向的路由或者只需要查看的路由 *表示所有 指定的就写指定的路由，与前端框架配置保持一致即可
						digest: this.digest //签名的文本明文
					}
				},
				'*'
			)
	}

	/***
	 * 处理函数 接受跨域的message
	 * @param event
	 */
	async handleReceiveMessageListener(event: any | EventListener) {
		console.log(`get event from iframe => from: ${event.origin} message: ${event.data}`)
		if (
			event.data &&
			event.data.type === 'iframe' &&
			event.data.username &&
			event.data.publicKey &&
			event.data.appId &&
			event.data.signStr
		) {
			try {
				const validateResult = await this.validate(event?.data)
				const receiveMessage = {
					...validateResult,
					...event?.data
				}
				this.options?.receiveMessageCallback?.(receiveMessage)
			} catch (e) {
				this.options?.receiveMessageCallback?.(null)
			}
		}
	}

	/***
	 * 监听接收信息
	 */
	addReceiveMessageListener() {
		window.addEventListener('message', this.handleReceiveMessageListener.bind(this), false)
	}

	/***
	 * 移除监听接收信息
	 */
	removeReceiveMessageListener() {
		window.removeEventListener('message', this.handleReceiveMessageListener.bind(this), false)
	}
}

export { Guest, DEFAULT_OPT, publicKeyEncryption }
