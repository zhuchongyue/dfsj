import Edit from './Edit'
import {Polygon, Polyline} from '../../overlay'
//自由面
export default class EditFreehandPolygon extends Edit {
	constructor(style) {
		super(style)
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(this.style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}
}
