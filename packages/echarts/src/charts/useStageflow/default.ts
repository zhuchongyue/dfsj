import assign from '../../utils/assign'
import cfg, {axis, options} from '../../config'
import {to} from '../../utils/tools'

export default assign({}, options, {
	// 标记点配置
	$mark: {
		z: 10,
		name: '标注',
		type: 'custom',
		xAxisIndex: 1
	},
	// 以上为自定义配置，以下为eChart官方配置
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	color: cfg.color,
	title: { show: false, text: '水位流量图' },
	grid: {
		top: 60,
		bottom: 50,
		left: 80,
		right: 20
	},
	tooltip: false,
	dataset: { source: [] },
	legend: { top: 10 },
	xAxis: [
		{
			...axis,
			name: '流量（m³/s）',
			type: 'value',
			boundaryGap: false,
			axisLine: { onZero: false },
			nameLocation: 'middle',
			nameGap: 25,
			splitNumber: 10,
			min: 0,
			max: (v) => Math.ceil(v.max + v.max * 0.05)
		},
		{
			show: false,
			min: 0,
			max: (v) => v.max
		}
	],
	yAxis: [
		{
			...axis,
			name: '水位（m）',
			type: 'value',
			nameLocation: 'middle',
			splitNumber: 10,
			nameGap: 50,
			axisPointer: { show: true, label: { formatter: (p) => to(p.value) } },
			min: (v) => to(v.min - (v.max - v.min) * 0.1),
			max: (v) => to(v.max + (v.max - v.min) * 0.1)
		},
		{
			...axis
		}
	],
	series: [
		{
			type: 'line',
			name: '流量（m³/s）',
			smooth: true,
			encode: { x: 1, y: 0 },
			lineStyle: {
				color: '#43CBFF',
				width: 2
			},
			itemStyle: {
				opacity: 0
			},
			emphasis: {
				itemStyle: {
					opacity: 1,
					borderColor: '#43CBFF'
				}
			}
		}
	]
})
