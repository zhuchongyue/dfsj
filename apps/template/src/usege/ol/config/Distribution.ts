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
		center: [102.712251, 25.040609],
		projection: 'EPSG:3857',
		zoom: 1,
		minZoom: 1,
		maxZoom: 20,
		constrainResolution: true,
		smoothResolutionConstraint: false
	},
	baseLayers: [
		/** 矢量底图*/
		{
			// header,
			isBase: true,
			thumbnail: '/images/baseMap/thumb.image.png',
			layerName: 'eisImg',
			isDefault: true,
			layerType: 'TileWMTS',
			// matrixSet: 'c',
			projection: 'EPSG:3857',
			levels: 22,
			layer: 'china_jctc_yn',
			// layer: 'vec',
			format: 'image/png',
			style: 'default',
			// tileMatrixSetID: 'c',
			matrixIds: 'EPSG:3857:{z}',
			layerUrl: '/stream/geoserver/gwc/service/wmts',
			label: {
				alias: 'eisImg',
				isBaseLabel: true,
				layerName: 'eisCia',
				isDefault: true,
				layerType: 'TileWMTS',
				// matrixSet: 'c',
				projection: 'EPSG:3857',
				levels: 22,
				layer: 'china_jctc_xzzd_yn',
				// layer: 'vec',
				format: 'image/png',
				style: 'default',
				// tileMatrixSetID: 'c',
				matrixIds: 'EPSG:3857:{z}',
				layerUrl: '/stream/geoserver/gwc/service/wmts'
			}
		}

		/** egis 矢量图层*/
		// {
		//     header,
		//     isBase: true,
		//     layerName: 'eisVec',
		//     thumbnail: "/images/baseMap/thumb.vector.w.png",
		//     isDefault: true,
		//     layerType: 'TileWMTS',
		//     matrixSet: 'c',
		//     projection: 'EPSG:4490',
		//     levels: 19,
		//     layer: 'vec',
		//     format: 'tiles',
		//     style: 'default',
		//     // tileMatrixSetID: 'c',
		//     layerUrl: 'http://120.52.31.39/cloudapi/service/api/egis/base/v1/wmts',
		//     /** egis 影像标注图层*/
		//     label: {
		//         header,
		//         alias: 'eisVec',
		//         isBaseLabel: true,
		//         layerName: 'eisCva',
		//         isDefault: true,
		//         layerType: 'TileWMTS',
		//         matrixSet:'c',
		//         projection: 'EPSG:4490',
		//         levels: 22,
		//         layer: 'cva',
		//         format: 'tiles',
		//         style: 'default',
		//         // tileMatrixSetID: 'c',
		//         // layerUrl: 'http://yzt.fxkh.mem.gov.cn/stream/map.host/cia_c/wmts'
		//         layerUrl:'http://120.52.31.39/cloudapi/service/api/egis/base/v1/wmts'
		//     }
		// },
	]
}

export { OlBaseMap }
