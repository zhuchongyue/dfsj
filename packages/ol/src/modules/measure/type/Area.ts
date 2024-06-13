import MeasureBase from '../MeasureBase'
import {unByKey} from 'ol/Observable'
import {Polygon} from '../../overlay'
import Popup from 'ol-ext/overlay/Popup'
import GeomUtil from '../../utils/geomUtil'

export default class Area extends MeasureBase {
	constructor({ type, source, style }) {
		super({
			type,
			source,
			style
		})
	}

	_startHook(measure, options) {
		this._area = new Popup({ className: 'default specs' })
		this._length = new Popup({ className: 'default specs' })
		super._startHook(measure, options)
		this._map._delegate?.addOverlay(this._area)
		this._map._delegate?.addOverlay(this._length)
	}

	_onCalc(feature) {
		const projection = this.getMap().getView().getProjection()
		return GeomUtil.area(feature, projection)
	}

	_onCalcLength(feature) {
		const projection = this.getMap().getView().getProjection()
		return GeomUtil.distance(feature, projection)
	}

	_onDrawStart(evt) {
		super._onDrawStart(evt)
		this.drawingFeature = evt.feature
		let tooltipCoord = evt.coordinate
		this.listener = this.drawingFeature.getGeometry().on('change', (evt) => {
			let geom = evt.target
			let output = this._onCalc(geom)
			tooltipCoord = geom.getInteriorPoint().getCoordinates()
			this._area.show?.(tooltipCoord, output)
			//展示绘制的长度
			let coordinates = geom?.getCoordinates()[0][geom.getCoordinates()[0].length - 2]
			let length = this._onCalcLength(geom)
			this._length.show?.(coordinates, length)
		})
	}

	_onDrawEnd(evt) {
		super._onDrawEnd(evt)
		let coords = evt.feature.getGeometry().getCoordinates()
		let polygon = new Polygon(coords, {})
		polygon.setStyle(this._style)
		this._layer.addOverlay(polygon)
		unByKey(this.listener)
		this.listener = null
		this.setActive(false)
		this._options?.onStop?.(polygon)
	}
}
