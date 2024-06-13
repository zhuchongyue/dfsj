import dayjs from 'dayjs'
// @ts-ignore
import numeral from 'numeral'
import assign from 'lodash-es/assign'
// @ts-ignore
import {constant} from '@dfsj/utils'

function numeralFormat(value: number | string, pattern: string = '0.00', def = '--'): string {
	return value == null ? def : numeral(value).format(pattern)
}

/**
 * 对数字进行格式化（使用Numbers辅助类实现）。
 *
 * @param value 数字
 * @param pattern 格式化表达式
 * @param def 默认值，当数字为null时使用
 */
function to(value: number | string, pattern: string = '0.00', def: string = '--'): string | number {
	if (isNaN(value as number)) {
		return value || def
	}
	return value != null ? numeralFormat(value, pattern) : def
}

function ensure(value: any[] | any) {
	return value == null ? constant.EMPTY_ARRAY : Array.isArray(value) ? value : [value]
}

function avg(source, index, start = 0, end = source?.length) {
	let sum = 0,
		count = 0
	for (let i = start; i < end; i++) {
		let value = source[i][index]
		if (value != null) (sum += value), count++
	}
	return count > 0 ? sum / count : null
}

function sum(source, index, start = 0, end = source.length) {
	let num = 0
	for (let i = start; i <= end; i++) {
		let value = source[i][index]
		if (value != null) num += value
	}
	return num
}

function min(source, index, start = 0, end = source.length) {
	let num = Number.POSITIVE_INFINITY
	for (let i = start; i <= end; i++) {
		let value = source?.[i]?.[index]
		if (value != null && value < num) {
			num = value
		}
	}
	return num === Number.POSITIVE_INFINITY ? null : num
}

function max(source, index, start = 0, end = source.length) {
	let num = Number.NEGATIVE_INFINITY
	for (let i = start; i <= end; i++) {
		let value = source?.[i]?.[index]
		if (value != null && value > num) {
			num = value
		}
	}
	return num === Number.NEGATIVE_INFINITY ? null : num
}

/**
 * 创建适用于大坝示意图和横断面示意图的时间轴标记。
 * @param map 标记区域配置
 * @param area 标记区域，来自value，详见sample。
 * @param source 数据源（第一列为时间）
 */
function toArea(map: any, area: any[], source: any[]) {
	return area?.map((e) =>
		assign(
			{
				index: [
					source.findIndex((x) => x[0] === e.time[0]),
					source.findIndex((x) => x[0] === e.time[1])
				]
			},
			map[e.type]
		)
	)
}

/**
 * 在包含日期的数据中，查找最接近当前日期的index。
 * @param source
 */
function findNowIndex(source: any[][]): number {
	let now = dayjs(Date.now()).valueOf()
	let min = Number.MAX_VALUE,
		index = 0
	for (let i = 0, ii = source.length; i < ii; i++) {
		let time = dayjs(source[i][0])
		let diff = Math.abs(time.diff(now, 'milliseconds').valueOf())
		if (diff < min && time.valueOf() - now.valueOf() > 0) {
			min = diff
			index = i
		}
	}
	return index
}

/**
 * 根据特定的数据查询数据所在的位置
 * @param source
 * @param index
 * @param start
 * @param end
 */
function findDataIndex(target:number | string ,source: any[][] , index=0, start = 0, end = source.length ) {
	let extractedData = source.reduce((acc, row, i) => {
		if (i >= start && i <= end) {
			acc.push(row[index]);
		}
		return acc;
	}, []);
	return extractedData.findIndex((e)=>e== +target)
}

//之前是utils/tools 和 charts.tools  现在把它合并了
//***********************************************utils tools********************************************************************************************************************
/**
 * Find the min&max value on complex-index.
 * If min not found, then min value is Infinity, if max not found, then max value is -Infinity.
 * @param value {Object} The value who contains index value.
 * @param code {Number} Witch type you want to find.
 * @return {[Number,Number]} The [min,max] value.
 */
function complexMinMaxIndex(value, code) {
	if (value != null && value.indices != null) {
		let item = value.indices.find((e) => e.code === code)
		if (item != null) {
			return [
				item.indices.reduce((p, v) => (v.value > 0 && v.value < p ? v.value : p), Infinity),
				item.indices.reduce((p, v) => (v.value > 0 && v.value > p ? v.value : p), -Infinity)
			]
		}
	}
	return [Infinity, -Infinity]
}

function simpleMinMaxIndex(value) {
	if (value != null && value.indices != null) {
		return [
			value.indices.reduce((p, v) => (v.value > 0 && v.value < p ? v.value : p), Infinity),
			value.indices.reduce((p, v) => (v.value > 0 && v.value > p ? v.value : p), -Infinity)
		]
	}
	return [Infinity, -Infinity]
}

/**
 * Compute the minimum value on eCharts yAxis.
 *
 * Same as {@link maximum}.
 * @param v {{min:Number,max:Number}} The eCharts yAxis min&max value.
 * @param a {[Number,Number]} The index [mim,max] value.
 * @param limit {Number} The limit value.
 * @return {Number} The minimum value.
 */
function minimum(v, a, limit = 0) {
	return +numeral(
		Math.max(Math.min(v.min, a[0]) - (Math.max(v.max, a[1]) - Math.min(v.min, a[0])) * 0.1, limit)
	).format('0.00')
}

function maximum(v, a, limit = Infinity) {
	return +numeral(
		Math.min(Math.max(v.max, a[1]) + (Math.max(v.max, a[1]) - Math.min(v.min, a[0])) * 0.1, limit)
	).format('0.00')
}

// 获取数据中最新日期及前面第n天的日期
function getNearNDays(data: any[], day: number = 0) {
	if (data?.length > 0) {
		// let last = DateTime.fromSQL(data[data.length - 1]);
		// let index = data.findIndex(row => last.diff(DateTime.fromSQL(row[0]), "day").days >= day);
		let last = dayjs(data[data.length - 1])
		let index = data.findIndex((row) => last.diff(dayjs(row[0]), 'day') >= day)
		return [index, data.length - 1]
	}
	return constant.EMPTY_ARRAY
}

const units = [
	{ value: 1e4, units: '亿m³' },
	{ value: 1e2, units: '百万m³' },
	{ value: 1, units: '万m³' }
]

function adjustCapacity(capacity: number): number {
	if (capacity != null) {
		let item = units.find((e) => capacity >= e.value)
		if (item) return numeral(capacity / item.value).format('0.000')
	}
	return capacity
}

function adjustCapacityUnit(capacity: number): string {
	if (capacity != null) {
		let item = units.find((e) => capacity >= e.value)
		if (item) return item.units
	}
	return '万m³'
}

export {
	numeralFormat,
	to,
	ensure,
	min,
	avg,
	max,
	sum,
	toArea,
	findNowIndex,
	minimum,
	maximum,
	getNearNDays,
	adjustCapacityUnit,
	adjustCapacity,
	complexMinMaxIndex,
	simpleMinMaxIndex,
	findDataIndex
}
