import localforage from 'localforage'

let instance = new Map()
export default class LocalforageCache {
	protected db: any = null
	protected name: any = null

	constructor(name: string) {
		LocalforageCache.getCacheSize()
		if (!instance.has(this.name)) {
			this.db = localforage.createInstance({
				name: name
			})
			this.name = name
			instance.set(this.name, this.db)
		} else {
			throw Error('存在实例！')
		}
	}

	static async install() {
		if (await LocalforageCache.support()) {
			localforage.config({
				driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE], //降级储存
				name: 'forecast app cache',
				version: 1.0,
				size: 4980736
			})
		}
	}

	static async getInstance(name: string) {
		if (instance.has(name)) {
			return instance.get(name)
		} else {
			throw Error('不存在实例！')
		}
	}

	/**
	 * 计算indexdb 使用的存储空间大小
	 * */
	static async getCacheSize() {
		const quota = await navigator.storage.estimate()
		const percentageUsed = (quota.usage / quota.quota) * 100
		let usageNum: number | string = quota.usage / 1024 / 1024
		if (usageNum > 1024) {
			usageNum = usageNum / 1024 + ' GB'
		} else {
			usageNum = usageNum.toFixed(2) + ' MB'
		}
		const usageRatio = percentageUsed.toFixed(2)
		const remainingNum = ((quota.quota - quota.usage) / 1024 / 1024 / 1024).toFixed(2)
		console.log(
			`%c浏览器 IndexDB 已使用 ${usageNum}，占最大可用容量 ${usageRatio} % 。最多可以再写入 ${remainingNum} GB。`,
			'color:green;background:black;font-size:14px;'
		)
		return quota
	}

	static async dropInstance({ name, storeName = '' }) {
		try {
			const value = await localforage.dropInstance({
				name: name,
				storeName: storeName
			})
			instance.delete(name)
			console.log(`IndexedDB: name success`)
			return value
		} catch (err) {
			console.log(`IndexedDB: name failed`, err)
		}
	}

	static async support() {
		return await localforage.supports(localforage.INDEXEDDB)
	}

	static async setDriver(driver) {
		return await localforage.setDriver(localforage.INDEXEDDB)
	}

	async get(key) {
		try {
			const value = await this.db.getItem(key)
			console.log(`IndexedDB: getItem ${key} success`)
			return value
		} catch (err) {
			console.log(`IndexedDB: getItem ${key} failed`, err)
		}
	}

	async set(key, value) {
		try {
			await this.db.setItem(key, value)
			console.log(`IndexedDB: setItem ${key} success`)
		} catch (err) {
			console.log(`IndexedDB: setItem ${key} failed`, err)
		}
	}

	async remove(key) {
		try {
			await this.db.removeItem(key)
			console.log(`IndexedDB: removeItem ${key} success`)
		} catch (err) {
			console.log(`IndexedDB: removeItem ${key} failed`, err)
		}
	}

	async clear() {
		try {
			await this.db.clear()
			console.log(`IndexedDB: clear success`)
		} catch (err) {
			console.log(`IndexedDB: clear failed`, err)
		}
	}

	async keys() {
		return await this.db.keys()
	}

	async length() {
		return await this.db.length()
	}

	async iterate(callback) {
		return await this.db.iterate(callback)
	}

	static dispose() {
		if (instance.size) {
			instance.forEach((value, key, map) => {
				LocalforageCache.dropInstance({
					name: key,
					storeName: ''
				})
				instance.delete(key)
			})
		}
	}
}

export async function setupLocalforageCache() {
	return LocalforageCache.install()
}

export async function disposeLocalforageCache() {
	return LocalforageCache.dispose()
}
