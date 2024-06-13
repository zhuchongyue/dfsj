import {onScopeDispose, onUnmounted} from 'vue'

const useUnmount = (fn: any) => {
	const unmounted = onScopeDispose ?? onUnmounted
	unmounted(() => {
		fn()
	})
}

export default useUnmount
