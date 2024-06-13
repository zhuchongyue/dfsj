import {transform} from 'ol/proj'
import {getArea, getDistance, getLength} from 'ol/sphere'
import * as turf from '@turf/turf'

// @ts-ignore
export default class GeomUtil {
	static turfDistance = (p1, p2) => {
		const v = turf.distance(turf.point(p1), turf.point(p2), {
			units: 'kilometers'
		})
		return v
	}

	//计算长度
	static distance(geom, projection?) {
		let length = getLength(geom, {
			projection: projection ?? undefined
		})
		let output = ''
		if (length > 100) {
			output = 'L = ' + Math.round((length / 1000) * 100) / 100 + '（km）'
		} else {
			output = 'L = ' + Math.round(length * 100) / 100 + '（m）'
		}
		return output
	}

	//计算面积
	static area(geom, projection?) {
		let area = getArea(geom, {
			projection: projection ?? undefined
		})
		let output = ''
		if (area > 10000) {
			output = 'S = ' + Math.round((area / 1000000) * 100) / 100 + '( km<sup>2</sup>)'
		} else {
			output = 'S = ' + Math.round(area * 100) / 100 + '( m<sup>2</sup>)'
		}
		return output
	}

	static angle(geom, projection?) {
		let coordinates = geom.getCoordinates()
		let angle: any = 0
		let sourceProj = projection ?? undefined
		for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			let c1: any = transform(coordinates[i], sourceProj, 'EPSG:4326')
			let c2: any = transform(coordinates[i + 1], sourceProj, 'EPSG:4326')
			let c3: any = 0
			//当绘制两个及以上点的时候，将c1的值传给C3，C2的值传给C1
			if (i >= 1) {
				c3 = transform(coordinates[i - 1], sourceProj, 'EPSG:4326')
				let disa = getDistance(c3, c1)
				let disb = getDistance(c1, c2)
				let disc = getDistance(c2, c3)
				//由于绘制结束的时候双击会导致c1=c2，从而disb=0，而分母不能为零，导致angle=NAN值，所以需要取双击的前一次值。
				//当有三个以上的点的时候，形成了角度，需要对角度进行测量输出。
				if (disb === 0 && i >= 2) {
					c1 = transform(coordinates[i - 1], sourceProj, 'EPSG:4326')
					c2 = transform(coordinates[i], sourceProj, 'EPSG:4326')
					c3 = transform(coordinates[i - 2], sourceProj, 'EPSG:4326')
					disa = getDistance(c3, c1)
					disb = getDistance(c1, c2)
					disc = getDistance(c2, c3)
				}
				let cos = (disa * disa + disb * disb - disc * disc) / (2 * disa * disb) //利用余弦定理公式计算cos值
				angle = (Math.acos(cos) * 180) / Math.PI //求反余弦值，得到弧度制，并将弧度值转角度值
				angle = 'θ = ' + angle.toFixed(2) + '（°）' //对计算完成的角度，保留两位小数
				//由于绘制结束的时候双击会导致c1=c2，从而disb=0，而分母不能为零，导致angle=NAN值，所以需要取双击的前一次值。
				//当只有两个点的时候，只是一条线，并不形成角度，需要提示继续绘制。
				if (disb === 0 && i < 2) {
					angle = '请继续绘制形成角度'
				}
			}
			//当只是绘制一个点的时候，提示继续绘制。
			else {
				angle = '请继续绘制形成角度'
			}
		}
		let output
		output = angle

		return output //返回
	}
}
