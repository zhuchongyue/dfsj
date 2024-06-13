import def from './default'
import {max, maximum, min, minimum, numeralFormat, simpleMinMaxIndex, to} from '../../utils/tools'
import {renderAltitudeMark, toIndex} from '../../utils/render'
import cfg, {TYPE_SYMBOL} from '../../config'
import {createLinearInterpolator} from 'commons-math-interpolation/Linear'
import {assign, units} from '../../utils'
import type {Ref} from 'vue';
import {ref} from 'vue'
import get from 'lodash-es/get'
import {useECharts} from '../../hooks/useECharts'
import {useToolTip} from '../../view/useToolTip'
import {useTable} from '../../view/useTable'

export function useCapacity(chartRef: Ref<HTMLElement>) {
	const { setOptions, echarts, getInstance, container } = useECharts(chartRef)
	const visible = ref(false)
	const { offset, content, open: openToolTip, close: closeToolTip } = useToolTip(container)
	const { open: openTable, close: closeTable, props, toggleTable } = useTable()
	props.container = container
	/**
	 * 按要求组装echarts 的options
	 * */
	const assemble = (value: any, options: any): any => {
		const optioned = assign({}, def, options)
		let chart = getInstance()
		console.log('chart', chart)
		if (value != null) {
			props.value = value
			props.chart = chart
			optioned.dataset.source = value.source
			optioned.xAxis[1].show = value.dimensions.length > 2
			optioned.xAxis[0].name = value.dimensions[1]
			optioned.series = value.dimensions
				.filter((e, i) => i > 0)
				.map((e, i) => assign({ name: e }, optioned.series[i]))
			// 配置标记点
			if (value.points?.length) {
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
							// 使用自定义series渲染高程点
							renderItem: (params, api) =>
								renderAltitudeMark(params, api, current && current.altitude),
							data: value.points
								.slice()
								.sort((a, b) => b.altitude - a.altitude)
								.map((e) => {
									let symbol = e.symbol || TYPE_SYMBOL[e.type]
									let x1 = symbol ? lft : rgt // 高程点x坐标
									let y1 = e.altitude // 高程点y坐标
									let x2 = x1 - sh * 60 // 牵引线左x坐标
									let y2 = bom + (start - counter * sv * 70) // 牵引线左y坐标
									let x3 = x2 - sh * 20 // 牵引线右x坐标
									let y3 = y2 // 牵引线有y坐标
									if (symbol == null) counter++ //
									return { value: [x1, y1, x2, y2, x3, y3, e.label || e.name, symbol, e.level] }
								})
						},
						optioned.$mark
					)
				)
			}

			// 获取指标series
			let indices = value.indices?.map((e) => toIndex(e))
			if (indices?.length) optioned.series.push(...indices)
			// 设置legend
			optioned.legend.data = optioned.series.map((e) => ({
				name: e.name,
				nameStyle: { color: e.color }
			}))
			// 设置legend默认选中与否
			optioned.legend.selected = optioned.series.reduce((p, v) => {
				return (p[v.name] = v.selected != null ? v.selected : true), p
			}, {})

			// 创建工具栏中表格元素
			optioned.toolbox.feature.myTabulation = {
				// onclick: () => this.tools.tabulation = !this.tools.tabulation,
				onclick: () => {
					props.visible = !props.visible
					console.log('打开', props)
					props.visible ? openTable() : closeTable()
				},
				icon: cfg.icon.tabulation,
				title: '表格'
			}

			console.log('container', container)
			//使用线性插值算法计算对应的值
			//使用自定义的tooltip来显示提示信息
			try {
				// let visible   = this.visible;
				// let container = this.container;
				// let offset    = this.offset;
				let grid = optioned.grid
				let stage = value.source.map((d) => d[0])
				let lines = value.dimensions.map((e, i) => {
					return !i
						? (v) => v
						: createLinearInterpolator(
								stage,
								value.source.map((d) => d[i])
						  )
				})

				if (!container.value) return
				let el = container.value
				console.log({ el })
				// @ts-ignore
				el.onclick = function () {
					console.log('---')
				}
				el.onmouseout = function () {
					visible.value = false
					closeToolTip()
				}
				// @ts-ignore
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
						// 根据当前鼠标坐标计算图表对应的坐标
						const coords = chart.convertFromPixel({ seriesIndex: 0 }, [0, offsetY])
						// 根据维度生成tooltip提示信息
						const fields = value.dimensions
							.map((e, i) => {
								const color = i && get(optioned.series[i - 1], 'lineStyle.color')
								return `<li>
                          <span class="mark" style="background: ${color}"></span>
                          <i>${e}</i>
                          <i>${to(lines[i](+coords[1]), '0.000')}</i>
                        </li>`
							})
							.join('')
						content.value = `<fieldset>${fields}</fieldset>`
					} else {
						closeToolTip()
					}
				}

				// optioned.tooltip = true;
			} catch (e) {}
		}
		console.log('container', container)

		return optioned
	}
	/***
	 * 转换数据
	 */
	const transform = (data: any) => {
		if (data != null) {
			let maximum = data.source.reduce((p, v) => (v[1] > p ? v[1] : p), 0)
			let unit: any = units.find((e) => maximum >= e.value)
			if (unit?.value !== 0) {
				data.source.forEach((e) => (e[1] = numeralFormat(e[1] / unit.value, '0.000')))
				data.unit = unit
				data.dimensions = ['水位（m）', `水位-库容（${unit.symbol}）`, '水位-面积（km²）']
			}
		}
	}
	/**
	 * 转换配置
	 * */
	const createOptions = (data: any) => {
		if (data != null) {
			let cap = simpleMinMaxIndex(data)
			return {
				yAxis: [
					{
						min: (v) => minimum(v, cap),
						max: (v) => maximum(v, cap)
					}
				]
			}
		}
	}

	return {
		setOptions,
		echarts,
		getInstance,
		container,
		assemble,
		transform,
		createOptions,
		toggleTable
	}
}
