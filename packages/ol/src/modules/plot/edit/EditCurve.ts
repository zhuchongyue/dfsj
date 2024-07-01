import {Polyline} from '../../overlay'
import Edit from './Edit'
import {getCurvePoints} from "../../utils/plot";

//曲线
export default class EditCurve extends Edit {
	public t: number
	constructor(style) {
		super(style)
		this.t = 0.3
		this.hasControlPoint = true;
	}
	getControlPoints(geometry = this._overlay){
		return this._overlay.attr.fixPoints ?? []
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		const style=  this.style;
		this._delegate = new Polyline(this._positions, {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}

	generate(newPoints = this._positions) {
		this._delegate.setCoordinates(getCurvePoints(this.t, newPoints))
		this._delegate.attr.lastFixPoints = [...newPoints]
	}
}
