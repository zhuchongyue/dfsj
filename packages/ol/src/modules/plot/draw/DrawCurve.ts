import {Polyline} from '../../overlay'
import Draw from './Draw'
import {getCurvePoints} from '../../utils/plot'

export default class DrawCurve extends Draw {
	public t: number

	constructor(style) {
		super(style)
		this.t = 0.3
	}

	_mountedHook() {
		this._delegate = new Polyline(this._positions, {})
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate() {
		let count = this.count
		if (count < 2) {
			return
		}
		if (count == 2) {
			this._delegate.setCoordinates(this.positions)
		} else {
			this._delegate.setCoordinates(getCurvePoints(this.t, this._positions))
		}
	}
}
