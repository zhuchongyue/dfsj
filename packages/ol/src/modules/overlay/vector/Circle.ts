import Overlay from '../Overlay'
import {Feature} from 'ol'
import {Circle as olCircle} from 'ol/geom'
import Style from '../../style/Style'
import {CustomProjection} from '../../proj'

export default class Circle extends Overlay {
	private _radius: any

	constructor(position, options) {
		super(options)
		this._position = position
		this._delegate = new Feature({
			geometry: new olCircle(position, this.radius ?? 1),
			params: options
		})
	}

	get center() {
		return this._position
	}

	get radius() {
		const metersPerUnit = CustomProjection.projection.getMetersPerUnit()
		const radius = this.options?.radius
		let circleRadius = radius / metersPerUnit
		return circleRadius
	}

	get type() {
		return Overlay.getOverlayType('circle')
	}

	/**
	 *
	 * @param style
	 * @returns {Billboard}
	 */
	setStyle(style) {
		if (!style || Object.keys(style).length === 0) {
			return this
		}
		const st = Style.create(style, this.attr)
		this._delegate.setStyle(st)
	}
}
Overlay.registerType('circle')
