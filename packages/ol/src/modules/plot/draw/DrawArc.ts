import {Polyline} from '../../overlay'
import Draw from './Draw'
import {distance, getArcPoints, getAzimuth, getCircleCenterOfThreePoints, isClockWise} from '../../utils/plot'

export default class DrawArc extends Draw {
	constructor(style) {
		super(style)
	}

	_mountedHook() {
		this._delegate = new Polyline(this._positions, {})
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	_onDrawAnchor({ position }) {
		this._positions.push(position)
		if (this._positions.length) {
			this.generate()
		}
	}

	generate() {
		let count = this.count
		if (count < 2) {
			return
		}
		if (count == 2) {
			this._delegate.setCoordinates(this._positions)
		} else {
			let pnt1 = this._positions[0]
			let pnt2 = this._positions[1]
			let pnt3 = this._positions[2]
			let center = getCircleCenterOfThreePoints(pnt1, pnt2, pnt3)
			let radius = distance(pnt1, center)

			let angle1 = getAzimuth(pnt1, center)
			let angle2 = getAzimuth(pnt2, center)
			let [startAngle, endAngle] = [null, null]
			if (isClockWise(pnt1, pnt2, pnt3)) {
				startAngle = angle2
				endAngle = angle1
			} else {
				startAngle = angle1
				endAngle = angle2
			}
			this._delegate.setCoordinates(getArcPoints(center, radius, startAngle, endAngle))
		}
	}
}
