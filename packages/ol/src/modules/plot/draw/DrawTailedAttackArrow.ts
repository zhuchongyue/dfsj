import {Polygon} from '../../overlay'
import {distance, getBaseLength, getQBSplinePoints, getThirdPoint, isClockWise, mid} from '../../utils/plot'
import DrawAttackArrow from './DrawAttackArrow'
//进攻方向（尾）
export default class DrawTailedAttackArrow extends DrawAttackArrow {
	private tailWidthFactor: number
	private swallowTailFactor: number
	private swallowTailPnt: any

	constructor(style) {
		super(style)
		this.headHeightFactor = 0.18
		this.headWidthFactor = 0.3
		this.neckHeightFactor = 0.85
		this.neckWidthFactor = 0.15
		this.tailWidthFactor = 0.1
		this.headTailFactor = 0.8
		this.swallowTailFactor = 1
		this.swallowTailPnt = null
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
		if (this.count == 2) {
			this._delegate.setCoordinates([this.positions])
			return
		}
		let pnts = this.positions
		let tailLeft = pnts[0]
		let tailRight = pnts[1]
		if (isClockWise(pnts[0], pnts[1], pnts[2])) {
			tailLeft = pnts[1]
			tailRight = pnts[0]
		}
		let midTail = mid(tailLeft, tailRight)
		let bonePnts = [midTail].concat(pnts.slice(2))
		let headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight)
		let neckLeft = headPnts[0]
		let neckRight = headPnts[4]
		let tailWidth = distance(tailLeft, tailRight)
		let allLen = getBaseLength(bonePnts)
		let len = allLen * this.tailWidthFactor * this.swallowTailFactor
		this.swallowTailPnt = getThirdPoint(bonePnts[1], bonePnts[0], 0, len, true)
		let factor = tailWidth / allLen
		let bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor)
		count = bodyPnts.length
		let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2))
		leftPnts.push(neckLeft)
		let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count))
		rightPnts.push(neckRight)

		leftPnts = getQBSplinePoints(leftPnts)
		rightPnts = getQBSplinePoints(rightPnts)
		this._delegate.setCoordinates([
			leftPnts.concat(headPnts, rightPnts.reverse(), [this.swallowTailPnt, leftPnts[0]])
		])
	}
}
