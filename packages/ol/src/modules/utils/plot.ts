export const Constants = {
	TWO_PI: Math.PI * 2,
	HALF_PI: Math.PI / 2,
	FITTING_COUNT: 100,
	ZERO_TOLERANCE: 0.0001
}

export function distance(pnt1, pnt2) {
	return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2))
}

export function wholeDistance(points) {
	let n_distance = 0
	for (let i = 0; i < points.length - 1; i++) n_distance += distance(points[i], points[i + 1])
	return n_distance
}

export function getBaseLength(points) {
	return Math.pow(wholeDistance(points), 0.99)
	//return wholeDistance(points);
}

export function mid(pnt1, pnt2) {
	return [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2]
}

export function getCircleCenterOfThreePoints(pnt1, pnt2, pnt3) {
	let pntA = [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2]
	let pntB = [pntA[0] - pnt1[1] + pnt2[1], pntA[1] + pnt1[0] - pnt2[0]]
	let pntC = [(pnt1[0] + pnt3[0]) / 2, (pnt1[1] + pnt3[1]) / 2]
	let pntD = [pntC[0] - pnt1[1] + pnt3[1], pntC[1] + pnt1[0] - pnt3[0]]
	return getIntersectPoint(pntA, pntB, pntC, pntD)
}

export function getIntersectPoint(pntA, pntB, pntC, pntD) {
	let x, y, e, f
	if (pntA[1] == pntB[1]) {
		f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1])
		x = f * (pntA[1] - pntC[1]) + pntC[0]
		y = pntA[1]
		return [x, y]
	}
	if (pntC[1] == pntD[1]) {
		e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1])
		x = e * (pntC[1] - pntA[1]) + pntA[0]
		y = pntC[1]
		return [x, y]
	}
	e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1])
	f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1])
	y = (e * pntA[1] - pntA[0] - f * pntC[1] + pntC[0]) / (e - f)
	x = e * y - e * pntA[1] + pntA[0]
	return [x, y]
}

export function getAzimuth(startPnt, endPnt) {
	let azimuth
	let angle = Math.asin(Math.abs(endPnt[1] - startPnt[1]) / distance(startPnt, endPnt))
	if (endPnt[1] >= startPnt[1] && endPnt[0] >= startPnt[0]) azimuth = angle + Math.PI
	else if (endPnt[1] >= startPnt[1] && endPnt[0] < startPnt[0]) azimuth = Constants.TWO_PI - angle
	else if (endPnt[1] < startPnt[1] && endPnt[0] < startPnt[0]) azimuth = angle
	else if (endPnt[1] < startPnt[1] && endPnt[0] >= startPnt[0]) azimuth = Math.PI - angle
	return azimuth
}

export function getAngleOfThreePoints(pntA, pntB, pntC) {
	let angle = getAzimuth(pntB, pntA) - getAzimuth(pntB, pntC)
	return angle < 0 ? angle + Constants.TWO_PI : angle
}

export function isClockWise(pnt1, pnt2, pnt3) {
	return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0])
}

export function getPointOnLine(t, startPnt, endPnt) {
	let x = startPnt[0] + t * (endPnt[0] - startPnt[0])
	let y = startPnt[1] + t * (endPnt[1] - startPnt[1])
	return [x, y]
}

export function getCubicValue(t, startPnt, cPnt1, cPnt2, endPnt) {
	t = Math.max(Math.min(t, 1), 0)
	let tp = 1 - t
	let t2 = t * t
	let t3 = t2 * t
	let tp2 = tp * tp
	let tp3 = tp2 * tp
	let x = tp3 * startPnt[0] + 3 * tp2 * t * cPnt1[0] + 3 * tp * t2 * cPnt2[0] + t3 * endPnt[0]
	let y = tp3 * startPnt[1] + 3 * tp2 * t * cPnt1[1] + 3 * tp * t2 * cPnt2[1] + t3 * endPnt[1]
	return [x, y]
}

export function getThirdPoint(startPnt, endPnt, angle, distance, clockWise) {
	let azimuth = getAzimuth(startPnt, endPnt)
	let alpha = clockWise ? azimuth + angle : azimuth - angle
	let dx = distance * Math.cos(alpha)
	let dy = distance * Math.sin(alpha)
	return [endPnt[0] + dx, endPnt[1] + dy]
}

