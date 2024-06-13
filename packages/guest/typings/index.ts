/**
 * sdk配置类型
 */
export interface GuestOptions {
	guestPublicKeyUrl: string //请求公钥地址
	guestValidateUrl: string //校验地址
	appId?: string //项目应用唯一标识
	username?: string //用户名
	role?: string //访问角色
	origin?: string //外部系统
	router?: string | '*' // "*"为所有路径  /drought-similar  旱情相似性
	receiveMessageCallback: Function //回调函数
}

/**
 * 签名校验类型
 */
export interface Signature {
	publicKey: string //公钥
	digest: string //签名字符
	signStr: string //签名密串
}

/**
 * 验证通过返回体
 */
export interface GuestResult {
	access_token: string
	dept_id: number
	expires_in: number
	license: string
	refresh_token: string
	scope: string
	token_type: 'bearer' | string
	user_adcd: string
	user_id: number | string
	username: string
}
