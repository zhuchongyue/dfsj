import * as echarts from 'echarts'
import completeDimensions from 'echarts/lib/data/helper/createDimensions'

export default echarts.extendSeriesModel({
	type: 'series.water',

	visualColorAccessPath: 'textStyle.normal.color',

	getInitialData: function (option, ecModel) {
		let dimensions = completeDimensions(['value'], option.data)
		// @ts-ignore
		let list = new echarts.List(dimensions, this)
		list.initData(option.data || [])
		return list
	},

	defaultOption: {
		coordinateSystem: 'cartesian2d',
		count: 10,
		speedX: 0.1,
		speedY: 0.01,
		wave: 100,
		amplitude: 5 //1~10
	}
}) as any
