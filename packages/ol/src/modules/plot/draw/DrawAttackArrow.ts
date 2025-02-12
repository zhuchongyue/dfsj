import {Polygon} from '../../overlay'
import Draw from './Draw'
import {
    Constants,
    distance,
    getAngleOfThreePoints,
    getBaseLength,
    getQBSplinePoints,
    getThirdPoint,
    isClockWise,
    mid,
    wholeDistance
} from '../../utils/plot'
import OverlayType from "../../overlay/OverlayType";
//进攻方向
export default class DrawAttackArrow extends Draw {
	public headHeightFactor: number
	public headWidthFactor: number
	public neckHeightFactor: number
	public neckWidthFactor: number
	public headTailFactor: number

	constructor(style) {
		super(style)
		this.headHeightFactor = 0.18
		this.headWidthFactor = 0.3
		this.neckHeightFactor = 0.85
		this.neckWidthFactor = 0.15
		this.headTailFactor = 0.8

		this.fixPointCount = 3
	}

	_mountedHook() {
		this._delegate = new Polygon(this._positions, {})
		this._delegate.attr = { id: this._id ,type:OverlayType.ATTACK_ARROW,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		if (this.count < 2) {
			return
		}
		if (this.count == 2) {
			this._delegate.setCoordinates([position])
			return
		}
		let pnts = position
		// 计算箭尾
		let tailLeft = pnts[0]
		let tailRight = pnts[1]
		if (isClockWise(pnts[0], pnts[1], pnts[2])) {
			tailLeft = pnts[1]
			tailRight = pnts[0]
		}
		let midTail = mid(tailLeft, tailRight)
		let bonePnts = [midTail].concat(pnts.slice(2))
		// 计算箭头
		let headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight)
		let neckLeft = headPnts[0]
		let neckRight = headPnts[4]
		let tailWidthFactor = distance(tailLeft, tailRight) / getBaseLength(bonePnts)
		// 计算箭身
		let bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, tailWidthFactor)
		// 整合
		let count = bodyPnts.length
		let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2))
		leftPnts.push(neckLeft)
		let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count))
		rightPnts.push(neckRight)
		leftPnts = getQBSplinePoints(leftPnts)
		rightPnts = getQBSplinePoints(rightPnts)
		this._delegate.setCoordinates([leftPnts.concat(headPnts, rightPnts.reverse())])
	}

	getArrowHeadPoints(points, tailLeft, tailRight) {
		let len = getBaseLength(points)
		let headHeight = len * this.headHeightFactor
		let headPnt = points[points.length - 1]
		len = distance(headPnt, points[points.length - 2])
		let tailWidth = distance(tailLeft, tailRight)
		if (headHeight > tailWidth * this.headTailFactor) {
			headHeight = tailWidth * this.headTailFactor
		}
		let headWidth = headHeight * this.headWidthFactor
		let neckWidth = headHeight * this.neckWidthFactor
		headHeight = headHeight > len ? len : headHeight
		let neckHeight = headHeight * this.neckHeightFactor
		let headEndPnt = getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true)
		let neckEndPnt = getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true)
		let headLeft = getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, false)
		let headRight = getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, true)
		let neckLeft = getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, false)
		let neckRight = getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, true)
		return [neckLeft, headLeft, headPnt, headRight, neckRight]
	}

	getArrowBodyPoints(points, neckLeft, neckRight, tailWidthFactor) {
		let allLen = wholeDistance(points)
		let len = getBaseLength(points)
		let tailWidth = len * tailWidthFactor
		let neckWidth = distance(neckLeft, neckRight)
		let widthDif = (tailWidth - neckWidth) / 2
		let tempLen = 0,
			leftBodyPnts = [],
			rightBodyPnts = []
		for (let i = 1; i < points.length - 1; i++) {
			let angle = getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2
			tempLen += distance(points[i - 1], points[i])
			let w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle)
			let left = getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true)
			let right = getThirdPoint(points[i - 1], points[i], angle, w, false)
			leftBodyPnts.push(left)
			rightBodyPnts.push(right)
		}
		return leftBodyPnts.concat(rightBodyPnts)
	}
}
