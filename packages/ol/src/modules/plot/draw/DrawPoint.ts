import {Point} from '../../overlay'
import Draw from './Draw'
import OverlayType from "../../overlay/OverlayType";

export default class DrawPoint extends Draw {
	constructor(style) {
		super(style);
		this.fixPointCount = 1;
	}

	_mountedHook() {
		this._delegate = new Point(this._positions, {})
		this._delegate.attr = { id: this._id ,type:OverlayType.POINT,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		const count = position.length
		if (count != 1) {
			return
		}
		this._delegate.setCoordinates(position?.[0])
	}
}
