import {EChartsType} from 'echarts/core'
import assign from '../../utils/assign'
import cfg, {CATEGORY} from '../../config'
import {toIndices} from '../../utils/render'
import {complexMinMaxIndex, ensure, maximum, minimum} from '../../utils/tools'
import def from './default'
// @ts-ignore
import {constant} from '@dfsj/utils'
import {useECharts} from '../../hooks/useECharts'
import {Ref} from 'vue'
import {useTable} from '../../view/useTable'
import {useStatistic} from '../../view/useStatistic'

export function useComplexHydrology(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)
	const { open: openTable, close: closeTable, props, toggleTable } = useTable()
	props.container = container
	const {
		open: openStatistic,
		close: closeStatistic,
		props: statisticProps,
		toggleStatistic
	} = useStatistic()

	console.log('---C', constant)

	const assemble = (value: any, options: any, chart: EChartsType = getInstance() as any): any => {
		const optioned = assign({}, def, options)
		if (value != null) {
			props.value = value
			props.chart = chart
			statisticProps.chart = chart
			statisticProps.value = value
			/**
			 * 降雨量计数器, 确保多条降雨量的series颜色不同.
			 */
			let counter = 0
			let axis = optioned.yAxis
			/**
			 * 复合水文图有两个grid, 2条X轴（一条在最上，一条在最下），
			 * 为确定某个series使用那条X轴，需要根据code进行判断。
			 *
			 * 将所有的Y轴code收集为两个元素，第0和1轴用第一条x轴，第2和3轴用第二条x轴。
			 */
			let yAxisCodes = [axis[0].$layout | axis[1].$layout, axis[2].$layout | axis[3].$layout]
			optioned.dataset.source = value.source
			optioned.series = value.dimensions
				.filter((e, i) => i > 0)
				.map((e, i) => {
					let yAxisIndex = optioned.yAxis.findIndex((v) => v.$layout & e.code)
					let xAxisIndex = yAxisCodes.findIndex((v) => v & e.code)
					let series = optioned.$series.find((s) => s.$code & e.code)
					let encode = { x: 0, y: i + 1 }
					let color = !!(e.code & CATEGORY.RAINFALL) ? cfg.rainfallColor[counter++] : undefined
					return assign(
						{ yAxisIndex, xAxisIndex, color, encode, name: e.name, selected: e.selected ,visible: true},
						series
					)
				})

			// 创建指标点
			let indices = toIndices(value, optioned, yAxisCodes)
			if (indices?.length) optioned.series.push(...indices)

			// 创建标记线和标记区域
			let marks = toMarks(value, optioned)
			if (marks?.length) {
				optioned.series.push(assign({ data: marks }, cfg.mark.series))
			}

			// 创建legend
			optioned.legend.data = optioned.series.map((e) => ({
				name: e.name,
				textStyle: { color: e.color }
			}))
			// 设置legend初始选中
			optioned.legend.selected = optioned.series.reduce((p, v) => {
				return (p[v.name] = v.selected != null ? v.selected : true), p
			}, {})
			//fixme 提到外面唤起
			// optioned.toolbox.feature.myStatistics = {
			//     onclick: () => {
			//         statisticProps.visible = !statisticProps.visible
			//         console.log('打开',props)
			//         statisticProps.visible ? openStatistic() : closeStatistic()
			//     },
			//     icon: cfg.icon.statistics,
			//     title: "统计",
			// };
			// optioned.toolbox.feature.myTabulation = {
			//     onclick: () => {
			//         props.visible = !props.visible
			//         console.log('打开',props)
			//         props.visible ? openTable() : closeTable()
			//     },
			//     icon: cfg.icon.tabulation,
			//     title: "表格",
			// };
		}
		return optioned
	}

	/**
	 * 生成标记线和标记区域。
	 * 标记线（一般为某个日期，例如当前日期），支持多条；
	 * 标记区域为对些时间区域进行区分（比如短临预报、趋势预报、历史数据等）
	 * @param value 服务端返回的数据
	 * @param optioned ECharts options
	 */
	const toMarks = (value, optioned: any): any[] => {
		// 标记区域
		const areas =
			value.areas?.map((e) =>
				assign(
					{
						shape: 'rect',
						value: e.time,
						gridIndex: [0, 1],
						itemStyle: { fill: e.back || cfg.areaColor[e.type] }
					},
					cfg.mark.shape.rect
				)
			) || constant.EMPTY_ARRAY

		// 标记线（支持多条）
		// 由于复合水文图有两个grid,因此每个grid都需要创建一条线
		// 但只需要创建一个文本(即显示在中间的标记线名称,一般为日期)
		const splits = ensure(value.split).reduce((accept, split) => {
			return accept.concat([
				assign(
					{
						shape: 'line',
						value: split,
						gridIndex: [0],
						xAxisIndex: 0,
						yAxisIndex: 0
					},
					cfg.mark.shape.line
				),
				assign(
					{
						shape: 'line',
						value: split,
						gridIndex: [1],
						xAxisIndex: 1,
						yAxisIndex: 2
					},
					cfg.mark.shape.line
				),
				assign(
					{
						shape: 'text',
						value: split,
						gridIndex: [1],
						xAxisIndex: 1,
						yAxisIndex: 2,
						label: {
							text: optioned?.splitFormat?.(split) ?? split,
							// offset: [0, "-7%"],
							offset: optioned?.markOffset ?? [0, '-7%']
						}
					},
					cfg.mark.shape.text
				)
			])
		}, [])

		return areas.concat(splits)
	}

	/**
	 * 转换配置
	 * */
	const createOptions = (data: any) => {
		if (data == null) return null
		let flo = complexMinMaxIndex(data, CATEGORY.FLOW)
		//水文站 来水预报
		return {
			yAxis: [
				{
					layout: CATEGORY.RAINFALL,
					name: '降雨量(mm)',
					min: 0,
					max: (v) => Math.round(v.max + (v.max - v.min) * 0.1)
				},
				{
					layout: CATEGORY.SWC,
					name: '土壤含水量(%)',
					min: 0,
					max: (v) => Math.round(v.max + (v.max - v.min) * 0.1)
				},
				{
					layout: CATEGORY.FLOW,
					name: '流量(m³/s)',
					min: (v) => minimum(v, flo),
					max: (v) => maximum(v, flo)
				},
				{
					layout: '',
					name: ''
				}
			]
		}
	}



	return {
		setOptions,
		echarts,
		getInstance,
		container,
		createOptions,
		assemble,
		toggleTable,
		toggleStatistic
	}
}
