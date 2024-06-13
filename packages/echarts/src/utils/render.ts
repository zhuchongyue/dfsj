import assign from './assign'
import cfg from '../config'
import {ensure, to} from './tools'
// @ts-ignore
import {constant} from '@dfsj/utils'

/**
 * 创建高程标记点，用于大坝示意图或者断面图的高程点显示。
 *
 * 高程标记点有三种类型：
 * * 1. stage（水位点）：水位点显示在水区域，其图标特殊（有波浪线）
 * * 2. altitude（高程点）：普通高程点，可显示在任何位置，图标与水位点相似（但没有波浪线）
 * * 3. 其他类型（带牵引线的高程点）：由牵引线和文本组成
 *
 * 以上标记点均包含文本。
 *
 * @param params
 * @param api
 * @param current
 * @param scale 缩放系数，原设想标记点随图表大小进行缩放，但目前没有启用
 */
function renderAltitudeMark(params, api, current, scale = 1) {
	let p1 = api.coord([api.value(0), api.value(1)])
	let p2 = api.coord([api.value(2), api.value(3)])
	let p3 = api.coord([api.value(4), api.value(5)])
	let symbol = api.value(7),
		stage = api.value(1)
	let text = `${api.value(6)}：${to(api.value(1))}（m）`
	let color = (current >= stage && cfg.indexColor[api.value(8)]) || cfg.markColor.safe

	let shadow = 'rgba(51,51,51,0.8)'

	// 水位点类型
	if (symbol === 'stage') {
		return {
			type: 'group',
			children: [
				{
					type: 'path',
					shape: {
						pathData: cfg.icon.stage,
						x: p1[0] - 9 * scale,
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
						x: p1[0] + 10 * scale,
						y: p1[1] - 10 * scale,
						fontSize: 11 * scale,
						textFill: '#fff',
						textBorderWidth: 1,
						textBorderRadius: 20 * scale,
						textBackgroundColor: color,
						textLineWidth: 100 * scale,
						textVerticalAlign: 'middle',
						textAlign: 'left',
						textPadding: [4 * scale, 5 * scale, 2 * scale, 5 * scale]
					},
					styleEmphasis: {
						fontSize: 12 * scale,
						textBoxShadowColor: shadow,
						textBoxShadowBlur: 10 * scale,
						textBoxShadowOffsetX: scale,
						textBoxShadowOffsetY: 3 * scale,
						textBackgroundColor: '#fff',
						textFill: color
					}
				}
			]
		}
	}
	// 高程类型
	if (symbol === 'altitude') {
		return {
			type: 'group',
			children: [
				{
					type: 'path',
					shape: {
						pathData: cfg.icon.altitude,
						x: p1[0] - 9 * scale,
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
						x: p1[0] + 10 * scale,
						y: p1[1] - 10 * scale,
						fontSize: 11 * scale,
						textFill: '#fff',
						textBorderWidth: 1,
						textBorderRadius: 20 * scale,
						textBackgroundColor: color,
						textLineWidth: 100 * scale,
						textVerticalAlign: 'middle',
						textAlign: 'left',
						textPadding: [4 * scale, 5 * scale, 2 * scale, 5 * scale]
					},
					styleEmphasis: {
						fontSize: 12 * scale,
						textBoxShadowColor: shadow,
						textBoxShadowBlur: 10 * scale,
						textBoxShadowOffsetX: scale,
						textBoxShadowOffsetY: 3 * scale,
						textBackgroundColor: '#fff',
						textFill: color
					}
				}
			]
		}
	}

	// 其他类型
	return {
		type: 'group',
		children: [
			{
				z2: 5,
				type: 'circle',
				shape: {
					cx: p1[0],
					cy: p1[1],
					r: 4 * scale
				},
				style: {
					fill: '#fff',
					stroke: color
				}
			},
			{
				z2: 4,
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
					fontSize: 13 * scale,
					textFill: '#fff',
					textBorderWidth: 1,
					textBorderRadius: 20 * scale,
					textBackgroundColor: color,
					textLineWidth: 100 * scale,
					textAlign: 'right',
					textPadding: [6 * scale, 10 * scale, 3 * scale, 10 * scale]
				},
				styleEmphasis: {
					textBoxShadowColor: shadow,
					textBoxShadowBlur: 10 * scale,
					textBoxShadowOffsetX: scale,
					textBoxShadowOffsetY: 3 * scale,
					textBackgroundColor: '#fff',
					textFill: color
				}
			}
		]
	}
}

/**
 * 创建标记series，有以下几种类型：
 * 1. indices：指标标记（渲染为一条水平虚线，两端显示标记名称，颜色为指标级别‘level’对应的颜色）；
 * 2. areas：区域标记（渲染为一个方形区域，如历史、预报等）；
 * 3. splits：线标记（渲染为一条或多条垂直虚线，并在线中间或者两端显示线名称，一般为日期）。
 *
 * 这些标记来自value，且合并为一个数组返回。
 *
 * @param value 图表数据
 * @param optioned 图表options
 * @param mark 标记默认配置
 * @return {any[]} 标记series配置集合
 */
