import cfg, {axis, options} from '../../config'
import assign from '../../utils/assign'
import {to} from '../../utils/tools'

export default assign({}, options, {
	$series: {
		type: 'line',
		smooth: true,
		encode: { y: 0 },
		itemStyle: {
			opacity: 0
		},
		emphasis: {
			itemStyle: {
				opacity: 0.8
			}
		},
		markPoint: {
			symbolSize: 1,
			itemStyle: {
				normal: {
					color: 'transparent'
				}
			},
			label: {
				show: true,
				position: 'right',
				formatter: (p) => `h=${p.name}`
			}
		}
	},
	//以上为自定义配置，以下为eChart官方配置
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	color: cfg.color,
	title: { show: false, text: '泄洪曲线图' },
	grid: {
		top: 60,
		bottom: 50,
		left: 80,
		right: 80
	},
	tooltip: {
		trigger: 'none',
		axisPointer: {
			type: 'none'
		},
		formatter: (p) =>
			[
				`<article class="tooltip">`,
				`<li>水位：${to(p[0].axisValue)}（m）</li>`,
				...p.map(
					(e) => `<li>${e.marker}h=${e.seriesName}：${to(e.value[e.encode.x[0]])}（m³/s）</li>`
				),
				`</article>`
			].join('')
	},
	legend: {
		show: true,
		top: 10
	},
	xAxis: {
		...axis,
		name: '流量（m³/s）',
		type: 'value',
		boundaryGap: false,
		axisLine: { onZero: false },
		nameLocation: 'middle',
		nameGap: 25,
		max: (v) => v.max,
		min: 0
	},
	yAxis: {
		...axis,
		name: '水位（m）',
		type: 'value',
		axisPointer: { show: true },
		splitNumber: 10,
		min: (v) => to(v.min - (v.max - v.min) * 0.1),
		max: (v) => to(v.max + (v.max - v.min) * 0.1),
		nameTextStyle: {
			align: 'right'
		}
	}
})
