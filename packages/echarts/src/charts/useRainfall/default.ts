import assign from '../../utils/assign'
import cfg, {axis, CATEGORY, options} from '../../config'
import {to} from '../../utils/tools'

export default assign({}, options, {
	// 用以指标的标签错开分布的属性提供，设置为空数组即可
	$indices: [],
	// 用以图表统计的统计频率（毫秒）
	$statistical: 100,
	// 设置图表是否可以动态追加数据
	$appendable: 3,
	$mark: {
		shape: {
			text: {
				label: {
					offset: [0, '101%']
				}
			}
		}
	},
	$series: [
		{
			$code: CATEGORY.RAINFALL,
			name: '降雨量',
			type: 'bar',
			barMaxWidth: 5,
			yAxisIndex: 0,
			large: true,
			itemStyle: { color: null },
			markPoint: {
				data: [
					{
						type: 'max',
						symbolSize: 1,
						label: {
							offset: [0, 12],
							color: 'inherit',
							fontWeight: 'bold',
							fontSize: 14,
							formatter: (e) => to(e.value, '0.0')
						}
					}
				]
			}
		},
		{
			$code: ~CATEGORY.RAINFALL,
			type: 'line',
			yAxisIndex: 1,
			smooth: true,
			large: true,
			emphasis: { itemStyle: { opacity: 0.8 } },
			itemStyle: { opacity: 0 },
			markPoint: {
				data: [
					{
						type: 'max',
						symbolSize: 2,
						label: {
							offset: [0, -7],
							color: 'inherit',
							fontWeight: 'bold',
							fontSize: 14,
							formatter: (e) => to(e.value)
						}
					}
				]
			}
		}
	],
	//以上为自定义配置，以下为eChart官方配置
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	title: { show: false, text: '降雨关系图' },
	grid: {
		top: 60,
		bottom: 60,
		left: 80,
		right: 80
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross'
		}
	},
	legend: {
		show: true,
		top: 10
	},
	dataZoom: [
		{
			type: 'slider',
			brushSelect: false,
			handleIcon: cfg.icon.zoom,
			handleSize: '60%',
			realtime: true,
			throttle: 30,
			height: 20,
			bottom: 10
		},
		{
			type: 'inside'
		}
	],
	xAxis: [
		{
			...axis,
			name: '时间',
			type: 'category',
			position: 'top',
			boundaryGap: false,
			axisLine: { onZero: false },
			nameGap: 30
		}
	],
	yAxis: [
		{
			$layout: CATEGORY.RAINFALL,
			...axis,
			// name: "降雨量（mm）",
			type: 'value',
			nameLocation: 'middle',
			nameGap: 50,
			inverse: true,
			nameTextStyle: {
				align: 'right'
			},
			min: 0,
			max: (v) => Math.round(v.max + (v.max - v.min) * 0.1)
		},
		{
			$layout: ~CATEGORY.RAINFALL,
			...axis,
			type: 'value',
			// name: "土壤含水量（%）",
			nameLocation: 'middle',
			nameGap: 50,
			min: 0,
			max: 100
		}
	]
})
