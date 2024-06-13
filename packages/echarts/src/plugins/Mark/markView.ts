import * as echarts from 'echarts'
import Factory from './factory'

echarts.extendChartView({
	type: 'mark',
	render: function (seriesModel, ecModel, api) {
		// @ts-ignore
		this.group.removeAll()
		const data = seriesModel.getData()
		data.each((index) => {
			let model = data.getItemModel(index)
			let grids = model.get('gridIndex') || [0]
			grids.forEach((grid) => {
				let sys = api.getCoordinateSystems()[grid]
				let shape = model.get('shape')
				let xAxisIndex = model.get('xAxisIndex')
				let yAxisIndex = model.get('yAxisIndex')
				let xAxis = sys.getAxis('x', xAxisIndex)
				let yAxis = sys.getAxis('y', yAxisIndex)
				if (xAxis && yAxis && Factory[shape]) {
					let finder = { xAxisModel: xAxis.model, yAxisModel: yAxis.model }
					// @ts-ignore
					this.group.add(Factory[shape](model, sys, finder, api, 0))
				}
			})
		})
	},

	dispose() {
		// @ts-ignore
		this.group.removeAll()
	}
})
