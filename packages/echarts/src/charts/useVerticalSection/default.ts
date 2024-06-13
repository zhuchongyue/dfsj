import * as echarts from 'echarts'
import config, {axis, options} from '../../config'
import {to} from '../../utils/tools'
import assign from '../../utils/assign'

export default assign({}, options, {
	color: config.color,
	title: { show: false, text: '纵断面示意图' },
	grid: {
		top: 60,
		bottom: 50,
		left: 80,
		right: 80
	},
	legend: { show: false },
	dataset: { source: [] },
	xAxis: {
		type: 'value',
		name: '起点距离',
		axisTick: false,
		axisLabel: false,
		splitLine: false,
		axisLine: false,
		min: (v) => v.min,
		max: (v) => v.max
	},
	yAxis: {
		...axis,
		name: '高程(m)',
		splitLine: false,
		min: (v) => Math.max(v.min - 1, 0),
		axisLabel: { formatter: (v) => to(v) }
	},
	series: [
		{
			z: 1,
			name: 'layout',
			type: 'line',
			lineStyle: { opacity: 0 },
			itemStyle: { opacity: 0 },
			areaStyle: {
				opacity: 1,
				color: new echarts.graphic.LinearGradient(
					0,
					0,
					0,
					1,
					[
						{
							offset: 0,
							color: '#ffcba8'
						},
						{
							offset: 1,
							color: '#a87f67'
						}
					],
					false
				)
			}
		}
	]
})
