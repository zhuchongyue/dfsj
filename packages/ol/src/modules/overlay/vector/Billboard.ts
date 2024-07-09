import Overlay from '../Overlay'
import {Feature} from 'ol'
import GeometryHelper from '../../helpers/GeometryHelper'
import StyleHelper from '../../style/StyleHelper'
import {getCenter} from 'ol/extent'
import {GeometryFormatType} from "../GeometryType";

export default class Billboard extends Overlay {
	constructor(position, options) {
		super(options)
		this._position = position
		const geometry = GeometryHelper.getGeomFromGeomData(position, {
			geometryType: GeometryFormatType.Point,
			...options})
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
	setStyle(style,options = {
		standard: false,
		zoom: null,
		highlight: false
	}) {
		const helper =!options?.standard ? StyleHelper.Billboard(style, this.attr, options.zoom):style;
		super.setStyle(helper, options)
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
