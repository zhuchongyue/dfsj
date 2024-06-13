import MeasureBase from '../MeasureBase'
import {Polyline} from '../../overlay'
import {unByKey} from 'ol/Observable'
import Popup from 'ol-ext/overlay/Popup'
import {MouseEventType} from '../../event'
import GeomUtil from '../../utils/geomUtil'

export default class Distance extends MeasureBase {
	private _singleclick: any

	constructor({ type, source, style }) {
		super({
			type,
			source,
			style
		})
	}

	_startHook(measure, options) {
		this._length = new Popup({ className: 'default specs' })
		super._startHook(measure, options)
		this._map._delegate?.addOverlay(this._length)
	}

	_unByKeySingleClick() {
		if (this._singleclick) {
			unByKey(this._singleclick)
			this._singleclick = null
		}
	}

	_onCalc(feature) {
		const projection = this.getMap().getView().getProjection()
		return GeomUtil.distance(feature, projection)
	}

	_onDrawStart(evt) {
		super._onDrawStart(evt)
		this.drawingFeature = evt.feature
		let tooltipCoord = evt.coordinate
		this._unByKeySingleClick()
		this.listener = this.drawingFeature.getGeometry().on('change', (evt) => {
			this._unByKeySingleClick()
			let geom = evt.target
			let output = this._onCalc(geom)
			tooltipCoord = geom?.getLastCoordinate()
			this._length.show?.(tooltipCoord, output)
			this._singleclick = this._map.on(MouseEventType.SINGLE_CLICK, (ev) => {
				if (this._pointCount > 2) {
					let tip = new Popup({ className: 'default specs' })
					this._map._delegate?.addOverlay(tip)
					let coordinates = geom.getCoordinates()
					let vertex = coordinates[coordinates.length - 2]
					tip.show?.(vertex, output)
					this._tips.push(tip)
				}
				this._pointCount++
			})
		})
	}

	_onDrawEnd(evt) {
		super._onDrawEnd(evt)
		let coords = evt.feature.getGeometry().getCoordinates()
		let polyline = new Polyline(coords, {})
		polyline.setStyle(this._style)
		this._layer.addOverlay(polyline)
		unByKey(this.listener)
		this.listener = null
		this.setActive(false)
		this._unByKeySingleClick()
		this._options?.onStop?.(polyline)
	}
}
