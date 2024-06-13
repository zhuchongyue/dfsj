import MeasureBase from '../MeasureBase'
import {Polyline} from '../../overlay'
import {unByKey} from 'ol/Observable'
import Popup from 'ol-ext/overlay/Popup'
import {MouseEventType} from '../../event'
import GeomUtil from '../../utils/geomUtil'

export default class Angle extends MeasureBase {
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

	/**
	 * 角度换算  3个点形成角度数
	 */
	_onCalc(line) {
		const projection = this.getMap().getView().getProjection()
		return GeomUtil.angle(line, projection)
	}

	_generatePosition(geom, text?) {
		let coordinates = geom.getCoordinates()
		//如果大于2个点  那么长度减1的坐标点就是角的顶点
		let vertex = geom?.getLastCoordinate()
		if (coordinates.length > 2) {
			vertex = coordinates[coordinates.length - 2]
		}
		this._length.show?.(vertex, text)
	}

	_unByKeySingleClick() {
		if (this._singleclick) {
			unByKey(this._singleclick)
			this._singleclick = null
		}
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
			this._generatePosition(geom, output)
			this._singleclick = this._map.on(MouseEventType.SINGLE_CLICK, (ev) => {
				//点位大于2的时候需要 打点每一次的角度结果
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
