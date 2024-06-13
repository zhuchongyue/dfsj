import Draw from './Draw'
import {distance, getThirdPoint} from '../../utils/plot'
import {Polyline} from '../../overlay'
//直箭头
export default class DrawStraightArrow extends Draw {
	private maxArrowLength: number
	private arrowLengthScale: number

	constructor(style) {
		super(style)
		this.fixPointCount = 2
		this.maxArrowLength = 3000000
		this.arrowLengthScale = 5
	}

	_mountedHook() {
		this._delegate = new Polyline(this._positions, {})
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate() {
		if (this.count < 2) {
			return
		}
		let pnts = this.positions
		let pnt1 = pnts[0]
		let pnt2 = pnts[1]
		let dis = distance(pnt1, pnt2)
		let len = dis / this.arrowLengthScale
		len = len > this.maxArrowLength ? this.maxArrowLength : len
		let leftPnt = getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false)
		let rightPnt = getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true)
		this._delegate.setCoordinates([pnt1, pnt2, leftPnt, pnt2, rightPnt])
	}
}
