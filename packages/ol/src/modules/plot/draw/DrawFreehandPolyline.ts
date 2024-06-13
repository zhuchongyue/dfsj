import Draw from './Draw'
import {Polyline} from '../../overlay'
//自由线
export default class DrawFreehandPolyline extends Draw {
	constructor(style) {
		super(style)
		this.freehand = true
	}

	_mountedHook() {
		this._delegate = new Polyline(this._positions, {})
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	// _onAnchorMoving({position}) {
	//     super._onAnchorMoving({position})
	//     this.generate()
	// }

	// _onDrawAnchor({position}) {
	//     this._positions.push(position)
	//     if (this._positions.length) {
	//         this.generate()
	//     }
	// }

	generate() {
		let count = this.count
		if (count < 2) {
			return
		}
		this._delegate.setCoordinates(this.positions)
	}
}
