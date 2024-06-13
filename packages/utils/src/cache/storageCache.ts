import {Encryption, EncryptionParams} from '../encryption/CryptoUtils'
import {EncryptionFactory} from '../encryption/CryptoUtils'
import {isNullOrUnDef} from '../is'
import type {Nullable} from '../../typings'

export const cacheCipher = {
	key: '_11111000001111@',
	iv: '@11111000001111_'
}

export interface CreateStorageParams extends EncryptionParams {
	prefixKey: string
	storage: Storage
	hasEncrypt: boolean
	timeout?: Nullable<number>
}

// @ts-ignore
export const createStorage = ({
	prefixKey = '',
	storage = sessionStorage,
	key = cacheCipher.key,
	iv = cacheCipher.iv,
	timeout = null,
	hasEncrypt = true
}: Partial<CreateStorageParams> = {}) => {
	if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
		throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!')
	}

	const encryption = EncryptionFactory.createAesEncryption({ key, iv })

	/**
	 * Cache class
	 * Construction parameters can be passed into sessionStorage, localStorage,
	 * @class Cache
	 * @example
	 */
	const WebStorage = class WebStorage {
		public storage: Storage
		public prefixKey?: string
		public encryption: Encryption
		public hasEncrypt: boolean

		/**
		 *
		 * @param {*} storage
		 */
		constructor() {
			this.storage = storage
			this.prefixKey = prefixKey
			this.encryption = encryption
			this.hasEncrypt = hasEncrypt
		}

		public getKey(key: string) {
			return `${this.prefixKey}${key}`.toUpperCase()
		}

		/**
		 * Set cache
		 * @param {string} key
		 * @param {*} value
		 * @param {*} expire Expiration time in seconds
		 * @memberof Cache
		 */
		set(key: string, value: any, expire: number | null = timeout) {
			const stringData = JSON.stringify({
				value,
				time: Date.now(),
				expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null
			})
			const stringifyValue = this.hasEncrypt ? this.encryption.encrypt(stringData) : stringData
			this.storage.setItem(this.getKey(key), stringifyValue)
		}

		/**
		 * Read cache
		 * @param {string} key
		 * @param {*} def
		 * @memberof Cache
		 */
		get(key: string, def: any = null): any {
			const val = this.storage.getItem(this.getKey(key))
			if (!val) return def

			try {
				const decVal = this.hasEncrypt ? this.encryption.decrypt(val) : val
				const data = JSON.parse(decVal)
				const { value, expire } = data
				if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
					return value
				}
				this.remove(key)
			} catch (e) {
				return def
			}
		}

		/**
		 * Delete cache based on key
		 * @param {string} key
		 * @memberof Cache
		 */
		remove(key: string) {
			this.storage.removeItem(this.getKey(key))
		}

		/**
		 * Delete all caches of this instance
		 */
		clear(): void {
			this.storage.clear()
		}
	}
	return new WebStorage()
}
