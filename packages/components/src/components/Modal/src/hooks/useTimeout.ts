import {ref, watch} from 'vue'
import {tryOnUnmounted} from '@vueuse/core'

export function isFunction(val: unknown): val is Function {
	return typeof val === 'function'
}

declare interface Fn<T = any, R = T> {
	(...arg: T[]): R
}

declare type TimeoutHandle = ReturnType<typeof setTimeout>

export function useTimeoutFn(handle: Fn<any>, wait: number, native = false) {
	if (!isFunction(handle)) {
		throw new Error('handle is not Function!')
	}

	const { readyRef, stop, start } = useTimeoutRef(wait)
	if (native) {
		handle()
	} else {
		watch(
			readyRef,
			(maturity) => {
				maturity && handle()
			},
			{ immediate: false }
		)
	}
	return { readyRef, stop, start }
}

export function useTimeoutRef(wait: number) {
	const readyRef = ref(false)

	let timer: TimeoutHandle

	function stop(): void {
		readyRef.value = false
		timer && window.clearTimeout(timer)
	}

	function start(): void {
		stop()
		timer = setTimeout(() => {
			readyRef.value = true
		}, wait)
	}

	start()

	tryOnUnmounted(stop)

	return { readyRef, stop, start }
}
