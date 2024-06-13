import Overlay from '../Overlay'
import {Feature} from 'ol'
import GeometryHelper from '../../helpers/GeometryHelper'
import StyleHelper from '../../style/StyleHelper'
import {getCenter} from 'ol/extent'

export default class Billboard extends Overlay {
	constructor(position, options) {
		super(options)
		this._position = position
		const geometry = GeometryHelper.getGeomFromGeomData(position, options)
		this._delegate = new Feature({
			geometry: geometry,
			params: options
		})
	}

	get type() {
		return Overlay.getOverlayType('billboard')
	}

	get center() {
		const extent = this.delegate.getGeometry().getExtent()
		const center = getCenter(extent)
		return center ?? []
	}

	/**
	 *
	 * @param style
	 * @param zoom
	 * @returns {Billboard}
	 */
	setStyle(style, zoom = null) {
		const helper = StyleHelper.Billboard(style, this.attr, zoom)
		super.setStyle(helper, zoom)
		return this
	}

	/**
	 * Parse from entity
	 * @param entity
	 * @returns {any}
	 */
	static fromEntity(entity: Feature) {
		let billboard = undefined
		if (entity) {
			let positions = entity.getGeometry()
			let properties = entity.getProperties()
			billboard = new Billboard(positions, {})
			billboard.attr = {
				...properties
			}
			console.log('billboard', billboard)
		}
		return billboard
	}
}
Overlay.registerType('billboard')
