import {Polyline} from '../../overlay'
import Draw from './Draw'
import {distance, getArcPoints, getAzimuth, getCircleCenterOfThreePoints, isClockWise} from '../../utils/plot'
import OverlayType from "../../overlay/OverlayType";

export default class DrawArc extends Draw {
	constructor(style) {
		super(style)
		this.fixPointCount = 3
	}
	_stoppedHook(){
		this._delegate.attr.fixPoints = this.positions?.slice(0,this.fixPointCount);
		super._stoppedHook()
	}

	_mountedHook() {
		this._delegate = new Polyline(this._positions, {})
		this._delegate.attr = { id: this._id ,type:OverlayType.ARC,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	_onDrawAnchor({ position }) {
		this._positions.push(position)
		if (this._positions.length) {
			this.generate()
		}
	}

	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		if (count == 2) {
			this._delegate.setCoordinates(position)
		} else {
			const  [pnt1,pnt2,pnt3 ] = position
			// let pnt1 = this._positions[0]
			// let pnt2 = this._positions[1]
			// let pnt3 = this._positions[2]
			let center = getCircleCenterOfThreePoints(pnt1, pnt2, pnt3)
			let radius = distance(pnt1, center)

			let angle1 = getAzimuth(pnt1, center)
			let angle2 = getAzimuth(pnt2, center)
			let [startAngle, endAngle] = [null, null]
			if (isClockWise(pnt1, pnt2, pnt3)) {
				startAngle = angle2
				endAngle = angle1
			} else {
				startAngle = angle1
				endAngle = angle2
			}
			this._delegate.setCoordinates(getArcPoints(center, radius, startAngle, endAngle))
		}
	}
}
