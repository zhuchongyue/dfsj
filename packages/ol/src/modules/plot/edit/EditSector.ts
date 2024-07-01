import {Polygon} from '../../overlay'
import Edit from './Edit'
import {distance, getArcPoints, getAzimuth} from "../../utils/plot";
//扇形
export default class EditSector extends Edit {
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
		const pnts = JSON.parse(JSON.stringify(newPoints))
		let [center,pnt2,pnt3] = pnts
		let radius = distance(pnt2, center)
		let startAngle = getAzimuth(pnt2, center)
		let endAngle = getAzimuth(pnt3, center)
		let pList = getArcPoints(center, radius, startAngle, endAngle)
		pList.push(center, pList[0])
		this._delegate.setCoordinates([pList])
		this._delegate.attr.lastFixPoints = [...newPoints]
	}


}
