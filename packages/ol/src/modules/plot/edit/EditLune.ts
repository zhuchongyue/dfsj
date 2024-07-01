import {Polygon} from '../../overlay'
import Edit from './Edit'
import {distance, getArcPoints, getAzimuth, getCircleCenterOfThreePoints, isClockWise} from "../../utils/plot";

//弓形
export default class EditLune extends Edit {
	constructor(style) {
		super(style)
		this.hasControlPoint = true
	}
	getControlPoints(geometry = this._overlay){
		return this._overlay.attr.fixPoints ?? []
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		const style=  this.style;
		this._delegate = new Polygon([], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}

	generate(newPoints = this._positions) {
		let pnts = JSON.parse(JSON.stringify(newPoints))
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
		this._delegate.attr.lastFixPoints = [...newPoints]
	}
}
