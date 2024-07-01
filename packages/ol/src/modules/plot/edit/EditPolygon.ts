/**
 * 自由面的编辑
 */
import {Polygon} from '../../overlay'
import Edit from './Edit'
import OverlayType from "../../overlay/OverlayType";
export default class EditPolygon extends Edit {
	constructor(overlay) {
		super(overlay)
	}

	_mountedHook() {
		const positions = this.getControlPoints();
		const style=  this.style;
		this._delegate = new Polygon([positions], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(style, {standard:true});
		this._layer.addOverlay(this._delegate)
	}

	generate() {
	}
}
