import * as echarts from 'echarts'
// @ts-ignore
import SimplexNoise from 'simplex-noise'
import clamp from 'lodash-es/clamp'

let simplex = new SimplexNoise()

/**
 * eCharts绘制扩展，根据数据绘制水波特效，如同波浪一般。
 *
 * 在绘制的过程中加入了噪音（随机化处理），以模拟真实水波。
 */
//@ts-ignore
export default echarts.graphic.extendShape({
	type: 'ec-water',
	shape: {
		height: 0,
		wave: 10,
		amplitude: 5,
		layout: [
			[0, 100],
			[1000, 100],
			[1000, 1000]
		],
		speedX: 0.05,
		speedY: 0.01,
		phase: 0,
		x: 0,
		y: 0
	},
	buildPath: function (ctx, shape) {
		shape.x = 0
		shape.y += shape.speedY
		let width = shape.layout[1][0] - shape.layout[0][0]
		let start = shape.layout[0]
		for (let i = 0; i <= shape.wave; i++) {
			shape.x += shape.speedX
			let n = simplex.noise2D(shape.x, shape.y) * shape.amplitude
			let x = start[0] + i * (width / shape.wave)
			let y = clamp(shape.layout[0][1] + n, 0, shape.height)
			if (x === 0) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		}
		ctx.lineTo(shape.layout[2][0], clamp(shape.layout[2][1], 0, shape.height))
		ctx.lineTo(start[0], clamp(shape.layout[2][1], 0, shape.height))
		ctx.closePath()
		shape.phase++
	}
}) as any
