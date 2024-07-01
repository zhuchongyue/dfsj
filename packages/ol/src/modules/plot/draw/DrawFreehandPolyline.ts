import Draw from './Draw'
import {Polyline} from '../../overlay'
import OverlayType from "../../overlay/OverlayType";
//自由线
export default class DrawFreehandPolyline extends Draw {
	constructor(style) {
		super(style)
		this.freehand = true
	}
	_mountedHook() {
		this._delegate = new Polyline(this._positions, {})
		this._delegate.attr = { id: this._id ,type:OverlayType.FREEHAND_POLYLINE,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}
	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		this._delegate.setCoordinates(position)
	}
}
