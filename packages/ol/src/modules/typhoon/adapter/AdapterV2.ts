import {TTyphoonResultV2} from './result'
import {TyphoonData} from '../types'
import dayjs from 'dayjs'

export default class AdapterV2 {
	/**
	 * 转换成为接口定义的标准格式
	 */
	static convert(originData: TTyphoonResultV2) {
		/** 接口需要接收的参数*/
		const temp: TyphoonData = {
			code: originData.ident,
			center: [null, null],
			start: originData.begintime,
			end: originData.endtime,
			alive: originData.iscurrent === 0 ? false : true,
			chinese: originData.cname,
			english: originData.ename,
			locations: [],
			land: []
		}
		let pathCoordinatesArr = []
		originData.pointses.map((item, i) => {
			// item.index = i
			let radius7Info = item.radius7quad ? JSON.parse(item.radius7quad) : ''
			let radius10Info = item.radius10quad ? JSON.parse(item.radius10quad) : ''
			let radius12Info = item.radius12quad ? JSON.parse(item.radius12quad) : ''
			let obj = {
				coordinates: [item.lng, item.lat],
				time: item.time,
				power: item.power,
				pressure: item.pressure,
				trend: item.movedir,
				wind: item.speed,
				move: item.movespeed,
				radius7: radius7Info,
				radius10: radius10Info,
				radius12: radius12Info,

				// "radius7": radius7Info ? [radius7Info.ne, radius7Info.se, radius7Info.sw, radius7Info.nw] : [],
				// "radius10":radius10Info ? [radius10Info.ne, radius10Info.se, radius10Info.sw, radius10Info.nw] : [],
				// "radius12": radius12Info ? [radius12Info.ne, radius12Info.se, radius12Info.sw, radius12Info.nw] : [],
				strong: item.strong,
				forecast: [],
				tfbh: item.tfbh,
				cname: originData.cname,
				ename: originData.ename,
				index: i
			}
			pathCoordinatesArr.push([item.lng, item.lat])
			item?.forecast?.map((item2) => {
				let objTwo = {
					organization: item2.sets,
					locations: []
				}
				item2?.points?.map((item3) => {
					let objThree = {
						coordinates: [item3.lng, item3.lat],
						time: item3.time,
						power: item3.power,
						pressure: item3.pressure,
						wind: item3.wind,
						strong: item3.strong,
						radius7: null,
						radius10: null,
						radius12: null
					}
					objTwo.locations.push(objThree)
				})
				obj.forecast.push(objTwo)
			})
			// @ts-ignore
			temp.locations.push(obj)
		})
		temp.land = originData.land
			? JSON.parse(originData.land).map((e) => ({
					coordinates: [e.lng, e.lat],
					time: dayjs(e.landTime).format('YYYY[/]MM[/]DD HH:mm:ss'),
					address: e.position || '--',
					strong: e.strong || '--',
					message: ''
			  }))
			: []
		console.log('_____AdapterV2____', temp)
		return temp
	}
}
