/***
 * 水文水库
 */
import {complexMinMaxIndex, getNearNDays, maximum, minimum, numeralFormat} from '../utils/tools'
import {CATEGORY} from '../config'

const units = [
	{ value: 1e4, symbol: '亿m³' },
	{ value: 1e2, symbol: '百万m³' },
	{ value: 0, symbol: '万m³' }
]

export function useAssist() {
	const config = {
		//水文站
		15: {
			//来水预报
			forec: {
				createOptions: (data) => {
					if (data == null) return null
					let flo = complexMinMaxIndex(data, CATEGORY.FLOW)
					return {
						yAxis: [
							{
								$layout: CATEGORY.RAINFALL,
								name: '降雨量(mm)',
								min: 0,
								max: (v) => Math.round(v.max + (v.max - v.min) * 0.1)
							},
							{
								$layout: CATEGORY.SWC,
								name: '土壤含水量(%)',
								min: 0,
								max: (v) => Math.round(v.max + (v.max - v.min) * 0.1)
							},
							{
								$layout: CATEGORY.FLOW,
								name: '流量(m³/s)',
								min: (v) => minimum(v, flo),
								max: (v) => maximum(v, flo)
							},
							{
								$layout: '',
								name: ''
							}
						]
					}
				},
				transform: (data) => {
					return data
				}
			},
			//实时数据
			real: {
				createOptions: (data) => {
					if (data == null) return null
					let flo = complexMinMaxIndex(data, CATEGORY.FLOW)
					let stg = complexMinMaxIndex(data, CATEGORY.STAGE)
					let day = getNearNDays(data.source, 7)
					const min = Math.min.apply(null, stg)
					const max = Math.max.apply(null, stg)
					return {
						dataZoom: [
							{
								type: 'slider',
								startValue: day[0],
								endValue: day[1]
							},
							{
								type: 'inside',
								startValue: day[0],
								endValue: day[1]
							}
						],
						yAxis: [
							{
								layout: CATEGORY.RAINFALL,
								name: '降雨量（mm）',
								min: 0,
								max: (v) => Math.round(v.max + (v.max - v.min) * 0.1)
							},
							{
								layout: CATEGORY.FLOW,
								name: '流量(m³/s)',
								min: (v) => minimum(v, flo),
								max: (v) => maximum(v, flo)
							},
							{
								layout: CATEGORY.STAGE,
								name: '水位(m)',
								// min: (v) => minimum(v, stg),
								// max: (v) => maximum(v, stg)
								min:(v)=>{
									if (Number.isNaN(v.max) && Number.isNaN(v.min) && data.indices?.length){
										return  minimum({max , min},stg )
									}
									return minimum(v, stg)
								},
								max:(v)=>{
									if (Number.isNaN(v.max) && Number.isNaN(v.min) && data.indices?.length){
										return  maximum({max , min},stg )
									}
									return maximum(v, stg)
								}
							}
						]
					}
				},
				transform: (data) => {
					return data
				}
			}
		},
		//水库
		1: {
			//来水预报
			forec: {
				createOptions: (data) => {
					if (data == null) return null
					let flo = complexMinMaxIndex(data, CATEGORY.FLOW)
					return {
						yAxis: [
							{
								$layout: CATEGORY.RAINFALL,
								name: '降雨量(mm)',
								min: 0,
								max: (v) => Math.round(v.max + (v.max - v.min) * 0.1)
							},
							{
								$layout: '',
								name: ''
							},
							{
								$layout: CATEGORY.FLOW,
								name: '流量(m³/s)',
								min: (v) => minimum(v, flo),
								max: (v) => maximum(v, flo)
							},
							{
								$layout: 0,
								name: ''
							}
						]
					}
				},
				transform: (data) => {
					return data
				}
			},
			//实时数据
			real: {
				createOptions: (data) => {
					if (data == null) return null
					let flo = complexMinMaxIndex(data, CATEGORY.FLOW)
					let stg = complexMinMaxIndex(data, CATEGORY.STAGE)
					let cap = complexMinMaxIndex(data, CATEGORY.CAPACITY)
					let day = getNearNDays(data.source || [], -7)
					return {
						dataZoom: [
							{
								type: 'slider',
								startValue: day[0],
								endValue: day[1]
							},
							{
								type: 'inside',
								startValue: day[0],
								endValue: day[1]
							}
						],
						yAxis: [
							{
								$layout: CATEGORY.RAINFALL,
								name: '降雨量（mm）',
								min: 0,
								max: v => Math.round(v.max + (v.max - v.min) * 0.1),
							},
							{
								$layout: CATEGORY.FLOW,//4
								name: '流量（m³/s）',
								min: (v) => minimum(v, flo),
								max: (v) => maximum(v, flo)
							},
							{
								$layout: CATEGORY.STAGE,//2
								name: '水位（m）',
								min: (v) => minimum(v, stg),
								max: (v) => maximum(v, stg)
							},
							{
								$layout: CATEGORY.CAPACITY,//8
								name: `库容（${data.unit.symbol}）`,
								min: (v) => minimum(v, cap),
								max: (v) => maximum(v, cap)
							}
						]
					}
				},
				transform: (data) => {
					if (data == null) return null
					data.unit = units[2]
					let idx = data.dimensions.findIndex((e) => e.code === CATEGORY.CAPACITY)
					if (idx > -1) {
						let maximum = data.source.reduce((p, v) => (v[idx] > p ? v[idx] : p), 0)
						let unit = units.find((e) => maximum >= e.value)
						if (unit.value > 0) {
							data.source.forEach((e) => numeralFormat((e[idx] /= unit.value)))
							data.dimensions[idx].name = `库容（${unit.symbol}）`
							data.unit = unit
							if (data.indices) {
								let index = data.indices.find((e) => e.code === CATEGORY.CAPACITY)
								if (index) {
									index.indices.forEach((e) => (e.value /= unit.value))
									index.unit = `（${unit.symbol}）`
								}
							}
						}
					}
					return data
				}
			},
			//预报调度
			dispatch: {
				createOptions: (data) => {
					if (data == null) return null
					let flo = complexMinMaxIndex(data, CATEGORY.FLOW)
					let stg = complexMinMaxIndex(data, CATEGORY.STAGE)
					return {
						yAxis: [
							{
								$layout: CATEGORY.FLOW,
								name: '流量(m³/s)',
								min: (v) => minimum(v, flo),
								max: (v) => maximum(v, flo)
							},
							{
								$layout: CATEGORY.STAGE,
								name: '水位(m)',
								min: (v) => minimum(v, stg),
								max: (v) => maximum(v, stg)
							}
						]
					}
				}
			}
		}
	}

	const getExistConfig = (motype: number) => {
		return config[motype] || {}
	}

	return { getExistConfig }
}
