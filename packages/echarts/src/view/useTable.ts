import {shallowReactive, watch} from 'vue'
import {createComponent} from './createComponent'
import Table from './Table.vue'

export function useTable() {
	const props = shallowReactive({
		value: null,
		chart: null,
		visible: false,
		container: null
	})
	const { close, open } = createComponent(Table, props)
	const toggleTable = (visible?: boolean) => {
		if (visible !== undefined) {
			props.visible = visible
		} else {
			props.visible = !props.visible
		}
	}
	watch(
		() => props.visible,
		(value, oldValue, onCleanup) => {
			console.log('//////////')
			value ? open() : close()
		},
		{
			immediate: true
		}
	)
	return {
		close,
		open,
		props,
		toggleTable
	}
}
