/**
 * 细箭头的编辑
 */
import {Polygon} from '../../overlay'
import Edit from './Edit'
import {Constants, getBaseLength, getThirdPoint} from "../../utils/plot";

export default class EditFineArrow extends Edit {
	public tailWidthFactor: number
	public neckWidthFactor: number
	public headWidthFactor: number
	public headAngle: number
	public neckAngle: number
	constructor(overlay) {
		super(overlay);
		this.hasControlPoint = true;
		this.tailWidthFactor = 0.15
		this.neckWidthFactor = 0.2
		this.headWidthFactor = 0.25
		this.headAngle = Math.PI / 8.5
		this.neckAngle = Math.PI / 13
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
		let [pnt1,pnt2] = newPoints;
		let len = getBaseLength(newPoints)
		let tailWidth = len * this.tailWidthFactor
		let neckWidth = len * this.neckWidthFactor
		let headWidth = len * this.headWidthFactor
		let tailLeft = getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true)
		let tailRight = getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false)
		let headLeft = getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false)
		let headRight = getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true)
		let neckLeft = getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false)
		let neckRight = getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true)
		let pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight]
		this._delegate.setCoordinates([pList]);
		this._delegate.attr.lastFixPoints = [...newPoints]
	}
}
