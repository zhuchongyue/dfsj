import {ref, watch as vueWatch} from 'vue'
import Cookies from 'js-cookie'

interface Options {
	watch?: boolean
	defaultValue?: string | undefined
	expires?: number | Date
	path?: string
	domain?: string
	secure?: boolean
	sameSite?: 'strict' | 'lax' | 'none'
}

const defaultOptions = {
	watch: false,
	defaultValue: undefined
}
const useCookie = (key: string, options?: Options) => {
	const { watch, defaultValue } = { ...defaultOptions, ...options }

	const state = ref(Cookies.get(key) || defaultValue)

	const setCookie = (value: any) => {
		Cookies.set(key, value, { ...options })
		state.value = value
	}

	if (watch) {
		vueWatch(
			state,
			(value) => {
				if (value === null || value === undefined) {
					Cookies.remove(key)
					return
				}
				setCookie(value)
			},
			{
				deep: true
			}
		)
	}

	const clearAll = () => {
		const cookies = document.cookie.split(';')
		if (!cookies) return
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i]
			const eqPos = cookie.indexOf('=')
			const name = eqPos > -1 ? cookie?.substr?.(0, eqPos) : cookie
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
		}
	}

	return {
		state,
		setCookie,
		clearAll
	}
}

export default useCookie
