import Overlay from '../Overlay'
import GeometryHelper from '../../helpers/GeometryHelper'
import {Feature} from 'ol'
import StyleHelper from '../../style/StyleHelper'

export default class Point extends Overlay {
	constructor(position, options?) {
		super(options)
		this._position = position
		const geometry = GeometryHelper.getGeomFromGeomData(position, options)
		this._delegate = new Feature({
			geometry: geometry,
			params: options
		})
	}

	/***
	 * 中心坐标
	 */
	get center() {
		return this._position
	}

	get position() {
		return this._position
	}

	/**
	 *
	 * @param style
	 * @returns {Point}
	 */
	setStyle(style) {
		const helper = StyleHelper.Point(style, this.attr)
		super.setStyle(helper)
		return this
	}

	/**
	 * Parse from entity
	 * @param entity
	 * @returns {any}
	 */
	static fromEntity(entity: Feature) {
		let point = undefined
		if (entity) {
			let positions = entity.getGeometry()
			let properties = entity.getProperties()
			point = new Point(positions, {})
			point.attr = {
				...properties
			}
		}
		return point
	}
}
Overlay.registerType('point')
