import {Polygon} from '../../overlay'
import Draw from './Draw'
import {distance, getArcPoints, getAzimuth} from '../../utils/plot'
import OverlayType from "../../overlay/OverlayType";
//扇形
export default class DrawSector extends Draw {
	constructor(style) {
		super(style)
		this.fixPointCount = 3
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {});
		this._delegate.attr = { id: this._id ,type:OverlayType.SECTOR,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		if (position.length < 2) return
		if (position.length  == 2) this._delegate.setCoordinates([position])
		else {
			let pnts = position
			let center = pnts[0]
			let pnt2 = pnts[1]
			let pnt3 = pnts[2]
			let radius = distance(pnt2, center)
			let startAngle = getAzimuth(pnt2, center)
			let endAngle = getAzimuth(pnt3, center)
			let pList = getArcPoints(center, radius, startAngle, endAngle)
			pList.push(center, pList[0])
			this._delegate.setCoordinates([pList])
		}
	}
}
