import {Polygon} from '../../overlay'
import Draw from './Draw'
import {
    Constants,
    distance,
    getAngleOfThreePoints,
    getBaseLength,
    getBezierPoints,
    getThirdPoint,
    isClockWise,
    mid as Mid,
    wholeDistance
} from '../../utils/plot'
//钳击箭头
export default class DrawDoubleArrow extends Draw {
	private headHeightFactor: number
	private headWidthFactor: number
	private neckHeightFactor: number
	private neckWidthFactor: number
	private connPoint: any | [number, number]
	private tempPoint4: null

	constructor(style) {
		super(style)
		this.headHeightFactor = 0.25
		this.headWidthFactor = 0.3
		this.neckHeightFactor = 0.85
		this.neckWidthFactor = 0.15
		this.connPoint = []
		this.tempPoint4 = null
		this.fixPointCount = 4
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
		if (count == 2) {
			this._delegate.setCoordinates([this.positions])
			return
		}
		let pnt1 = this.positions[0]
		let pnt2 = this.positions[1]
		let pnt3 = this.positions[2]
		count = this.count
		if (count == 3) this.tempPoint4 = this.getTempPoint4(pnt1, pnt2, pnt3)
		else this.tempPoint4 = this.positions[3]
		if (count == 3 || count == 4) this.connPoint = Mid(pnt1, pnt2)
		else this.connPoint = this.positions[4]
		let leftArrowPnts, rightArrowPnts
		if (isClockWise(pnt1, pnt2, pnt3)) {
			leftArrowPnts = this.getArrowPoints(pnt1, this.connPoint, this.tempPoint4, false)
			rightArrowPnts = this.getArrowPoints(this.connPoint, pnt2, pnt3, true)
		} else {
			leftArrowPnts = this.getArrowPoints(pnt2, this.connPoint, pnt3, false)
			rightArrowPnts = this.getArrowPoints(this.connPoint, pnt1, this.tempPoint4, true)
		}
		let m = leftArrowPnts.length
		let t = (m - 5) / 2

		let llBodyPnts = leftArrowPnts.slice(0, t)
		let lArrowPnts = leftArrowPnts.slice(t, t + 5)
		let lrBodyPnts = leftArrowPnts.slice(t + 5, m)

		let rlBodyPnts = rightArrowPnts.slice(0, t)
		let rArrowPnts = rightArrowPnts.slice(t, t + 5)
		let rrBodyPnts = rightArrowPnts.slice(t + 5, m)

		rlBodyPnts = getBezierPoints(rlBodyPnts)
		let bodyPnts = getBezierPoints(rrBodyPnts.concat(llBodyPnts.slice(1)))
		lrBodyPnts = getBezierPoints(lrBodyPnts)

		let pnts = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts)
		this._delegate.setCoordinates([pnts])
	}

	getArrowPoints(pnt1, pnt2, pnt3, clockWise) {
		let midPnt = Mid(pnt1, pnt2)
		let len = distance(midPnt, pnt3)
		let midPnt1 = getThirdPoint(pnt3, midPnt, 0, len * 0.3, true)
		let midPnt2 = getThirdPoint(pnt3, midPnt, 0, len * 0.5, true)
		//let midPnt3=getThirdPoint(pnt3, midPnt, 0, len * 0.7, true);
		midPnt1 = getThirdPoint(midPnt, midPnt1, Constants.HALF_PI, len / 5, clockWise)
		midPnt2 = getThirdPoint(midPnt, midPnt2, Constants.HALF_PI, len / 4, clockWise)
		//midPnt3=getThirdPoint(midPnt, midPnt3, Constants.HALF_PI, len / 5, clockWise);

		let points = [midPnt, midPnt1, midPnt2, pnt3]
		// 计算箭头部分
		let arrowPnts = this.getArrowHeadPoints(points, this.headHeightFactor, this.headWidthFactor)
		let neckLeftPoint = arrowPnts[0]
		let neckRightPoint = arrowPnts[4]
		// 计算箭身部分
		let tailWidthFactor = distance(pnt1, pnt2) / getBaseLength(points) / 2
		let bodyPnts = this.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor)
		let n = bodyPnts.length
		let lPoints = bodyPnts.slice(0, n / 2)
		let rPoints = bodyPnts.slice(n / 2, n)
		lPoints.push(neckLeftPoint)
		rPoints.push(neckRightPoint)
		lPoints = lPoints.reverse()
		lPoints.push(pnt2)
		rPoints = rPoints.reverse()
		rPoints.push(pnt1)
		return lPoints.reverse().concat(arrowPnts, rPoints)
	}

	finishDrawing() {
		if (this.count == 3 && this.tempPoint4 != null) this._positions.push(this.tempPoint4)
		if (this.connPoint != null) this._positions.push(this.connPoint)
	}

	getArrowHeadPoints(points, tailLeft, tailRight) {
		let len = getBaseLength(points)
		let headHeight = len * this.headHeightFactor
		let headPnt = points[points.length - 1]
		let tailWidth = distance(tailLeft, tailRight)
		let headWidth = headHeight * this.headWidthFactor
		let neckWidth = headHeight * this.neckWidthFactor
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

	getTempPoint4(linePnt1, linePnt2, point) {
		let midPnt = Mid(linePnt1, linePnt2)
		let len = distance(midPnt, point)
		let angle = getAngleOfThreePoints(linePnt1, midPnt, point)
		let symPnt, distance1, distance2, mid
		if (angle < Constants.HALF_PI) {
			distance1 = len * Math.sin(angle)
			distance2 = len * Math.cos(angle)
			mid = getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false)
			symPnt = getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true)
		} else if (angle >= Constants.HALF_PI && angle < Math.PI) {
			distance1 = len * Math.sin(Math.PI - angle)
			distance2 = len * Math.cos(Math.PI - angle)
			mid = getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false)
			symPnt = getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false)
		} else if (angle >= Math.PI && angle < Math.PI * 1.5) {
			distance1 = len * Math.sin(angle - Math.PI)
			distance2 = len * Math.cos(angle - Math.PI)
			mid = getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true)
			symPnt = getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true)
		} else {
			distance1 = len * Math.sin(Math.PI * 2 - angle)
			distance2 = len * Math.cos(Math.PI * 2 - angle)
			mid = getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true)
			symPnt = getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false)
		}
		return symPnt
	}
}