function toMarks(value, optioned, mark): any[] {
	// 处理指标标记
	const indices =
		value.indices?.reduce((p, e) => {
			return p.concat(
				e.indices.filter((idx) => {
					let color = idx.color || cfg.indexColor[idx.level]
					let yAxisIndex = optioned.yAxis.findIndex((x) => x && x.$layout & e.code)
					if (yAxisIndex > -1) {
						return assign(
							{
								color,
								yAxisIndex,
								shape: 'symbol',
								name: idx.label,
								value: idx.value,
								label: {
									text: `${idx.label}：${idx.value}` + (e.unit ? `（${e.unit}）` : ''),
									textBackgroundColor: color
								},
								itemStyle: {
									fill: color
								}
							},
							mark.shape.symbol,
							mark.side[yAxisIndex]
						)
					}
				})
			)
		}, []) || constant.EMPTY_ARRAY

	// 处理区域标记
	const areas =
		value.areas?.map((e) =>
			assign(
				{
					shape: 'rect',
					value: e.time,
					gridIndex: [0, 1],
					itemStyle: { fill: e.back || cfg.areaColor[e.type] }
				},
				mark.shape.rect
			)
		) || constant.EMPTY_ARRAY

	// 处理线标记
	let splits = ensure(value.split).reduce((accept, split) => {
		return accept.concat([
			assign({ shape: 'line', value: split }, mark.shape.line), // 线配置
			assign(
				{
					// 标记文本配置
					shape: 'text',
					value: split,
					label: {
						text: split,
						offset: [0, -15]
					}
				},
				mark.shape.text
			)
		])
	}, [])

	return indices.concat(areas).concat(splits)
}

/**
 * 单独处理指标标记。
 *
 * @param value 服务端返回的数据
 * @param optioned eChart options
 * @param yAxisCodes 当有多个grid时（此时有两条x轴）, 使用此数据来确保每条series使用哪个x轴。
 */
function toIndices(value, optioned, yAxisCodes?) {
	return value.indices?.reduce((accept, item) => {
		return accept
			.concat(
				item.indices.map((idx) => {
					let xAxisIndex = yAxisCodes?.findIndex((v) => v & item.code)
					let yAxisIndex = optioned.yAxis.findIndex((x) => x && !!(x.$layout & item.code))
					let enabled = value.dimensions
						.filter((d) => d.code === item.code)
						.some((d) => {
							let index = value.dimensions.indexOf(d)
							return value.source.some((row) => row[index] != null)
						})
					if (yAxisIndex > -1 && enabled) {
						return toIndex(idx, xAxisIndex, yAxisIndex)
					}
				})
			)
			.filter((e) => !!e)
	}, [])
}

/**
 * 根据单个指标配置创建一个series项，指标为一条横跨图表的虚线，并附带指标数据（文本）。
 * 指标线的颜色由指标值（level）指定，但可以直接指定（color）。
 *
 * 指标格式为：
 * @typedef {Object} Item 指标项
 * @property {string} item.label 指标标签（用以显示）
 * @property {string} item.color 指标颜色（如果不提供则根据level获取）
 * @property {string} item.light 默认选中
 * @property {string} item.value 指标值
 * @property {string} item.level 指标级别
 * @property {string} item.unit 指标单位
 *
 * @param item 指标项
 * @param xAxisIndex
 * @param yAxisIndex
 * @return 指标series的data项
 */
function toIndex(item, xAxisIndex = 0, yAxisIndex = 0) {
	let color = item.color
	if (color == null) {
		color = cfg.markColor[item.level] || cfg.markColor.safe
	}

	return {
		z: 10,
		type: 'mark',
		name: item.label,
		color: color,
		selected: item.light,
		data: [
			{
				xAxisIndex,
				yAxisIndex,
				shape: 'index',
				value: item.value,
				gridIndex: [yAxisIndex > 1 ? 1 : 0],
				label: {
					text: `${item.label}：${item.value}` + (item.unit ? `（${item.unit}）` : ''),
					fill: '#fff',
					offset: [5 * (yAxisIndex % 2 ? -1 : 1), -5],
					align: yAxisIndex % 2 ? 'right' : 'left',
					padding: [4, 5, 2, 10],
					verticalAlign: 'bottom',
					backgroundColor: color,
					borderWidth: 1,
					borderRadius: 20
				},
				lineStyle: {
					stroke: color,
					...cfg.mark.shape.index.lineStyle
				}
			}
		]
	}
}

export { toIndex, renderAltitudeMark, toMarks, toIndices }
