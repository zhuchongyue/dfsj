import assign from '../../utils/assign'
import {axis, options} from '../../config'

export default assign({}, options, {
	$points: false,
	title: { show: false, text: '库容曲线图' },
	grid: {
		top: 70,
		bottom: 50,
		left: 80,
		right: 20
	},
	tooltip: false,
	dataset: { source: [] },
	legend: {
		show: true,
		top: 7
	},
	xAxis: [
		{
			...axis,
			name: '库容（万m³）',
			type: 'value',
			nameLocation: 'middle',
			nameGap: 25,
			splitNumber: 10,
			min: 0,
			max: (v) => v.max.toFixed(2)
		},
		{
			...axis,
			name: '面积（k㎡）',
			type: 'value',
			inverse: true,
			nameLocation: 'middle',
			nameGap: 25,
			splitNumber: 10,
			min: 0,
			max: (v) => v.max,
			splitLine: { show: false }
		}
	],
	yAxis: [
		{
			...axis,
			name: '水位（m）',
			type: 'value',
			nameLocation: 'middle',
			nameGap: 50,
			splitNumber: 10,
			min: (v) => (v.min - (v.max - v.min) * 0.1).toFixed(2),
			max: (v) => (v.max + (v.max - v.min) * 0.1).toFixed(2),
			axisPointer: {
				show: true,
				label: { formatter: (p) => p.value.toFixed(2) }
			}
		},
		{}
	],
	series: [
		{
			type: 'line',
			smooth: true,
			xAxisIndex: 0,
			encode: { x: 1, y: 0 },
			color: '#43CBFF',
			lineStyle: {
				color: '#43CBFF',
				width: 2
			},
			itemStyle: {
				opacity: 0
			},
			emphasis: {
				itemStyle: {
					borderColor: '#43CBFF',
					opacity: 1
				}
			}
		},
		{
			type: 'line',
			smooth: true,
			xAxisIndex: 1,
			encode: { x: 2, y: 0 },
			color: '#EB64FB',
			lineStyle: {
				color: '#EB64FB',
				width: 2
			},
			itemStyle: {
				opacity: 0
			},
			emphasis: {
				itemStyle: {
					opacity: 1,
					borderColor: '#EB64FB'
				}
			}
		}
	]
})