export function getArcPoints(center, radius, startAngle, endAngle) {
	let x,
		y,
		pnts = []
	let angleDiff = endAngle - startAngle
	angleDiff = angleDiff < 0 ? angleDiff + Constants.TWO_PI : angleDiff
	for (let i = 0; i <= Constants.FITTING_COUNT; i++) {
		let angle = startAngle + (angleDiff * i) / Constants.FITTING_COUNT
		x = center[0] + radius * Math.cos(angle)
		y = center[1] + radius * Math.sin(angle)
		pnts.push([x, y])
	}
	return pnts
}

export function getBisectorNormals(t, pnt1, pnt2, pnt3) {
	let normal = getNormal(pnt1, pnt2, pnt3)
	let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
	let uX = normal[0] / dist
	let uY = normal[1] / dist
	let d1 = distance(pnt1, pnt2)
	let d2 = distance(pnt2, pnt3)
	let dt, x, y, bisectorNormalLeft, bisectorNormalRight
	if (dist > Constants.ZERO_TOLERANCE) {
		if (isClockWise(pnt1, pnt2, pnt3)) {
			dt = t * d1
			x = pnt2[0] - dt * uY
			y = pnt2[1] + dt * uX
			bisectorNormalRight = [x, y]
			dt = t * d2
			x = pnt2[0] + dt * uY
			y = pnt2[1] - dt * uX
			bisectorNormalLeft = [x, y]
		} else {
			dt = t * d1
			x = pnt2[0] + dt * uY
			y = pnt2[1] - dt * uX
			bisectorNormalRight = [x, y]
			dt = t * d2
			x = pnt2[0] - dt * uY
			y = pnt2[1] + dt * uX
			bisectorNormalLeft = [x, y]
		}
	} else {
		x = pnt2[0] + t * (pnt1[0] - pnt2[0])
		y = pnt2[1] + t * (pnt1[1] - pnt2[1])
		bisectorNormalRight = [x, y]
		x = pnt2[0] + t * (pnt3[0] - pnt2[0])
		y = pnt2[1] + t * (pnt3[1] - pnt2[1])
		bisectorNormalLeft = [x, y]
	}
	return [bisectorNormalRight, bisectorNormalLeft]
}

export function getNormal(pnt1, pnt2, pnt3) {
	let dX1 = pnt1[0] - pnt2[0]
	let dY1 = pnt1[1] - pnt2[1]
	let d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1)
	dX1 /= d1
	dY1 /= d1

	let dX2 = pnt3[0] - pnt2[0]
	let dY2 = pnt3[1] - pnt2[1]
	let d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2)
	dX2 /= d2
	dY2 /= d2

	let uX = dX1 + dX2
	let uY = dY1 + dY2
	return [uX, uY]
}

export function getCurvePoints(t, controlPoints) {
	let leftControl = getLeftMostControlPoint(controlPoints)
	let normals = [leftControl]
	let pnt2, pnt1
	for (let i = 0; i < controlPoints.length - 2; i++) {
		let pnt1 = controlPoints[i]
		let pnt2 = controlPoints[i + 1]
		let pnt3 = controlPoints[i + 2]
		let normalPoints = getBisectorNormals(t, pnt1, pnt2, pnt3)
		normals = normals.concat(normalPoints)
	}
	let rightControl = getRightMostControlPoint(controlPoints)
	normals.push(rightControl)
	let points = []
	for (let i = 0; i < controlPoints.length - 1; i++) {
		pnt1 = controlPoints[i]
		pnt2 = controlPoints[i + 1]
		points.push(pnt1)
		for (let t = 0; t < Constants.FITTING_COUNT; t++) {
			let pnt = getCubicValue(
				t / Constants.FITTING_COUNT,
				pnt1,
				normals[i * 2],
				normals[i * 2 + 1],
				pnt2
			)
			points.push(pnt)
		}
		points.push(pnt2)
	}
	return points
}

