import {Polygon} from '../../overlay'
import Edit from './Edit'

//矩形
export default class EditRectangle extends Edit {
	constructor(style) {
		super(style)
		this.hasControlPoint = true
	}
	getControlPoints(geometry = this._overlay){
		return this._overlay.attr.fixPoints ?? []
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		const style=  this.style;
		this._delegate = new Polygon([], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}

	generate(newPoints = this._positions) {
		let [pnt1 , pnt2] = newPoints
		let xmin = Math.min(pnt1[0], pnt2[0])
		let xmax = Math.max(pnt1[0], pnt2[0])
		let ymin = Math.min(pnt1[1], pnt2[1])
		let ymax = Math.max(pnt1[1], pnt2[1])
		let tl = [xmin, ymax]
		let tr = [xmax, ymax]
		let br = [xmax, ymin]
		let bl = [xmin, ymin]
		this._delegate.setCoordinates([[tl, tr, br, bl]])
		this._delegate.attr.lastFixPoints = [...newPoints]
	}
}
