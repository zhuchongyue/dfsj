import assign from '../../utils/assign'
import def from './default'
import cfg from '../../config'
import {useECharts} from '../../hooks/useECharts'
import {Ref} from 'vue'
import {useTable} from '../../view/useTable'
import {useStatistic} from '../../view/useStatistic'

export function useDrainageCurves(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)
	const { open: openTable, close: closeTable, props, toggleTable } = useTable()
	props.container = container
	const {
		open: openStatistic,
		close: closeStatistic,
		props: statisticProps,
		toggleStatistic
	} = useStatistic()

	/**
	 * 按要求组装泄洪曲线的options
	 * */
	const assemble = (value: any, options: any): any => {
		let optioned = assign({}, def, options)
		let chart = getInstance()
		if (value != null) {
			props.value = value
			props.chart = chart
			const src = value.source
			const last = value.source.length - 1
			optioned.dataset.source = value.source
			optioned.series = value.dimensions
				.filter((e, i) => i > 0)
				.map((e, i) => {
					let markPoint = { data: [{ coord: [src[last][i + 1], src[last][0]], name: e }] }
					return assign({ name: e, encode: { x: i + 1 }, markPoint }, optioned.$series)
				})
			optioned.toolbox.feature.myTabulation = {
				onclick: () => {
					props.visible = !props.visible
					console.log('打开', props)
					props.visible ? openTable() : closeTable()
				},
				icon: cfg.icon.tabulation,
				title: '表格'
			}
		}
		return optioned
	}

	/***
	 * 转换数据
	 */
	const transform = (data: any) => {
		return {}
	}

	/**
	 * 转换配置
	 * */
	const createOptions = (data: any) => {
		return {}
	}
	return {
		setOptions,
		echarts,
		getInstance,
		container,
		assemble,
		transform,
		createOptions,
		toggleTable,
		toggleStatistic
	}
}
