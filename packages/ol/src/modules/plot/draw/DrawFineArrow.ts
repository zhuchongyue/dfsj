import {Polygon} from '../../overlay'
import Draw from './Draw'
import {Constants, getBaseLength, getThirdPoint} from '../../utils/plot'
//细箭头
export default class DrawFineArrow extends Draw {
	public tailWidthFactor: number
	public neckWidthFactor: number
	public headWidthFactor: number
	public headAngle: number
	public neckAngle: number

	constructor(style) {
		super(style)
		this.tailWidthFactor = 0.15
		this.neckWidthFactor = 0.2
		this.headWidthFactor = 0.25
		this.headAngle = Math.PI / 8.5
		this.neckAngle = Math.PI / 13
		this.fixPointCount = 2
	}

	_mountedHook() {
		this._delegate = new Polygon(this._positions, {})
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate() {
		let count = this.count
		if (count < 2) {
			return
		}
		let pnts = this.positions
		let pnt1 = pnts[0]
		let pnt2 = pnts[1]
		let len = getBaseLength(pnts)
		let tailWidth = len * this.tailWidthFactor
		let neckWidth = len * this.neckWidthFactor
		let headWidth = len * this.headWidthFactor
		let tailLeft = getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true)
		let tailRight = getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false)
		let headLeft = getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false)
		let headRight = getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true)
		let neckLeft = getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false)
		let neckRight = getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true)
		let pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight]
		this._delegate.setCoordinates([pList])
	}
}
