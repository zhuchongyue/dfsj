import groupBy from 'lodash-es/groupBy'
import {to} from '../../utils/tools'
import assign from '../../utils/assign'
import cfg, {axis, CATEGORY, options} from '../../config'

function tooltipByMulti(items) {
	let buf = ["<article class='tooltip'>"]
	let grouped = groupBy(items, 'axisIndex')
	Object.keys(grouped).forEach((id) => {
		buf.push('<fieldset>')
		buf.push(`<legend>${grouped[id][0].axisValueLabel}</legend>`)
		grouped[id].forEach((e) => {
			buf.push(`<li>${e.marker}<i>${e.seriesName}</i><i>${to(e.value[e.encode.y[0]])}</i></li>`)
		})
		buf.push('</fieldset>')
	})
	buf.push('</article>')
	return buf.join('')
}

export default assign({}, options, {
	// 用以指标的标签错开分布的属性提供，设置为空数组即可
	$indices: [],
	$series: [
		{
			$code: CATEGORY.RAINFALL,
			z: 5,
			type: 'bar',
			// barMaxWidth: 5,
			barCategoryGap: '0',
			barWidth: '100%',
			barGap: '-100%',
			large: true,
			itemStyle: { color: null },
			markPoint: {
				data: [
					{
						type: 'max',
						symbolSize: 2,
						label: {
							offset: [0, 12],
							color: 'inherit',
							fontWeight: 'bold',
							fontSize: 14,
							formatter: (e) => to(e.value)
						}
					}
				]
			}
		},
		{
			$code: ~CATEGORY.RAINFALL,
			z: 5,
			type: 'line',
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
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	color: cfg.color,
	tooltip: {
		formatter: tooltipByMulti,
		trigger: 'axis',
		axisPointer: {
			type: 'cross'
		}
	},
	axisPointer: {
		link: { xAxisIndex: 'all' }
	},
	grid: [
		{
			top: 50,
			left: 80,
			right: 80,
			bottom: '50%'
		},
		{
			left: 80,
			right: 80,
			bottom: 50,
			top: '55%'
		}
	],
	legend: {
		show: true,
		top: 10
	},
	dataZoom: [
		{
			show: true,
			type: 'slider',
			brushSelect: false,
			handleIcon: cfg.icon.zoom,
			handleSize: '60%',
			xAxisIndex: [0, 1],
			realtime: true,
			throttle: 30,
			bottom: 10,
			height: 20
			// start: 0,
			// end: 100,
		},
		{
			type: 'inside',
			realtime: true,
			// start: 0,
			// end: 100,
			xAxisIndex: [0, 1]
		}
	],
	xAxis: [
		{
			...axis,
			show: false,
			type: 'category',
			gridIndex: 0,
			boundaryGap: false,
			axisLine: { onZero: true },
			position: 'top'
		},
		{
			...axis,
			//name: "时间",
			type: 'category',
			gridIndex: 1,
			boundaryGap: false,
			axisLine: { onZero: false },
			nameGap: 50
		}
	],
	yAxis: [
		{
			...axis,
			$layout: CATEGORY.RAINFALL,
			// name: "降雨量（mm）",
			type: 'value',
			nameLocation: 'middle',
			gridIndex: 0,
			nameGap: 50,
			inverse: true,
			min: 0,
			max: (v) => to(v.max + (v.max - v.min) * 0.1)
		},
		{
			...axis,
			$layout: CATEGORY.SWC,
			type: 'value',
			// name: "土壤含水量（%）",
			nameLocation: 'middle',
			gridIndex: 0,
			nameGap: 50,
			min: 0,
			max: 100
		},
		{
			...axis,
			$layout: CATEGORY.STAGE,
			// name: "水位（m）",
			type: 'value',
			nameLocation: 'middle',
			gridIndex: 1,
			nameGap: 50,
			min: (v) => to(v.min - (v.max - v.min) * 0.1),
			max: (v) => to(v.max + (v.max - v.min) * 0.1)
		},
		{
			...axis,
			$layout: CATEGORY.FLOW,
			type: 'value',
			// name: "流量（m³/s）",
			nameLocation: 'middle',
			gridIndex: 1,
			nameGap: 50,
			min: (v) => to(Math.max(v.min - (v.max - v.min) * 0.1, 0)),
			max: (v) => to(Math.min(v.max + (v.max - v.min) * 0.1, Infinity))
		}
	]
})
