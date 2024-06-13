import * as echarts from 'echarts'
import {parsePercent} from '../utils'
import assign from '../../utils/assign'
import type {CoordinateSystemMaster} from 'echarts/types/src/coord/CoordinateSystem'
import type Model from 'echarts/types/src/model/Model'

/**
 * 为不同标记类型创建标记的工厂类
 */
export default class Factory {
	/**
	 * 创建一个包含指定图标的标记，包含一个图标和标记名称。
	 * @param model
	 * @param sys
	 * @param finder
	 * @returns
	 */
	static symbol(
		model: Model,
		sys: CoordinateSystemMaster,
		finder
	): echarts.graphic.Group | undefined {
		let value = model.get('value')
		let axis = model.get('yAxisIndex')
		let style = model.get('itemStyle')
		let rect = sys.getRect()
		let x = axis % 2 === 0 ? rect.x : rect.width
		let y = sys.convertToPixel(null, finder, [0, value])[1]
		let oSymbol = model.get('itemStyle.offset') || [0, 0]
		if (y <= rect.y + rect.height && y >= rect.y) {
			let group = new echarts.graphic.Group()
			group.add(
				echarts.graphic.makePath(
					model.get('symbol'),
					assign(
						{
							z2: 10,
							x: x + oSymbol[0],
							y: y + oSymbol[1],
							scale: style.scale
						},
						{ style }
					),
					undefined
				)
			)

			let label = model.get('label')
			let oLabel = model.get('label.offset') || [0, 0]
			group.add(
				new echarts.graphic.Text(
					assign(
						{
							z2: 10,
							x: x + oLabel[0],
							y: y + oLabel[1]
						},
						{ style: label }
					)
				)
			)
			return group
		}
	}

	/**
	 * 创建指标标记（校核水位、设计水位等标记），包含一条横向标记线及标记线名称
	 * @param model
	 * @param sys
	 * @param finder
	 * @param api echart custom series api
	 * @returns {*}
	 */
	static index(
		model: Model,
		sys: CoordinateSystemMaster,
		finder,
		api
	): echarts.graphic.Group | undefined {
		let value = model.get('value')
		let axis = model.get('yAxisIndex')
		let rect = sys.getRect()

		// console.log('sys',sys,rect)
		let y = sys.convertToPixel(null, finder, [0, value])[1]
		if (y <= rect.y + rect.height && y >= rect.y) {
			// 绘制横跨图表的虚线
			let group = new echarts.graphic.Group()
			group.add(
				new echarts.graphic.Line(
					assign(
						{
							z2: 10,
							shape: {
								x1: rect.x,
								y1: y,
								x2: rect.x + rect.width,
								y2: y
							}
						},
						{ style: model.get('lineStyle') }
					)
				)
			)

			// group.add(new echarts.graphic.Circle({
			//   z2: 10,
			//   shape: {
			//     cx: axis ? rect.x + rect.width : rect.x,
			//     cy: y,
			//     r: 3
			//   },
			//   style: model.get("symbolStyle")
			// }));
			//
			// group.add(echarts.graphic.makePath(
			//   model.get("symbol"),
			//   {
			//     z2: 10,
			//     position: [axis ? rect.x : rect.x + rect.width, y]
			//   }
			// ));

			// console.log('绘制文字信息')
			// let x = axis ? rect.width + rect.x : rect.x;
			// let label = model.get("label");
			// let offset = model.get("label.offset");
			// group.add(new echarts.graphic.Text(assign({
			// 	z2: 10,
			// 	position: [x + offset[0], y + offset[1]],
			// }, {style: label})));
			// return group;
			// 绘制指标文字
			let index   = 0;
			let label   = model.get("label");
			let offset  = model.get("label.offset");
			let width   = model.get("label.width") ?? 135;
			let x       = (axis % 2 === 0) ? rect.x : rect.width + rect.x;
			let d       = (axis % 2 === 0) ? 1 : -1;
			let series = model.ecModel.get("series") as  Array<any>;
			let name = model.get('name')
			const $indices = series?.filter((s)=>s?.type == 'mark');
			index = $indices.findIndex((s)=>s.name == name) ?? 0
			//fixme 这样导致文字部分随图例切换向右平移
			// let indices = model.ecModel.get("$indices");
			// if (indices != null) {
			// 	index = indices[axis] == null ? indices[axis] = 0 : ++indices[axis];
			// 	console.log({index})
			// }
			let offsetX = x + offset[0] + index * width * d;
			let offsetY = y + offset[1];
			group.add(new echarts.graphic.Text(assign({
				z2: 10,
				x: offsetX,
				y: offsetY,
			}, {style: label})));
			return group;
		}
	}

