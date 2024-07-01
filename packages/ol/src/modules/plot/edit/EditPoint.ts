/**
 * 点的编辑
 */
import {Point, Polygon} from '../../overlay'
import Edit from './Edit'
export default class EditPoint extends Edit {
	constructor(overlay) {
		super(overlay)
	}
	_mountedHook() {
		const positions = this.getControlPoints();
		console.log('positions',positions)
		const style=  this.style;
		this._delegate = new Point(positions?.[0], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(style, {standard:true});
		this._layer.addOverlay(this._delegate)
	}

	generate() {
	}
}
