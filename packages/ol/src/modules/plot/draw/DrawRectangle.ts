import {Polygon} from '../../overlay'
import Draw from './Draw'

//矩形
export default class DrawRectangle extends Draw {
	constructor(style) {
		super(style)
		this.fixPointCount = 2
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = {}
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate() {
		let count = this.count
		if (count < 2) {
			return
		} else {
			let pnt1 = this.positions[0]
			let pnt2 = this.positions[1]
			let xmin = Math.min(pnt1[0], pnt2[0])
			let xmax = Math.max(pnt1[0], pnt2[0])
			let ymin = Math.min(pnt1[1], pnt2[1])
			let ymax = Math.max(pnt1[1], pnt2[1])
			let tl = [xmin, ymax]
			let tr = [xmax, ymax]
			let br = [xmax, ymin]
			let bl = [xmin, ymin]
			this._delegate.setCoordinates([[tl, tr, br, bl]])
		}
	}
}
