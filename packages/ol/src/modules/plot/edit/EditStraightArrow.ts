import Edit from './Edit'
import {distance, getThirdPoint} from '../../utils/plot'
import {Polyline} from '../../overlay'
//直箭头
export default class EditStraightArrow extends Edit {
	private maxArrowLength: number
	private arrowLengthScale: number

	constructor(style) {
		super(style)
		this.hasControlPoint = true
		this.maxArrowLength = 3000000
		this.arrowLengthScale = 5
	}

	_mountedHook() {
		this._positions = this.getControlPoints();
		this._delegate = new Polyline(this._positions, {});
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(this.style,{standard:true})
		this._layer.addOverlay(this._delegate)
		this.generate()
	}
	getControlPoints(geometry = this._overlay){
		return this._overlay.attr.fixPoints ?? []
	}

	generate(newPoints = this._positions) {
		let [pnt1,pnt2] =  newPoints
		let dis = distance(pnt1, pnt2)
		let len = dis / this.arrowLengthScale
		len = len > this.maxArrowLength ? this.maxArrowLength : len
		let leftPnt = getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false)
		let rightPnt = getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true)
		this._delegate.setCoordinates([pnt1, pnt2, leftPnt, pnt2, rightPnt]);
		this._delegate.attr.lastFixPoints = [...newPoints]
	}
}
