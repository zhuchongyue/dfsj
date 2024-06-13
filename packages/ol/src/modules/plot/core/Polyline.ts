import {LineString} from 'ol/geom'
import {Mixin} from 'ts-mixer'
import Graphics from './Graphics'
import OverlayType from '../../overlay/OverlayType'

export default class Polyline extends Mixin(Graphics, LineString) {
	constructor(points) {
		super(points)
		// @ts-ignore
		this.type = OverlayType.POLYLINE
		this.setPoints(points)
	}

	generate() {
		let count = this.getPointCount()
		if (count < 2) {
			return
		}
		this.setCoordinates(this.points)
	}
}
