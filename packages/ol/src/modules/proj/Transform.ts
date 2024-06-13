/**
 * @classdesc 坐标转换
 */
import {fromLonLat, toLonLat, transform, transformExtent} from 'ol/proj'
import proj4 from 'proj4'
import proj4text from './Proj4text'

const PREFIX = `EPSG:`
export default class Transform {
	static proj4textObj = proj4text
	private source: string
	private sourceWkid: string
	private destination: string
	private destinationWkid: string
	private _map: any
	public static PROJ = {
		WGS84: 'EPSG:4326',
		MERCATOR: 'EPSG:3857',
		CHINA2000: 'EPSG:4490'
	}

	/**
	 * @description 坐标转换
	 * @param {Object} param
	 * @param {String} param.source   原坐标 'EPSG:4326'
	 * @param {String} param.destination   目标坐标系 'EPSG:3857'
	 */
	constructor(map, { source = 'EPSG:4326', destination = 'EPSG:3857' }) {
		this._map = map
		this.source = source
		this.sourceWkid = this.source.split(':')[1]
		this.destination = destination
		this.destinationWkid = this.destination.split(':')[1]
	}

	static interconversion(code) {
		if (typeof code == 'number') return PREFIX + code
		if (typeof code == 'string' && code.includes(PREFIX)) return code.trim().replace(PREFIX, '')
	}

	static conversion(code) {
		if (typeof code == 'number') return code
		return Transform.interconversion(code)
	}

	static transform(from, to, coordinate) {
		from = Transform.conversion(from)
		to = Transform.conversion(to)
		let proj4textFromStr = '',
			proj4textToStr = ''
		if (proj4 && from && coordinate) {
			from = to || 3857
			proj4textFromStr = this.proj4textObj[from]['srtext']
			proj4textToStr = this.proj4textObj[to]['proj4text']
			coordinate = proj4(proj4textFromStr, proj4textToStr, coordinate)
		}
		return coordinate
	}

	get proj4text() {
		return Transform.proj4textObj
	}

	static get proj4text() {
		return this.proj4textObj
	}

	/**
	 * 经纬度转平面   4326
	 * @param {Array} coordinate [lon,lat]
	 */
	fromLonLat(coordinate) {
		return fromLonLat(coordinate, this.destination)
	}

	/**
	 * 平面坐标转经纬度   3857
	 * @param {Array} coordinate [x,y]
	 */
	toLonLat(coordinate) {
		return toLonLat(coordinate, this.destination)
	}

	/***
	 * 将其它坐标系转为 经纬度4326
	 * @param coordinate
	 */
	transformToLonLat(coordinate) {
		let proj4textFromStr = '',
			proj4textToStr = ''
		if (coordinate) {
			proj4textFromStr = Transform.proj4textObj[this.destinationWkid]['proj4text']
			proj4textToStr = Transform.proj4textObj['4326']['srtext']
			coordinate = proj4(proj4textFromStr, proj4textToStr, coordinate)
		}
		return coordinate
	}

	/**
	 * @description extent 坐标转换  将其它坐标系转为
	 * @param {Array<Number>} extent
	 */
	transformExtentToLonLat(extent) {
		return this.transformToLonLat([extent[0], extent[1]]).concat(
			this.transformToLonLat([extent[2], extent[3]])
		)
	}

	/**
	 * @description 自定义坐标系转换
	 * @param {*} coordinate
	 */
	transform(coordinate, from = null, to = null) {
		let proj4textFromStr = '',
			proj4textToStr = ''
		let sourceWkid: any = this.sourceWkid
		let destinationWkid: any = this.destinationWkid
		if (from) {
			sourceWkid = Transform.conversion(from)
		}
		if (to) {
			destinationWkid = Transform.conversion(to)
		}
		if (coordinate && sourceWkid != destinationWkid) {
			proj4textFromStr = Transform.proj4textObj[sourceWkid]['srtext']
			proj4textToStr = Transform.proj4textObj[destinationWkid]['proj4text']
			coordinate = proj4(proj4textFromStr, proj4textToStr, coordinate)
		}
		return coordinate
	}

	/**
	 * @description extent 坐标转换
	 * @param {Array<Number>} extent
	 */
	transformExtent(extent, from = null, to = null) {
		return this.transform([extent[0], extent[1]], from, to).concat(
			this.transform([extent[2], extent[3]], from, to)
		)
	}

	/**
	 *
	 * @param {Array} coordinate [lon,lat] or [x,y]
	 * @param {String} source eg: 'EPSG:4326'
	 * @param {String} destination eg: 'EPSG:3857'
	 */
	transformByProj(coordinate, source, destination) {
		if (Array.isArray(coordinate)) {
			return coordinate.length > 2
				? transformExtent(coordinate, source, destination)
				: transform(coordinate, source, destination)
		}
		return coordinate
	}

	/**
	 *
	 * @private
	 */
	install() {
		Object.defineProperty(this._map, 'transform', {
			value: this,
			writable: false
		})
	}
}
