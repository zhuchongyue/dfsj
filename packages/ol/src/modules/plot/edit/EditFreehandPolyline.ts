import Edit from './Edit'
import {Polyline} from '../../overlay'
//自由线
export default class EditFreehandPolyline extends Edit {
	constructor(style) {
		super(style)
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		this._delegate = new Polyline(this._positions, {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(this.style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}
}
