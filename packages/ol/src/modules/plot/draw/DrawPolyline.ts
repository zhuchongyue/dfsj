import Draw from './Draw'
import {Polygon, Polyline} from '../../overlay'
import {buffer as getBuffer, lineString} from '@turf/turf'
import Popup from 'ol-ext/overlay/Popup'
import GeomUtil from '../../utils/geomUtil'
import OverlayType from "../../overlay/OverlayType";

export default class DrawPolyline extends Draw {
	constructor(config) {
		super(config)
	}

	_mountedHook() {
		if (this.config.popup) {
			this._popup = new Popup({
				id: this._id,
				className: 'default specs'
			})
			this._map._delegate?.addOverlay(this._popup)
		}
		//缓冲
		if (this.config.buffer) {
			this._buffer = new Polygon([], { zIndex: 3 })
			this._buffer.attr = {
				id: this._id
			}
			this._buffer.setStyle(this._bufferStyle)
			this._layer.addOverlay(this._buffer)
		}
		this._delegate = new Polyline(this._positions, { zIndex: 2 })
		this._delegate.attr = { id: this._id ,type:OverlayType.POLYLINE,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		this._delegate.setCoordinates(position)
		if (this.config.buffer) {
			let polyline = lineString(position)
			let polygons = getBuffer(polyline, Number(this.config.buffer) * 1000, { units: 'meters' })
			const coordinates = polygons.geometry.coordinates
			this._buffer.setCoordinates(coordinates)
		}
		//提示
		if (this.config.popup) {
			const projection = this._map.view.getProjection()
			const geom = this._delegate._delegate.getGeometry()
			const area = GeomUtil.distance(geom, projection)
			const tooltipCoord = geom.getLastCoordinate()
			this._popup.show?.(tooltipCoord, area)
		}
	}
}
