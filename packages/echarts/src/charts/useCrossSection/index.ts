import {EChartsType} from 'echarts/core'
import {findNowIndex, max, min, to, toArea} from '../../utils/tools'
import assign from '../../utils/assign'
import def from './default'
import cfg, {TYPE_SYMBOL} from '../../config'
import last from 'lodash-es/last'
import {createLinearInterpolator} from 'commons-math-interpolation/Linear'
import {useECharts} from '../../hooks/useECharts'
import {Ref} from 'vue'

/***
 * 横断面图
 */
export function useCrossSection(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)
	const assemble = (value: any, options: any): any => {
		let chart: EChartsType = getInstance() as any
		let optioned = assign({}, def, options),
			nodes,
			direction = [0]
		if (value != null) {
			let layout = value.layout
			let source = value.source || []
			let area = toArea(optioned.$area, value.area, source)
			let lft = max(layout, 0)
			let rgt = min(layout, 0)
			let center = value.center || (lft + rgt) / 2
			let sca = ((lft - rgt) / 1000) * 50
			let bom = min(layout, 1)
			// 标记点（高程）
			let points =
				(value.points &&
					value.points
						.slice()
						.filter((e) => e.altitude)
						.sort((a, b) => b.altitude - a.altitude)) ||
				[]

			direction = points.map(() => 0)
			optioned.series[1] = { z: 9, type: 'custom' }
			optioned.series[0].data = value.layout
			optioned.series[1].data = points.map((e, i) => {
				let x1 = center + sca
				let y1 = e.altitude
				let symbol = e.symbol || TYPE_SYMBOL[e.type] || 'altitude'
				return { value: [x1, y1, e.label || e.name, symbol, e.level, i] }
			})

			// 自定义series来实现标记点
			optioned.series[1].renderItem = (params, api) => {
				let index = chart.getOption().timeline[0].currentIndex
				let stage = source.length ? source[index][1] : 0
				return renderMarkPoint(params, api, stage, points, direction, 1)
			}

			// 时间节点
			nodes = source.map((e, i) => {
				let right = last(value.layout)[0] // 右坐标
				let amplitude = 3 // 水位振幅（目前用固定值）
				// let amplitude = (10 / (top - bom)) * (e[1] - bom);
				return {
					title: {
						text: [
							'时间：' + e[0],
							e[1] != null ? `水位：${to(e[1])}m` : '',
							e[2] != null ? `流量：${to(e[2])}m³/s` : ''
						]
							.filter((x) => x)
							.join('  ')
					},
					series: [
						{},
						{},
						assign(
							{
								data: [
									[0, e[1]],
									[right, e[1]],
									[right, bom]
								],
								amplitude
							},
							optioned.$water
						),
						assign(
							{
								data: [
									{
										value: [center, e[1]],
										label: {
											formatter: `当前水位：${to(e[1])}（m）\n当前流量：${to(e[2])}（m³/s）`
										}
									}
								]
							},
							optioned.$current
						)
					]
				}
			})

			optioned.timeline.data = source.map((e, i) => {
				if (area == null) return { value: e[0], tooltip: { formatter: e[0] } }
				let mark = area.find((e) => e.index[0] <= i && i <= e.index[1])
				let tooltip = { formatter: mark ? `${mark.title} ${e[0]}` : e[0] }
				return assign({ tooltip, value: e[0] }, mark)
			})

			/**
			 * 应用插值算法对个高程点进行插值运算，以得到对应数据（如流量差，水位差等）。
			 */
			try {
				let x = Array.from(new Set([bom].concat(source.map((e) => e[1]).sort())))
				let y = Array.from(new Set([0x0].concat(source.map((e) => e[2]).sort())))
				let interpolator = createLinearInterpolator(x, y)
				optioned.tooltip.formatter = (p) => {
					let index = chart.getOption().timeline[0].currentIndex
					let stage = value.source[index][1]
					let current = value.source[index][2]
					let flow = interpolator(p.value[1])
					let floDiff = interpolator(p.value[1]) - current
					let staDiff = p.value[1] - stage
					return tooltip(p.value[2], flow, floDiff, staDiff)
				}
			} catch (e) {}
			let history = area && area.find((e) => (e.type = 'history'))
			optioned.timeline.currentIndex =
				history == null ? findNowIndex(source) : Math.max(history.index[1], 0)
		}
		return { baseOption: optioned, options: nodes }
	}
	const tooltip = (name, flow, floDiff, staDiff) => {
		return `<article class="tooltip">
            <fieldset>
              <legend>${name}</legend>
                <li><i>对应流量</i><i>${to(flow)}（m³/s）</i></li>
                <li><i>流量差</i><i>${to(floDiff)}（m³/s）</i></li>
                <li><i>水位差</i><i>${to(staDiff)}（m）</i></li>
            </fieldset>
          </article>`
	}
	/**
	 * 创建横断面示意图的标记点图形
	 */
	const renderMarkPoint = (params, api, current, points, direction, scale = 1) => {
		let p1 = api.coord([api.value(0), api.value(1)])
		let symbol = api.value(3),
			stage = api.value(1)
		let text = `${api.value(2)}：${to(api.value(1))}（m）`
		let color = (current >= stage && cfg.indexColor[api.value(4)]) || cfg.markColor.safe
		let shadow = 'rgba(51,51,51,0.6)'

		let index = api.value(5),
			dir = direction[index - 1] || 0
		if (index > 0) {
			let s1 = api.coord([0, points[index - 1].altitude])
			let s2 = api.coord([0, points[index - 0].altitude])
			if (s2[1] - s1[1] < 30) {
				dir = direction[index] = 1 - dir
			}
		}

		if (symbol === 'stage') {
			return {
				type: 'group',
				children: [
					{
						type: 'path',
						shape: {
							pathData: !dir ? cfg.icon.stage : cfg.icon.stageMirror,
							x: p1[0] - 3 * scale - dir * 210,
							y: p1[1] - 18.5 * scale,
							width: 190 * scale,
							height: 30 * scale
						},
						style: {
							fill: color,
							shadowBlur: 8 * scale,
							shadowColor: 'rgba(255,255,255,0.3)'
						},
						styleEmphasis: {
							shadowBlur: 5 * scale,
							shadowColor: shadow,
							shadowOffsetX: scale,
							shadowOffsetY: 3 * scale
						}
					},
					{
						type: 'text',
						style: {
							text,
							x: p1[0] + 20 * scale - dir * 210,
							y: p1[1] - 10 * scale,
							font: 'normal 11px arial',
							fill: '#fff',
							borderWidth: 1,
							borderRadius: 20 * scale,
							backgroundColor: color,
							lineWidth: 100 * scale,
							verticalAlign: 'middle',
							padding: [4 * scale, 5 * scale, 2 * scale, 5 * scale]
						},
						styleEmphasis: {
							font: 'normal 12px arial',
							fill: color,
							shadowColor: shadow,
							shadowBlur: 10 * scale,
							shadowOffsetX: scale,
							shadowOffsetY: 3 * scale,
							backgroundColor: '#fff'
						}
					}
				]
			}
		}

		if (symbol === 'altitude') {
			return {
				type: 'group',
				children: [
					{
						type: 'path',
						shape: {
							pathData: !dir ? cfg.icon.altitude : cfg.icon.altitudeMirror,
							x: p1[0] - 3 * scale - dir * 210,
							y: p1[1] - 23 * scale,
							width: 190 * scale,
							height: 30 * scale
						},
						style: {
							fill: color,
							shadowBlur: 8 * scale,
							shadowColor: 'rgba(255,255,255,0.3)'
						},
						styleEmphasis: {
							shadowBlur: 2 * scale,
							shadowColor: shadow,
							shadowOffsetX: scale,
							shadowOffsetY: 3 * scale
						}
					},
					{
						type: 'text',
						style: {
							text,
							x: p1[0] + 20 * scale - dir * 210,
							y: p1[1] - 10 * scale,
							font: 'normal 11px arial',
							fill: '#fff',
							borderWidth: 1,
							borderRadius: 20 * scale,
							backgroundColor: color,
							lineWidth: 100 * scale,
							verticalAlign: 'middle',
							padding: [4 * scale, 5 * scale, 2 * scale, 5 * scale]
						},
						styleEmphasis: {
							font: 'normal 12px arial',
							fill: color,
							shadowColor: shadow,
							shadowBlur: 10 * scale,
							shadowOffsetX: scale,
							shadowOffsetY: 3 * scale,
							backgroundColor: '#fff'
						}
					}
				]
			}
		}

		let p2 = [],
			p3 = []
		return {
			type: 'group',
			children: [
				{
					z2: 5,
					type: 'circle',
					shape: {
						cx: p1[0],
						cy: p1[1],
						r: 3
					},
					style: {
						fill: '#fff',
						stroke: color
					}
				},
				{
					type: 'polyline',
					shape: {
						points: [p1, p2, p3]
					},
					style: {
						fill: null,
						lineWidth: 2 * scale,
						stroke: color,
						shadowBlur: 8 * scale,
						shadowColor: '#fff'
					},
					styleEmphasis: {
						shadowBlur: 2 * scale,
						shadowColor: shadow,
						shadowOffsetX: scale,
						shadowOffsetY: 3 * scale
					}
				},
				{
					type: 'text',
					style: {
						text,
						x: p3[0],
						y: p3[1] - 12 * scale,
						font: 'normal 12px arial',
						fill: '#fff',
						borderWidth: 1,
						borderRadius: 20 * scale,
						backgroundColor: color,
						lineWidth: 100 * scale,
						padding: [6 * scale, 10 * scale, 3 * scale, 10 * scale]
					},
					styleEmphasis: {
						font: 'normal 13px arial',
						shadowColor: shadow,
						shadowBlur: 10 * scale,
						shadowOffsetX: scale,
						shadowOffsetY: 3 * scale
					}
				}
			]
		}
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
		assemble,
		tooltip,
		renderMarkPoint
	}
}
