import {EChartsType} from 'echarts/core'
import assign from '../../utils/assign'
import def from './default'
import {useECharts} from '../../hooks/useECharts'
import {Ref} from 'vue'

/***
 * 纵断面图
 */
export function useVerticalSection(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)
	const assemble = (value: any, options: any): any => {
		let chart: EChartsType = getInstance() as any
		let optioned = assign({}, def, options)
		if (value != null) {
			// 断面由layout数据来绘制
			// layout为二维数组（[[x,y],[x,y],...]）
			optioned.dataset.source = value.layout
		}
		return optioned
	}

	/**
	 * 转换配置
	 * */
	const createOptions = (data: any) => {
		return {}
	}

	return {
		createOptions,
		setOptions,
		echarts,
		getInstance,
		container,
		assemble
	}
}
