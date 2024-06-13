import {Point, Polygon, Polyline} from '../../overlay'
import Draw from './Draw'
import {Constants, distance, mid} from '../../utils/plot'
import {GeometryFormatType} from '../../overlay/GeometryType'
import GeomUtil from '../../utils/geomUtil'
import Popup from 'ol-ext/overlay/Popup'
import {buffer as getBuffer, polygon} from '@turf/turf'

export default class DrawCircle extends Draw {
	protected _center
	protected _radius

	constructor(style) {
		super(style)
		this.fixPointCount = 2
	}

	get getOverlays() {
		return [this._center, this._radius]
	}

	_stoppedHook() {
		super._stoppedHook()
		this._center = null
		this._radius = null
	}

	_onDrawStop() {
		this._center && this._layer.removeOverlay(this._center)
		this._radius && this._layer.removeOverlay(this._radius)
		super._onDrawStop()
	}

	/**
	 * 1、需要展示圆心
	 * 2、展示半径长度
	 * 3、展示半径线条
	 * */
	_mountedHook() {
		if (this.config.popup) {
			this._popup = new Popup({
				id: this._id,
				positioning: 'bottom-center',
				className: 'default specs'
			})
			this._map._delegate?.addOverlay(this._popup)
			this._center = new Point([], {
				geometryType: GeometryFormatType.Point
			})
			this._center.attr = { id: this._id }
			this._center.setStyle(this._style)
			this._radius = new Polyline([])
			this._radius.attr = { id: this._id }
			this._radius.setStyle(this._style)
			this._layer.addOverlay(this._center)
			this._layer.addOverlay(this._radius)
		}

		if (this.config.buffer) {
			this._buffer = new Polygon([], {})
			this._buffer.attr = { id: this._id }
			this._buffer.setStyle(this._bufferStyle)
			this._layer.addOverlay(this._buffer)
		}

		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { id: this._id }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
		//
	}

	generate() {
		const count = this.count
		let center = count == 1 ? this.positions : this.positions[0]
		//圆点
		this._center && this._center.setCoordinates(center)
		if (count < 2) {
			return
		}
		let radius = GeomUtil.turfDistance(center, this.positions[1])
		let diff = distance(center, this.positions[1])
		const calcPnts = this.generatePoints(center, diff)
		this._delegate.setCoordinates([calcPnts])

		let last = [center[0] + diff * Math.cos(Math.PI * 2), center[1] + diff * Math.sin(Math.PI)]
		let coordinates = [center, last]

		this._radius && this._radius.setCoordinates(coordinates)
		//中线点
		let midcoor = mid(center, last)
		const output = radius?.toFixed(2) + '(km)'
		this._popup && this._popup.show?.(midcoor, output)

		if (this.config.buffer) {
			//缓冲面
			let polyline = polygon([calcPnts])
			let polygons = getBuffer(polyline, Number(this.config.buffer) * 1000, { units: 'meters' })
			const bufferCoordinates = polygons.geometry.coordinates

			this._buffer.setCoordinates(bufferCoordinates)
		}
	}

	generatePoints(center, radius) {
		let x,
			y,
			angle,
			points = []
		for (let i = 0; i <= Constants.FITTING_COUNT; i++) {
			angle = (Math.PI * 2 * i) / Constants.FITTING_COUNT
			x = center[0] + radius * Math.cos(angle)
			y = center[1] + radius * Math.sin(angle)
			points.push([x, y])
		}
		return points
	}
}