export function getLeftMostControlPoint(controlPoints) {
	let pnt1 = controlPoints[0]
	let pnt2 = controlPoints[1]
	let pnt3 = controlPoints[2]
	let pnts = getBisectorNormals(0, pnt1, pnt2, pnt3)
	let normalRight = pnts[0]
	let normal = getNormal(pnt1, pnt2, pnt3)
	let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
	let controlX, controlY
	if (dist > Constants.ZERO_TOLERANCE) {
		let arr_mid = mid(pnt1, pnt2)
		let pX = pnt1[0] - arr_mid[0]
		let pY = pnt1[1] - arr_mid[1]

		let d1 = distance(pnt1, pnt2)
		// normal at midpoint
		let n = 2.0 / d1
		let nX = -n * pY
		let nY = n * pX

		// upper triangle of symmetric transform matrix
		let a11 = nX * nX - nY * nY
		let a12 = 2 * nX * nY
		let a22 = nY * nY - nX * nX

		let dX = normalRight[0] - arr_mid[0]
		let dY = normalRight[1] - arr_mid[1]

		// coordinates of reflected vector
		controlX = arr_mid[0] + a11 * dX + a12 * dY
		controlY = arr_mid[1] + a12 * dX + a22 * dY
	} else {
		let t = 0
		controlX = pnt1[0] + t * (pnt2[0] - pnt1[0])
		controlY = pnt1[1] + t * (pnt2[1] - pnt1[1])
	}
	return [controlX, controlY]
}

export function getRightMostControlPoint(controlPoints) {
	let count = controlPoints.length
	let pnt1 = controlPoints[count - 3]
	let pnt2 = controlPoints[count - 2]
	let pnt3 = controlPoints[count - 1]
	let pnts = getBisectorNormals(0, pnt1, pnt2, pnt3)
	let normalLeft = pnts[1]
	let normal = getNormal(pnt1, pnt2, pnt3)
	let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
	let controlX, controlY
	if (dist > Constants.ZERO_TOLERANCE) {
		let arr_mid = mid(pnt2, pnt3)
		let pX = pnt3[0] - arr_mid[0]
		let pY = pnt3[1] - arr_mid[1]

		let d1 = distance(pnt2, pnt3)
		// normal at midpoint
		let n = 2.0 / d1
		let nX = -n * pY
		let nY = n * pX

		// upper triangle of symmetric transform matrix
		let a11 = nX * nX - nY * nY
		let a12 = 2 * nX * nY
		let a22 = nY * nY - nX * nX

		let dX = normalLeft[0] - arr_mid[0]
		let dY = normalLeft[1] - arr_mid[1]

		// coordinates of reflected vector
		controlX = arr_mid[0] + a11 * dX + a12 * dY
		controlY = arr_mid[1] + a12 * dX + a22 * dY
	} else {
		let t = 0
		controlX = pnt3[0] + t * (pnt2[0] - pnt3[0])
		controlY = pnt3[1] + t * (pnt2[1] - pnt3[1])
	}
	return [controlX, controlY]
}

export function getBezierPoints(points) {
	if (points.length <= 2) return points

	let bezierPoints = []
	let n = points.length - 1
	for (let t = 0; t <= 1; t += 0.01) {
		let x = 0
		let y = 0
		for (let index = 0; index <= n; index++) {
			let factor = getBinomialFactor(n, index)
			let a = Math.pow(t, index)
			let b = Math.pow(1 - t, n - index)
			x += factor * a * b * points[index][0]
			y += factor * a * b * points[index][1]
		}
		bezierPoints.push([x, y])
	}
	bezierPoints.push(points[n])
	return bezierPoints
}

export function getBinomialFactor(n, index) {
	return getFactorial(n) / (getFactorial(index) * getFactorial(n - index))
}

export function getFactorial(n) {
	if (n <= 1) return 1
	if (n == 2) return 2
	if (n == 3) return 6
	if (n == 4) return 24
	if (n == 5) return 120
	let result = 1
	for (let i = 1; i <= n; i++) result *= i
	return result
}

export function getQBSplinePoints(points) {
	if (points.length <= 2) return points

	let n = 2

	let bSplinePoints = []
	let m = points.length - n - 1
	bSplinePoints.push(points[0])
	for (let i = 0; i <= m; i++) {
		for (let t = 0; t <= 1; t += 0.05) {
			let x = 0
			let y = 0
			for (let k = 0; k <= n; k++) {
				let factor = getQuadricBSplineFactor(k, t)
				x += factor * points[i + k][0]
				y += factor * points[i + k][1]
			}
			bSplinePoints.push([x, y])
		}
	}
	bSplinePoints.push(points[points.length - 1])
	return bSplinePoints
}

export function getQuadricBSplineFactor(k, t) {
	if (k == 0) return Math.pow(t - 1, 2) / 2
	if (k == 1) return (-2 * Math.pow(t, 2) + 2 * t + 1) / 2
	if (k == 2) return Math.pow(t, 2) / 2
	return 0
}
