import {createLinearInterpolator} from 'commons-math-interpolation'
import get from 'lodash-es/get'
import {ref, Ref} from 'vue'
import {assign} from '../../utils'
import cfg, {TYPE_SYMBOL} from '../../config'
import {renderAltitudeMark, toIndex} from '../../utils/render'
import {max, min, to} from '../../utils/tools'
import def from './default'
import {useECharts} from '../../hooks/useECharts'
import {useToolTip} from '../../view/useToolTip'
import {useTable} from '../../view/useTable'

/***
 * 水位流量图
 * @param chartRef
 */
export function useStageflow(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)

	const visible = ref(false)
	const { offset, content, open: openToolTip, close: closeToolTip } = useToolTip(container)
	const { open: openTable, close: closeTable, props, toggleTable } = useTable()
	props.container = container

	/**
	 * 按要求组装echarts 的options
	 * */
	const assemble = (value: any, options: any): any => {
		let optioned = assign({}, def, options)
		let chart = getInstance()
		if (value != null) {
			props.value = value
			props.chart = chart
			optioned.dataset.source = value.source
			let indices = value.indices?.map((e) => toIndex(e))
			if (indices && indices.length) {
				indices.forEach((e) => optioned.series.push(e))
			}
			optioned.legend.data = optioned.series.map((e) => ({
				name: e.name,
				nameStyle: { color: e.color }
			}))
			optioned.legend.selected = optioned.series.reduce((p, v) => {
				return (p[v.name] = v.selected != null ? v.selected : true), p
			}, {})
			// 创建标记点（如果存在）
			if (value.points) {
				let lft = min(value.source, 1)
				let rgt = max(value.source, 1)
				let top = max(value.source, 0)
				let bom = min(value.source, 0)
				let sv = (top - bom) / 1000
				let sh = (rgt - lft) / 1000
				let start = ((top - bom) / 3) * 2
				let counter = 0
				let current = value.points.find((e) => e.type === 'current')
				optioned.series.push(
					assign(
						{
							renderItem: (params, api) =>
								renderAltitudeMark(params, api, current && current.altitude),
							data: value.points
								.slice()
								.sort((a, b) => b.altitude - a.altitude)
								.map((e) => {
									let symbol = e.symbol || TYPE_SYMBOL[e.type]
									let x1 = symbol ? lft : rgt
									let y1 = e.altitude
									let x2 = x1 - sh * 60
									let y2 = bom + (start - counter * sv * 70)
									let x3 = x2 - sh * 20
									let y3 = y2
									if (symbol == null) counter++
									return { value: [x1, y1, x2, y2, x3, y3, e.label || e.name, symbol, e.level] }
								})
						},
						optioned.$mark
					)
				)
			}

			// 创建工具栏
			optioned.toolbox.feature.myTabulation = {
				onclick: () => (this.tools.tabulation = !this.tools.tabulation),
				icon: cfg.icon.tabulation,
				title: '表格'
			}
			// debugger

			// 使用线性插值算法计算相关值
			// 使用自定义tooltip来提示信息
			try {
				let grid = optioned.grid
				let dimensions = value.dimensions || ['水位（m）', '流量（m³/s）']
				let stage = value.source.map((d) => d[0])
				let lines = dimensions.map((e, i) => {
					return !i
						? (v) => v
						: createLinearInterpolator(
								stage,
								value.source.map((d) => d[i])
						  )
				})
				if (!container.value) return
				let el = container.value
				el.onclick = function () {
					console.log('---')
				}
				el.onmouseout = function () {
					visible.value = false
					closeToolTip()
				}
				el.onmousemove = ({ offsetY, offsetX }) => {
					const width = chart.getWidth()
					const height = chart.getHeight()
					visible.value =
						offsetX >= grid.left &&
						offsetX <= width - grid.right &&
						offsetY >= grid.top &&
						offsetY <= height - grid.bottom
					if (visible.value) {
						openToolTip()
						offset.x = offsetX + 10
						offset.y = offsetY + 10
						if (offset.x > width - 180) offset.x -= 180
						if (offset.y > height - 80) offset.y -= 80
						let coords = chart.convertFromPixel({ seriesIndex: 0 }, [0, offsetY])
						let fields = value.dimensions
							.map((e, i) => {
								let color = i && get(optioned.series[i - 1], 'lineStyle.color')
								return `<li>
                        <span class="mark" style="background: ${color}"></span>
                        <i>${e}</i>
                        <i>${to(lines[i](+coords[1]))}</i>
                     </li>`
							})
							.join('')
						content.value = `<fieldset>${fields}</fieldset>`
					} else {
						closeToolTip()
					}
				}
				// optioned.tooltip = false;
			} catch (e) {}
		}
		return optioned
	}

	/**
	 * 转换配置
	 * */
	const createOptions = (data: any) => {
		return {}
	}
	return {
		setOptions,
		createOptions,
		echarts,
		getInstance,
		container,
		assemble,
		toggleTable
	}
}
