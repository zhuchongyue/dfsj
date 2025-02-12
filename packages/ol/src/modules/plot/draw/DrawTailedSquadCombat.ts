import {Polygon} from '../../overlay'
import {Constants, getBaseLength, getQBSplinePoints, getThirdPoint} from '../../utils/plot'
import DrawAttackArrow from './DrawAttackArrow'
import OverlayType from "../../overlay/OverlayType";
//分队战斗行动（尾）
export default class DrawTailedSquadCombat extends DrawAttackArrow {
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

		this.fixPointCount = 2
	}

	_mountedHook() {
		this._delegate = new Polygon(this._positions, {})
		this._delegate.attr = { id: this._id ,type:OverlayType.TAILED_SQUAD_COMBAT,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		let pnts = position
		let tailPnts = this.getTailPoints(pnts)
		let headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[2])
		let neckLeft = headPnts[0]
		let neckRight = headPnts[4]
		let bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor)
		// let count = bodyPnts.length;
		count = bodyPnts.length
		let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2))
		leftPnts.push(neckLeft)
		let rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count))
		rightPnts.push(neckRight)

		leftPnts = getQBSplinePoints(leftPnts)
		rightPnts = getQBSplinePoints(rightPnts)

		// this.setCoordinates([leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]])]);
		this._delegate.setCoordinates([
			leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]])
		])
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
