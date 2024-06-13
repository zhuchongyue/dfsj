import * as echarts from 'echarts'
import WaterLayout from './waterLayout'

export default echarts.extendChartView({
	type: 'water',
	render: function (seriesModel, ecModel, api) {
		// @ts-ignore
		this.group.removeAll()
		let sys = api.getCoordinateSystems()[0]
		let data = seriesModel.getData()
		let item = data.getItemModel(0)
		let style = item.getModel('itemStyle')
		let layout = item.get('data').map((p) => sys.convertToPixel(null, { seriesModel }, p))
		let count = item.get('count')
		let height = api.getHeight() - (item.get('grid.0.bottom') || 0)
		for (let i = 0; i < count; i++) {
			let water = new WaterLayout({
				// position: [0, 0],
				shape: {
					height: height,
					layout: layout,
					speedX: item.get('speedX'),
					speedY: item.get('speedY') + i / 1000,
					amplitude: item.get('amplitude'),
					wave: item.get('wave')
				},
				style: style.getItemStyle()
			})
			water.animate('shape', true).when(1000, { phase: 1 }).start()
			// @ts-ignore
			this.group.add(water)
		}
	},

	dispose() {
		// @ts-ignore
		this.group.removeAll()
	}
}) as any
