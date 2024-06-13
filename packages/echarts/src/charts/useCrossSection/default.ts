import * as echarts from 'echarts'
import config, {axis, options} from '../../config'
import {to} from '../../utils/tools'
import assign from '../../utils/assign'

export default assign({}, options, {
	// 当前水位标签配置
	$current: {
		z: 100,
		silent: true,
		type: 'scatter',
		symbol: `path://${config.icon.stageMirror}`,
		symbolSize: 160,
		symbolKeepAspect: true,
		symbolOffset: [-50, -3],
		showEffectOn: 'render',
		rippleEffect: {
			brushType: 'stroke'
		},
		label: {
			show: true,
			color: '#fff',
			textBorderColor: config.markColor[1],
			textBorderWidth: 3,
			offset: [-20, 4],
			align: 'right',
			lineHeight: 20,
			fontSize: 13,
			fontWeight: 'bold',
			position: 'right',
			formatter: (p) => `${p.name} (${p.data.value[2]}${p.data.value[3]})`
		},
		itemStyle: {
			color: config.markColor[1],
			shadowBlur: 5,
			shadowColor: 'rgba(51,51,51,0.56)',
			shadowOffsetX: 1,
			shadowOffsetY: 1
		}
	},
	// 水动画配置
	$water: {
		z: 0,
		type: 'water',
		symbolSize: 0,
		xAxisIndex: 0,
		tooltip: false,
		itemStyle: {
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [
					{
						offset: 0.0,
						color: 'skyblue' // 0% 处的颜色
					},
					{
						offset: 0.7,
						color: 'deepskyblue' // 100% 处的颜色
					}
				],
				global: false // 缺省为 false
			}
		}
	},
	// 标记区域配置
	$area: {
		history: {
			title: '历史',
			symbol: 'circle'
		},
		forecast: {
			title: '预报',
			symbol: 'emptyCircle'
		}
	},
	//以上为自定义配置，以下为eChart官方配置
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	color: config.color,
	grid: {
		top: 60,
		bottom: 20,
		left: 80,
		right: 80
	},
	title: {
		x: 'center',
		text: '横断面示意图',
		top: 10,
		textStyle: {
			fontSize: 15
		}
	},
	legend: { show: false },
	dataset: { source: [] },
	tooltip: { formatter: (e) => `${e.value[2]}：${e.value[1]}（m）` },
	timeline: {
		z: 20,
		axisType: 'category',
		autoPlay: false,
		playInterval: 1000,
		bottom: 0,
		left: 100,
		right: 100,
		xAxisIndex: 0,
		symbol: 'circle',
		data: null
	},
	xAxis: {
		type: 'value',
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
		axisLabel: { formatter: (v) => to(v, '0.0') },
		nameTextStyle: { align: 'right' },
		min: (v) => Math.max(v.min - 1, 0)
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