	/**
	 * 创建一个标记区域，该区域由指定x轴的起始位置和结束位置，并为该标记区域设置背景颜色。
	 * @param model
	 * @param sys
	 * @param finder
	 * @param api
	 * @returns {*}
	 */
	static rect(
		model: Model,
		sys: CoordinateSystemMaster,
		finder,
		api
	): echarts.graphic.Rect | undefined {
		let value = model.get('value')
		let x1 = sys.convertToPixel(null, finder, [value[0], 0])[0]
		let x2 = sys.convertToPixel(null, finder, [value[1], 0])[0]
		let rect = sys.getRect()
		let style = model.get('itemStyle')
		let shape = echarts.graphic.clipRectByRect(
			{
				x: x1,
				y: rect.y,
				width: x2 - x1,
				height: rect.height
			},
			rect
		)
		return shape && new echarts.graphic.Rect(assign({ shape }, { style }))
	}

	/**
	 * 创建一条垂直方向上的标记线（如当前时间），并为该标记线设置一个简短文本。
	 * @param model
	 * @param sys
	 * @param finder
	 * @returns {*}
	 */
	static line(
		model: Model,
		sys: CoordinateSystemMaster,
		finder
	): echarts.graphic.Group | undefined {
		let value = model.get('value')
		let rect = sys.getRect()
		let x = sys.convertToPixel(null, finder, [value, 0])[0]
		if (x >= rect.x && x <= rect.x + rect.width) {
			let group = new echarts.graphic.Group()
			group.add(
				new echarts.graphic.Line(
					assign(
						{
							z2: 1,
							shape: {
								x1: x,
								y1: rect.y,
								x2: x,
								y2: rect.y + rect.height
							}
						},
						{ style: model.get('itemStyle') }
					)
				)
			)

			let label = model.get('label')
			let offset = model.get('label.offset') || [0, 0]
			group.add(
				new echarts.graphic.Text(
					assign(
						{
							x: x + parsePercent(offset[0], rect.width),
							y: rect.y + parsePercent(offset[1], rect.height)
						},
						{ style: label }
					)
				)
			)
			return group
		}
	}

	/**
	 * 创建一个纯文本标记。
	 * @param model
	 * @param sys
	 * @param finder
	 * @returns {*}
	 */
	static text(model: Model, sys: CoordinateSystemMaster, finder): echarts.graphic.Text | undefined {

		console.log('0---------------/////--------------------------')
		let value = model.get('value')
		let x = sys.convertToPixel(null, finder, [value, 0])[0]
		let rect = sys.getRect()
		if (x >= rect.x && x <= rect.x + rect.width) {
			let label = model.get('label')
			let offset = model.get('label.offset') || [0, 0]
			return new echarts.graphic.Text(
				assign(
					{
						position: [
							x + parsePercent(offset[0], rect.width),
							rect.y + parsePercent(offset[1], rect.height),
						]
						// x: x + parsePercent(offset[0], rect.width),
						// y: rect.y + parsePercent(offset[1], rect.height)
					},
					{ style: label }
				)
			)
		}
	}
}
