import {Polygon} from '../../overlay'
import Draw from './Draw'
import {buffer as getBuffer, polygon} from '@turf/turf'
import Popup from 'ol-ext/overlay/Popup'
import GeomUtil from '../../utils/geomUtil'

export default class DrawPolygon extends Draw {
	constructor(style) {
		super(style)
	}

	_mountedHook() {
		if (this.config.popup) {
			this._popup = new Popup({
				id: this._id,
				className: 'default specs'
			})
			this._map._delegate?.addOverlay(this._popup)
		}
		if (this.config.buffer) {
			this._buffer = new Polygon([], {})
			this._buffer.attr = {
				id: this._id
			}
			this._buffer.setStyle(this._bufferStyle)
			this._layer.addOverlay(this._buffer)
		}
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { id: this._id }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate() {
		const count = this.count
		if (count < 2) {
			return
		}
		this._delegate.setCoordinates([this.positions])
		if (this.positions.length < 3) return
		if (this.config.buffer) {
			const tfc = [...this.positions, this.positions[0]]
			let polyline = polygon([tfc])
			let polygons = getBuffer(polyline, Number(this.config.buffer) * 1000, { units: 'meters' })
			const coordinates = polygons.geometry.coordinates
			this._buffer.setCoordinates(coordinates)
		}
		if (this.config.popup) {
			const projection = this._map.view.getProjection()
			const geom = this._delegate._delegate.getGeometry()
			const area = GeomUtil.area(geom, projection)
			const tooltipCoord = geom.getInteriorPoint().getCoordinates()
			this._popup.show?.(tooltipCoord, area)
		}
	}
}
