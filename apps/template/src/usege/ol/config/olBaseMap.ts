/***
 * ol 的底图配置
 */
const header = {
	Authorization:
		'Basic MjJhNDJmNjVjOGM0NDcyNGI1NzAzZWZkNTRiZjU3ODI6YWE5MDAxNTMyYmQzNDI3OWE5N2UzYjAxYmY2MTczZjk='
}
const OlBaseMap = {
	target: 'ec-ol',
	labelAliasKey: 'alias',
	isDefaultKey: 'isDefault',
	controls: {
		// loading: {},
		mousePosition: {},
		zoom: {},
		// zoomSlider: true,
		scaleLine: false,
		rotate: false
	},
	interactions: {
		shiftDragZoom: false
	},
	view: {
		// center: [117.28, 31.86],
		// center: [106.0, 26.8],
		center: [108.8215, 23.8786],
		projection: 'EPSG:4490',
		zoom: 8,
		minZoom: 1,
		maxZoom: 20,
		constrainResolution: true,
		smoothResolutionConstraint: false
	},
	baseLayers: [
		/** egis 影像图层*/
		{
			header,
			isBase: true,
			thumbnail: '/images/baseMap/thumb.image.png',
			layerName: 'eisImg',
			isDefault: false,
			layerType: 'TileWMTS',
			matrixSet: 'c',
			projection: 'EPSG:4490',
			levels: 19,
			layer: 'img',
			// layer: 'vec',
			format: 'tiles',
			style: 'default',
			// tileMatrixSetID: 'c',
			layerUrl: 'http://120.52.31.39/cloudapi/service/api/egis/base/v1/wmts',
			/** egis 影像标注图层*/
			label: {
				header,
				alias: 'eisImg',
				isBaseLabel: true,
				layerName: 'eisCia',
				isDefault: true,
				layerType: 'TileWMTS',
				matrixSet: 'c',
				projection: 'EPSG:4490',
				levels: 22,
				layer: 'cia',
				format: 'tiles',
				style: 'default',
				// tileMatrixSetID: 'c',
				// layerUrl: 'http://yzt.fxkh.mem.gov.cn/stream/map.host/cia_c/wmts'
				layerUrl: 'http://120.52.31.39/cloudapi/service/api/egis/base/v1/wmts'
			}
		},

		/** egis 矢量图层*/
		{
			header,
			isBase: true,
			layerName: 'eisVec',
			thumbnail: '/images/baseMap/thumb.vector.w.png',
			isDefault: true,
			layerType: 'TileWMTS',
			matrixSet: 'c',
			projection: 'EPSG:4490',
			levels: 19,
			layer: 'vec',
			format: 'tiles',
			style: 'default',
			// tileMatrixSetID: 'c',
			layerUrl: 'http://120.52.31.39/cloudapi/service/api/egis/base/v1/wmts',
			/** egis 影像标注图层*/
			label: {
				header,
				alias: 'eisVec',
				isBaseLabel: true,
				layerName: 'eisCva',
				isDefault: true,
				layerType: 'TileWMTS',
				matrixSet: 'c',
				projection: 'EPSG:4490',
				levels: 22,
				layer: 'cva',
				format: 'tiles',
				style: 'default',
				// tileMatrixSetID: 'c',
				// layerUrl: 'http://yzt.fxkh.mem.gov.cn/stream/map.host/cia_c/wmts'
				layerUrl: 'http://120.52.31.39/cloudapi/service/api/egis/base/v1/wmts'
			}
		}
	]
}

export { OlBaseMap }
