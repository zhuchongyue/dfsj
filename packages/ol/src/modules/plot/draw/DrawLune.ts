import {Polygon} from '../../overlay'
import Draw from './Draw'
import {
    Constants,
    distance,
    getArcPoints,
    getAzimuth,
    getCircleCenterOfThreePoints,
    getThirdPoint,
    isClockWise,
    mid
} from '../../utils/plot'
import OverlayType from "../../overlay/OverlayType";

//弓形
export default class DrawLune extends Draw {
	constructor(style) {
		super(style)
		this.fixPointCount = 3
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { id: this._id ,type:OverlayType.LUNE,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}
	generate(position = this.positions) {
		if (position.length < 2) {
			return
		}
		let pnts = position
		if (position.length == 2) {
			let m = mid(pnts[0], pnts[1])
			let d = distance(pnts[0], m)
			let pnt = getThirdPoint(pnts[0], m, Constants.HALF_PI, d, undefined)
			pnts.push(pnt)
		}
		let pnt1 = pnts[0]
		let pnt2 = pnts[1]
		let pnt3 = pnts[2]
		let center = getCircleCenterOfThreePoints(pnt1, pnt2, pnt3)
		let radius = distance(pnt1, center)

		let angle1 = getAzimuth(pnt1, center)
		let angle2 = getAzimuth(pnt2, center)
		let [startAngle, endAngle] = [null, null]
		if (isClockWise(pnt1, pnt2, pnt3)) {
			// let startAngle = angle2;
			// let endAngle = angle1;
			startAngle = angle2
			endAngle = angle1
		} else {
			startAngle = angle1
			endAngle = angle2
		}
		pnts = getArcPoints(center, radius, startAngle, endAngle)
		pnts.push(pnts[0])
		this._delegate.setCoordinates([pnts])
	}
}
