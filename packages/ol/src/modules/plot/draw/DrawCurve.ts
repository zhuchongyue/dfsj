import {Polyline} from '../../overlay'
import Draw from './Draw'
import {getCurvePoints} from '../../utils/plot'
import OverlayType from "../../overlay/OverlayType";
//曲线
export default class DrawCurve extends Draw {
	public t: number

	constructor(style) {
		super(style)
		this.t = 0.3
	}

	_mountedHook() {
		this._delegate = new Polyline(this._positions, {})	;
		this._delegate.attr = { id: this._id ,type:OverlayType.CURVE,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		if (count == 2) {
			this._delegate.setCoordinates(position)
		} else {
			this._delegate.setCoordinates(getCurvePoints(this.t, position))
		}
	}
}
