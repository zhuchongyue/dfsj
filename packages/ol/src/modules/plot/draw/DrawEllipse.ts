import {Polygon} from '../../overlay'
import Draw from './Draw'
import {PlotEventType} from '../../event/EventType'
import PlotEvent from '../../event/type/PlotEvent'
import {Constants, mid} from '../../utils/plot'
import OverlayType from "../../overlay/OverlayType";

export default class DrawEllipse extends Draw {
	constructor(style) {
		super(style)
		this.fixPointCount = 2
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { id: this._id ,type:OverlayType.ELLIPSE,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		// let pnt1 = this.positions[0]
		// let pnt2 = this.positions[1]
		const [pnt1, pnt2] = position;
		let center = mid(pnt1, pnt2)
		let majorRadius = Math.abs((pnt1[0] - pnt2[0]) / 2)
		let minorRadius = Math.abs((pnt1[1] - pnt2[1]) / 2)
		// this.setCoordinates([this.generatePoints(center, majorRadius, minorRadius)]);
		this._delegate.setCoordinates([this.generatePoints(center, majorRadius, minorRadius)])
	}

	generatePoints(center, majorRadius, minorRadius) {
		let x,
			y,
			angle,
			points = []
		for (let i = 0; i <= Constants.FITTING_COUNT; i++) {
			angle = (Math.PI * 2 * i) / Constants.FITTING_COUNT
			x = center[0] + majorRadius * Math.cos(angle)
			y = center[1] + minorRadius * Math.sin(angle)
			points.push([x, y])
		}
		return points
	}
}
