import type {Ref} from 'vue'
import {onBeforeUpdate, ref} from 'vue'

export default function useRefs(): [
	Ref<HTMLElement[]>,
	(index: number) => (el: HTMLElement) => void
] {
	const refs = ref([]) as Ref<HTMLElement[]>

	onBeforeUpdate(() => {
		refs.value = []
	})

	const setRefs = (index: number) => (el: HTMLElement) => {
		refs.value[index] = el
	}

	return [refs, setRefs]
}
