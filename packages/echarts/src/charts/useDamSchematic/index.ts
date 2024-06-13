import {EChartsType} from 'echarts'
import assign from '../../utils/assign'
import {findNowIndex, numeralFormat, to, toArea} from '../../utils/tools'
import last from 'lodash-es/last'
import cfg, {TYPE_SYMBOL} from '../../config'
import def, {IMAGES, TYPES} from './default'
import iD from './images/-1.png'
import {createLinearInterpolator} from 'commons-math-interpolation/Linear'
import units from '../../utils/units'
import {useECharts} from '../../hooks/useECharts'
import {Ref} from 'vue'

export function useDamSchematic(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)
	/**
	 * 按要求组装echarts 的options
	 * */
	const assemble = (value: any, options: any): any => {
		let chart: EChartsType = getInstance() as any
		let optioned = assign({}, def, options)
		let times,
			points = value?.points
		if (points?.length) {
			const source = value.source || []
			const area = toArea(optioned.$area, value.area, source)
			const grid = optioned.grid
			const availableHeight = chart.getHeight() - (grid.top + grid.bottom)
			const availableWidth = chart.getWidth() - (grid.left + grid.right)

			// 引入大坝图片
			optioned.graphic.style.image = IMAGES[value.type] || iD
			optioned.graphic.style.width = availableWidth
			optioned.graphic.style.height = availableHeight

			// 根据图片与高程信息计算相关参数
			const cfg = TYPES[value.type]
			const section = cfg.section.slice()
			const top = (points.find((e) => e.type === 'top') || last(value.points)).altitude // 获取坝顶高程
			const bom = (points.find((e) => e.type === 'bottom') || points[0]).altitude // 获取坝底高程
			const diff = top - bom // 高程差
			const scale = availableHeight / section[3] // 计算垂直缩放系数
			const pixel = diff / (section[1] * scale) // 计算单位屏幕像素占图片多少像素
			const min = bom - section[0] * scale * pixel // 计算最小高程
			const max = min + scale * section[3] * pixel // 计算最大高程
			const limit = bom

			let counter = 0

			optioned.yAxis.min = min
			optioned.yAxis.max = max

			// 组装标记点数据
			optioned.series[0] = { z: 9, type: 'custom' }
			optioned.series[0].data = points
				.slice()
				.filter((e) => e.altitude && e.type !== 'bottom')
				.sort((a, b) => b.altitude - a.altitude)
				.map((e) => {
					let x1 = cfg.point((e.altitude - min) / pixel / scale)
					let y1 = e.altitude
					let x2 = cfg.mark[0]
					let y2 = min + (cfg.mark[1] - counter * 70) * scale * pixel
					let x3 = cfg.mark[0] + 50
					let symbol = e.symbol || TYPE_SYMBOL[e.type]
					if (symbol == null) counter++
					return { value: [x1, y1, x2, y2, x3, y2, e.label || e.name, symbol, e.level, e.color] }
				})

			// 渲染标记点（如校核水位、设计水位等）
			// 有两种标记点，一种是图标+文本，另一种是一条牵引线+文本
			// 标记点类型由symbol指定
			optioned.series[0].renderItem = (params, api) => {
				// @ts-ignore
				let index = chart.getOption().timeline[0].currentIndex
				let stage = source.length ? source[index][1] : 0
				return renderAltitude(params, api, stage, 1)
			}

			// 为每个数据创建eCharts-options
			times = source.map((e) => {
				let c = e[1] // 当前水位
				if (bom - e[1] > 1) e[1] = bom // 调整水位下限
				if (top - e[1] < 1) e[1] = top // 调整水位上限
				let x1 = cfg.water[0]((e[1] - limit) / pixel / scale) // 获取水位左x坐标（水位为一条水平线）
				let x2 = cfg.water[1]((e[1] - limit) / pixel / scale) // 获取水位右x坐标（水位为一条水平线）
				let y = limit + (e[1] - limit) / 2 // 获取水位y坐标（绘制水区域）
				let amplitude = 3 // 使用固定振幅
				// let amplitude = (10 / diff) * (y - min);                         // 根据水位大小调整振幅（未启用）
				return {
					title: {
						text: [
							'时间：' + e[0],
							e[1] != null ? `水位：${to(e[1])}（m）` : '',
							e[2] != null ? `库容：${to(e[2])}（${value.dimensions[2].unit}）` : ''
						].join('  '),
						subtext: c !== e[1] ? `数据有误，已进行调整，原水位：${c}（m）` : undefined
					},
					series: [
						{},
						assign(
							{
								data: [
									[0, e[1]],
									[x1, e[1]],
									[x2, optioned.yAxis.min]
								],
								amplitude
							},
							optioned.$water
						),
						assign(
							{
								data: [
									assign(
										{
											value: [40, e[1]],
											label: { formatter: `当前水位：${to(e[1])}（m）` }
										},
										optioned.$stage
									),
									assign(
										{
											value: [40, y],
											label: { formatter: `当前库容：${to(e[2])}（${value.dimensions[2].unit}）` }
										},
										optioned.$capacity
									)
								]
							},
							optioned.$current
						)
					]
				}
			})

			// 创建时间线数据及提示信息
			optioned.timeline.data = source.map((e, i) => {
				// 如果没有标记区域，则直接显示日期
				if (area == null) return { value: e[0], tooltip: { formatter: e[0] } }
				// 否则，根据标记类型显示日期（比如历史、预报等）
				let mark = area.find((e) => e.index[0] <= i && i <= e.index[1])
				let tooltip = { formatter: mark ? `${mark.title} ${e[0]}` : e[0] }
				return assign({ tooltip, value: e[0] }, mark)
			})
			// 用线性插值算法计算每隔标记点与当前水位的库容差
			// 如果插值失败，则不会提示库容差，而是显示简单信息
			try {
				let x = Array.from(new Set([bom].concat(source.map((e) => e[1]).sort())))
				let y = Array.from(new Set([0x0].concat(source.map((e) => e[2]).sort())))
				let interpolator = createLinearInterpolator(x, y)

				optioned.tooltip.formatter = (p) => {
					// @ts-ignore
					let index = chart.getOption().timeline[0].currentIndex
					let stage = source[index][1],
						current = source[index][2]
					let capacity = interpolator(p.value[1])
					let capDiff = interpolator(p.value[1]) - current
					let staDiff = p.value[1] - stage
					return tooltip(p.value[6], capacity, capDiff, staDiff, value.dimensions[2].unit)
				}
			} catch (e) {}
			let history = area?.find((e) => (e.type = 'history'))
			optioned.timeline.currentIndex =
				history == null ? findNowIndex(source) : Math.max(history.index[1], 0)
		}
		return { baseOption: optioned, options: times }
	}
	const tooltip = (name, capacity, capDiff, staDiff, unit): string => {
		return `<article class="tooltip">
            <fieldset>
              <legend>${name}</legend>
                <li><i>对应库容</i><i>${to(capacity)}（${unit}）</i></li>
                <li><i>库容差</i><i>${to(capDiff)}（${unit}）</i></li>
                <li><i>水位差</i><i>${to(staDiff)}（m）</i></li>
            </fieldset>
          </article>`
	}
	const renderAltitude = (params, api, current, scale = 1) => {
		let p1 = api.coord([api.value(0), api.value(1)])
		let p2 = api.coord([api.value(2), api.value(3)])
		let p3 = api.coord([api.value(4), api.value(5)])
		let symbol = api.value(7),
			stage = api.value(1)
		let text = `${api.value(6)}：${to(api.value(1))}（m）`
		let color =
			(current >= stage && cfg.indexColor[api.value(8)]) || api.value(9) || cfg.markColor.safe

		let shadow = 'rgba(51,51,51,0.6)' //图形阴影颜色

		if (symbol === 'stage') {
			//水位类型标记点，由水位图标+文本
			return {
				type: 'group',
				z2: 1,
				children: [
					{
						type: 'path',
						z2: 1,
						shape: {
							pathData: cfg.icon.stage,
							x: p1[0] - 3 * scale,
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
						z2: 1,
						style: {
							text,
							x: p1[0] + 20 * scale,
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
							shadowColor: shadow,
							shadowBlur: 10 * scale,
							shadowOffsetX: scale,
							shadowOffsetY: 3 * scale,
							backgroundColor: '#fff',
							fill: color
						}
					}
				]
			}
		}

		if (symbol === 'altitude') {
			//高程类型标记点，由高程图标+文本
			return {
				type: 'group',
				z2: 1,
				children: [
					{
						type: 'path',
						z2: 1,
						shape: {
							pathData: cfg.icon.altitude,
							x: p1[0] - 3 * scale,
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
						z2: 1,
						style: {
							text,
							x: p1[0] + 20 * scale,
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
							shadowColor: shadow,
							shadowBlur: 10 * scale,
							shadowOffsetX: scale,
							shadowOffsetY: 3 * scale,
							backgroundColor: '#fff',
							fill: color
						}
					}
				]
			}
		}

		//牵引线类型标记点，由一条牵引线+文本
		//多个牵引线将安装从上往下的顺序绘制
		return {
			type: 'group',
			z2: 0,
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
					},
					styleEmphasis: {
						fill: color,
						stroke: '#fff',
						shadowBlur: 3,
						shadowColor: color
					}
				},
				{
					type: 'polyline',
					z2: 0,
					shape: {
						points: [p1, p2, p3]
					},
					style: {
						fill: null,
						lineWidth: 0.5,
						stroke: color,
						shadowBlur: 8 * scale,
						shadowColor: '#fff'
					},
					styleEmphasis: {
						shadowBlur: 2 * scale,
						shadowColor: shadow,
						shadowOffsetX: scale,
						shadowOffsetY: 3 * scale,
						lineWidth: 2
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

	/***
	 * 转换数据
	 */
	const transform = (data: any) => {
		if (data != null) {
			let maximum = data.source.reduce((p, v) => (v[2] > p ? v[2] : p), 0)
			let unit = units.find((e) => maximum >= e.value) || units[2]
			if (unit.value !== 0) {
				data.source.forEach((e) => (e[2] = e[2] && numeralFormat(e[2] / unit.value)))
				data.unit = unit
			}
			data.dimensions = [
				'时间',
				'水位（m）',
				{ name: `库容（${unit.symbol}）`, unit: unit.symbol },
				{ name: `入库流量(m³/s)` },
				{ name: `下泄流量(m³/s)` }
			]
		}
		return data
	}

	/**
	 * 转换配置
	 * */
	const createOptions = (data: any) => {
		return data
	}

	return {
		setOptions,
		echarts,
		getInstance,
		container,
		assemble,
		transform,
		createOptions
	}
}
