import {reactive, Ref, ref} from 'vue'
import {createComponent} from './createComponent'
import ToolTip from './ToolTip.vue'

export function useToolTip(target?: Ref<HTMLElement>) {
	const offset = reactive({ x: 0, y: 0 })
	const content = ref(null)
	const hidden = ref(true)

	const { close, open } = createComponent(
		ToolTip,
		{
			offset,
			content,
			hidden
		},
		target
	)

	return {
		close,
		open,
		offset,
		content,
		hidden
	}
}
