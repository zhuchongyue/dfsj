import {EChartsType} from 'echarts'
import {avg as average, max as maximum, min as minimum, sum as summary, to} from './tools'
import {CATEGORY} from '../config'

/**
 * 根据当前缩放范围统计各series的相关值
 * @param chart Echarts实例
 * @param value 数据对象
 * @return html格式的统计文本
 */
export function statistics(chart: EChartsType, value?: any): string {
	let dimensions: any[] = value?.dimensions
	let options: any = chart?.getOption()
	let source: any[] = options?.dataset[0]?.source
	let zoom = options?.dataZoom[0],
		start = zoom.startValue,
		end = zoom.endValue;
	let rows = options?.series
		.filter((e) => options.legend[0].selected[e.name] !== false && e.type !== 'mark')
		.map((e) => {
			let index = e.encode.y
			let rainfall = !!(dimensions[index].code & CATEGORY.RAINFALL)
			let min = to(minimum(source, index, start, end))
			let max = to(maximum(source, index, start, end))
			let sum = to(rainfall && summary(source, index, start, end))
			let avg = to(average(source, index, start, end))
			return `<tr><td>${e.name}</td><td>${min}</td><td>${max}</td><td>${avg}</td><td>${sum}</td></tr>`
		})
		.join('')
	return `<div class="time">${source?.[start]?.[0]} ~ ${source?.[end]?.[0]}</div>
          <table>
            <thead>
            <tr>
              <th>类目</th>
              <th>最小值</th>
              <th>最大值</th>
              <th>平均值</th>
              <th>累计值</th>
            </tr>
            </thead>
            <tbody>
              ${rows}            
            </tbody>
          </table>`
}

/**
 * 根据value和chart生成表格的维度数组，每个维度是一个对象，保护两个属性：
 * * label: 列名称；
 * * field: 列索引（因为表格的数据为纯数据，因此通过index获取）；
 * @param chart
 * @param value
 */
export function dimensions(chart: EChartsType, value?: any): any[] {
	return value?.dimensions?.map((e, i) => ({
		label: typeof e === 'string' ? e : e.name,
		field: i,
		selected: e.selected
	}))
}
