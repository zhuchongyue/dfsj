import {Polygon} from '../../overlay'
import Draw from './Draw'

export default class DrawFreehandPolygon extends Draw {
	constructor(style) {
		super(style)
		this.freehand = true
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = {}
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
		console.log('this._delegate', this._delegate)
	}

	// _onAnchorMoving({position}) {
	//
	//   super._onAnchorMoving({position})
	//   // return
	//   this._delegate.setCoordinates([this._positions])
	// }
	/**
	 *
	 * @param position
	 * @private
	 */
	// _onDrawAnchor({position}) {
	//   this._positions.push(position)
	//   if (this._positions.length) {
	//     this._delegate.setCoordinates([this._positions])
	//     console.log('this._positions',this._delegate)
	//     this.drawTool.fire(new PlotEvent(PlotEventType.CREATE_ANCHOR, position))
	//   }
	// }
	generate() {
		let count = this.count
		if (count < 2) {
			return
		}
		// this.setCoordinates([this.points]);
		this._delegate.setCoordinates([this.positions])
	}
}
