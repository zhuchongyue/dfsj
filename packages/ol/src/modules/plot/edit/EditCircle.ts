import {Polygon} from '../../overlay'
import Edit from './Edit'
import {Constants, distance} from "../../utils/plot";
import GeomUtil from "../../utils/geomUtil";

//正圆
export default class EditCircle extends Edit {
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
		const [center , r] = JSON.parse(JSON.stringify(newPoints))
		let radius = GeomUtil.turfDistance(center, r)
		let diff = distance(center, r)
		const calcPnts = this.generatePoints(center, diff)
		this._delegate.setCoordinates([calcPnts])
		this._delegate.attr.lastFixPoints = [...newPoints]
	}

	generatePoints(center, radius) {
		let x,
			y,
			angle,
			points = []
		for (let i = 0; i <= Constants.FITTING_COUNT; i++) {
			angle = (Math.PI * 2 * i) / Constants.FITTING_COUNT
			x = center[0] + radius * Math.cos(angle)
			y = center[1] + radius * Math.sin(angle)
			points.push([x, y])
		}
		return points
	}
}
