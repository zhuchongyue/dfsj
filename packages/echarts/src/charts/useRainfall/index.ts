/***
 * 降雨关系图
 */
import {Ref, ref} from 'vue'
import {toMarks as _toMarks} from '../../utils/render'
import def from './default'
import cfg, {CATEGORY} from '../../config'
import {assign} from '../../utils'
import {useHydrology} from '../useHydrology'
import {useECharts} from '../../hooks/useECharts'

export function useRainfall(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)
	const rainIndex = ref(0)
	const { assemble: hydrologyAssemble } = useHydrology(null, {
		S: toSeries,
		M: toMarks,
		C: def
	})
	const assemble = (value: any, options: any): any => {
		let chart = getInstance() as any
		rainIndex.value = 0
		return hydrologyAssemble(value, options, chart)
	}

	function toSeries(dimension: any, index: number, optioned: any) {
		let item = optioned.$series.find((e) => e.$code & dimension.code)
		if (item?.$code === CATEGORY.RAINFALL) {
			item.itemStyle.color = cfg.rainfallColor[rainIndex.value++]
		}
		return item
	}

	function toMarks(value: any, optioned: any): any {
		return _toMarks(value, optioned, assign({}, cfg.mark, optioned.$mark))
	}

	return {
		setOptions,
		echarts,
		getInstance,
		container,
		assemble
	}
}
