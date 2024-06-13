import {shallowReactive, watch} from 'vue'
import {createComponent} from './createComponent'
import Statistic from './Statistic.vue'

export function useStatistic() {
	const props = shallowReactive({
		value: null,
		chart: null,
		visible: false, // 可见性（默认隐藏）
		statistical: 0 // 统计频率
	})
	const { close, open } = createComponent(Statistic, props)
	const toggleStatistic = (visible?: boolean) => {
		if (visible !== undefined) {
			props.visible = visible
		} else {
			props.visible = !props.visible
		}
	}
	watch(
		() => props.visible,
		(value, oldValue, onCleanup) => {

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
		toggleStatistic
	}
}
