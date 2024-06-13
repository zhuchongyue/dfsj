import Overlay from '../Overlay'
import GeometryHelper from '../../helpers/GeometryHelper'
import {Feature} from 'ol'
import {getArea} from 'ol/sphere'
import {getCenter} from 'ol/extent'
import {GeometryFormatType} from '../GeometryType'
import StyleHelper from '../../style/StyleHelper'

export default class Polygon extends Overlay {
	constructor(position, options) {
		super(options)
		this._position = position
		let geometry = GeometryHelper.getGeomFromGeomData(position, {
			geometryType: GeometryFormatType.Polygon,
			...options
		})
		this._delegate = new Feature({
			geometry: geometry,
			params: options
		})
	}

	get center() {
		const extent = this.delegate.getGeometry().getExtent()
		// 将多面对象转换为多边形对象
		// const polygon = fromExtent(geom.getExtent());
		// 获取多边形面的中心位置
		const center = getCenter(extent)
		return center ?? []
	}

	get area() {
		const projection = this.projection
		const geom = this.delegate.getGeometry()
		let area = getArea(geom, { projection })
		//平方公里
		let output = Math.round((area / 1000000) * 100) / 100
		return output
	}

	/**
	 *
	 * @param style
	 * @returns {Billboard}
	 */
	setStyle(style) {
		const helper = StyleHelper.Polygon(style, this.attr)
		super.setStyle(helper)
		return this
	}

	/**
	 * Parse from entity
	 * @param entity
	 * @returns {any}
	 */
	static fromEntity(entity: Feature) {
		let polygon = undefined
		if (entity) {
			let positions = entity.getGeometry()
			let properties = entity.getProperties()
			polygon = new Polygon(positions, {})
			polygon.attr = {
				...properties
			}
		}
		return polygon
	}
}
Overlay.registerType('polygon')
