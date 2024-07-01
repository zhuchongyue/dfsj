import {Polygon} from '../../overlay'
import Edit from './Edit'
import {Constants, mid} from "../../utils/plot";

//椭圆
export default class EditEllipse extends Edit {
	constructor(style) {
		super(style)
		this.hasControlPoint = true
	}
	getControlPoints(geometry = this._overlay){
		return this._overlay.attr.fixPoints ?? []
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		console.log('_positions',this._positions)
		const style=  this.style;
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}

	generate(newPoints = this._positions) {
		let [pnt1,pnt2] = newPoints
		let center = mid(pnt1, pnt2)
		let majorRadius = Math.abs((pnt1[0] - pnt2[0]) / 2)
		let minorRadius = Math.abs((pnt1[1] - pnt2[1]) / 2)
		this._delegate.setCoordinates([this.generatePoints(center, majorRadius, minorRadius)])
		this._delegate.attr.lastFixPoints = [...newPoints]
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
