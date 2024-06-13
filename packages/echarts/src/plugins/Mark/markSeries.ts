import * as echarts from 'echarts'
import completeDimensions from 'echarts/lib/data/helper/createDimensions'

echarts.extendSeriesModel({
	type: 'series.mark',

	visualColorAccessPath: 'textStyle.normal.color',

	optionUpdated: function () {
		// @ts-ignore
		let option = this.option
		option.gridSize = Math.max(Math.floor(option.gridSize), 4)
	},

	getInitialData: function (option, ecModel) {
		let dimensions = completeDimensions(['value'], option.data)
		// @ts-ignore
		let list = new echarts.List(dimensions, this)
		list.initData(option.data || [])
		return list
	},

	defaultOption: {
		coordinateSystem: 'cartesian2d',
		animation: true,
		labelAreas: []
	}
})
