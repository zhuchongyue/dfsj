/**
 * 折线
 */
import {Polygon, Polyline} from '../../overlay'
import Edit from './Edit'
import OverlayType from "../../overlay/OverlayType";
export default class EditPolyline extends Edit {
	constructor(overlay) {
		super(overlay)
	}

	_mountedHook() {
		const positions = this.getControlPoints();
		const style=  this.style;
		this._delegate = new Polyline(positions, {})
		console.log('样式',this._overlay)
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(style, {standard:true});
		this._layer.addOverlay(this._delegate)
	}

	generate() {
	}
}
