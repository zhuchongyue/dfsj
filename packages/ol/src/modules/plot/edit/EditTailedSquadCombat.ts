import {Constants, getBaseLength, getQBSplinePoints, getThirdPoint} from '../../utils/plot'
import EditAttackArrow from './EditAttackArrow'
//分队战斗行动（尾）
export default class EditTailedSquadCombat extends EditAttackArrow {
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
		this.swallowTailFactor = 1
		this.swallowTailPnt = null
	}

	generate(newPoints = this._positions) {
		let pnts = newPoints
		let tailPnts = this.getTailPoints(pnts)
		let headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[2])
		let neckLeft = headPnts[0]
		let neckRight = headPnts[4]
		let bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor)
		let count = bodyPnts.length
		let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2))
		leftPnts.push(neckLeft)
		let rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count))
		rightPnts.push(neckRight)
		leftPnts = getQBSplinePoints(leftPnts)
		rightPnts = getQBSplinePoints(rightPnts)
		this._delegate.setCoordinates([
			leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]])
		])
		this._delegate.attr.lastFixPoints = [...newPoints]
	}

	getTailPoints(points) {
		let allLen = getBaseLength(points)
		let tailWidth = allLen * this.tailWidthFactor
		let tailLeft = getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, false)
		let tailRight = getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, true)
		let len = tailWidth * this.swallowTailFactor
		let swallowTailPnt = getThirdPoint(points[1], points[0], 0, len, true)
		return [tailLeft, swallowTailPnt, tailRight]
	}
}
