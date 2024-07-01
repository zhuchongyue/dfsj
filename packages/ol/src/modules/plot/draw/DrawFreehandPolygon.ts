import {Polygon} from '../../overlay'
import Draw from './Draw'
import OverlayType from "../../overlay/OverlayType";

export default class DrawFreehandPolygon extends Draw {
	constructor(style) {
		super(style)
		this.freehand = true
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { id: this._id ,type:OverlayType.FREEHAND_POLYGON,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}
	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		this._delegate.setCoordinates([position])
	}
}
