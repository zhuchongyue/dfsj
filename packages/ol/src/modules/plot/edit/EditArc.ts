/**
 * 弧形编辑
 */
import {Point, Polygon, Polyline} from '../../overlay'
import Edit from './Edit'
import {
	distance,
	getArcPoints,
	getAzimuth,
	getCircleCenterOfThreePoints,
	isClockWise
} from "../../utils/plot";
export default class EditArc extends Edit {
	constructor(overlay) {
		super(overlay);
		this.hasControlPoint = true;
	}
	getControlPoints(geometry = this._overlay){
       return this._overlay.attr.fixPoints ?? []
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		this._delegate = new Polyline([], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(this.style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}

	generate(newPoints = this._positions) {
		let [pnt1,pnt2,pnt3] = newPoints;
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
		this._delegate.setCoordinates(getArcPoints(center, radius, startAngle, endAngle));
		this._delegate.attr.lastFixPoints = [...newPoints]
	}
}
