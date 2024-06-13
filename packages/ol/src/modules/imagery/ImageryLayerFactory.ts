import TileLayer from 'ol/layer/Tile'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import TileWMS from 'ol/source/TileWMS'
import {getTopLeft, getWidth} from 'ol/extent'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import TileGrid from 'ol/tilegrid/TileGrid'
import XYZ from 'ol/source/XYZ'
import {createXYZ} from 'ol/tilegrid'
import CustomProjection from '../proj/CustomProjection'
import {ProjTypes} from '../proj'
// @ts-ignore
import {setRequestHeader} from '../utils/auth'
import OSM from 'ol/source/OSM'
import {Baidu, Gaode, Google} from './type'
// @ts-ignore
import {merge} from '../utils/common'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTile from 'ol/source/VectorTile'
import {MVT} from 'ol/format'
import Static from 'ol/source/ImageStatic'
import {ImageArcGISRest, ImageMapGuide} from 'ol/source'
import RasterSource from 'ol/source/Raster'
import ImageCanvasSource from 'ol/source/ImageCanvas'
import ImageryType from './ImageryType'

const crossOrigin = 'anonymous'

/** 转换范围到地图的投影坐标系数*/
function toExtent(config: any, gis) {
	const Transform = gis?.transform
	let extent = undefined
	if (config?.extent) {
		extent = Transform.transformExtent(config['extent'], config.projection)
	}
	return extent
}

export default class ImageryLayerFactory {
	/**
	 * 创建专题图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createTitleLayer(layerName, params, gis?) {
		let serviceUrl = params?.['layerUrl'] ?? null
		if (!serviceUrl) return null
		return new TileLayer({
			// @ts-ignore
			layerName: layerName,
			layerType: params?.['notShowLayerType'] === true ? '' : 'title',
			visible: !!params['visible'],
			zIndex: +params['zIndex'],
			source: new TileArcGISRest({
				url: serviceUrl,
				crossOrigin: params?.['crossOrigin'] ?? undefined,
				params: params?.['layerParams'] ?? undefined,
				wrapX: false
			}),
			wrapX: false
		})
	}

	/**
	 * 创建ImageWMSLayer
	 * @param layerName
	 * @param params
	 * @returns {string}
	 */
	static createImageWMSLayer(layerName, params, gis?) {
		return new ImageLayer({
			// @ts-ignore
			layerName: layerName,
			visible: params?.['visible'] ?? true,
			opacity: params?.['opacity'] ?? 1,
			zIndex: +params?.['zIndex'],
			// extent: [71.55600100000001, -8.142312775059164, 141.868501, 52.64547233617796],
			source: new ImageWMS({
				url: params?.['layerUrl'],
				crossOrigin: params?.['crossOrigin'] ?? undefined,
				projection: params?.['projection'] ?? 'EPSG:4326',
				params: {
					LAYERS: params?.['layer'], // require
					STYLES: params?.['styles'] ?? '',
					VERSION: params?.['version'] ?? '1.3.0',
					WIDTH: params?.['width'] ?? 256,
					HEIGHT: params?.['height'] ?? 256,
					BBOX: params?.['bbox'], // require
					SRS: params?.['srs'] ?? 'EPSG:3857',
					CRS: params?.['srs'] ?? 'EPSG:3857',
					REQUEST: 'GetMap',
					TRANSPARENT: true,
					// TILED: !!params?.['tiled'] ?? true,
					// TILESORIGIN: params?.['tiledsorrigin'] ?? undefined,
					SERVICE: 'WMS',
					FORMAT: params?.['format'] ?? 'image/png',
					VIEWPARAMS: params?.['viewparams'] ?? ''
				},
				// @ts-ignore
				wrapX: false
			})
		})
	}

	/**
	 * 创建TileWMSLayer
	 * @param layerName
	 * @param params
	 * @returns {string}
	 */
	static createTileWMSLayer(layerName, params, gis?) {
		console.log('___createTileWMSLayer___createTileWMSLayer', params, params['width'])
		const _config: any = {
			LAYERS: params?.['layer'], // require
			STYLES: params?.['style'] ?? '',
			VERSION: params?.['version'] ?? '1.3.0',
			WIDTH: params?.['width'] ?? 256,
			HEIGHT: params?.['height'] ?? 256,
			BBOX: params?.['bbox'], // require
			SRS: params?.['srs'] ?? 'EPSG:3857',
			CRS: params?.['srs'] ?? 'EPSG:3857',
			REQUEST: 'GetMap',
			TRANSPARENT: true,
			TILED: !!params?.['tiled'] ?? true,
			TILESORIGIN: params?.['tiledsorrigin'] ?? undefined,
			SERVICE: 'WMS',
			FORMAT: params?.['format'] ?? 'image/png',
			VIEWPARAMS: params?.['viewparams'] ?? ''
		}
		if (params?.['cql_filter']) {
			_config.CQL_FILTER = params['cql_filter']
		}
		return new TileLayer({
			// @ts-ignore
			layerName: layerName,
			visible: params?.['visible'] ?? true,
			opacity: +params?.['opacity'] ?? 1,
			zIndex: +params['zIndex'],
			source: new TileWMS({
				url: params?.['layerUrl'],
				crossOrigin: params?.['crossOrigin'] ?? undefined,
				params: _config,
				wrapX: false,
				projection: params?.['projection'] ?? 'EPSG:4326'
			})
		})
	}

	/**
	 * 创建WMTS图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createWMTSLayer(layerName, params, gis?) {
		if (
			params &&
			params['layerUrl']
			// &&
			// params['create'] &&
			// params['levels']
		) {
			let projection = CustomProjection.get(params?.['projection'] ?? ProjTypes.EPSG3857)
			let projectionExtent = projection.getExtent()
			let size = getWidth(projectionExtent) / 256
			let levels = params['levels']
			const resolutions: number[] = params.resolutions?.length > 2 ? params.resolutions : []
			let matrixIds: any = []
			let [matrixIdReplace, pattern] = [false, /\{z\}/g]
			if (params['matrixIds'] && pattern.test(params['matrixIds'])) {
				matrixIdReplace = true
			}
			if (typeof params['matrixIds'] == 'string' && !matrixIdReplace) {
				matrixIds = params['matrixIds']
			} else if (Array.isArray(params['matrixIds'])) {
				matrixIds = params.matrixIds?.length > 2 ? params.matrixIds : []
			}
			if (resolutions.length === 0) {
				let range = params.resolutions || [0, 19]
				for (let s = range[0], i = 0; i <= range[1]; ++i) {
					resolutions[i] = size / Math.pow(2, s + i)
				}
			}
			if (Array.isArray(matrixIds) && matrixIds.length === 0) {
				let range = [0, levels ?? 19];
				if (params?.matrixIds?.length == 2){
					range = params?.matrixIds
				}
				for (let s = <number>range[0], i = 0; i <= range[1]; ++i) {
					if (matrixIdReplace) {
						const str = params['matrixIds'].replace(pattern, s + i)
						matrixIds[i] = str
					} else {
						if (typeof params['matrixIds'] == 'string') {
							matrixIds[i] = params['matrixIds']
						} else {
							matrixIds[i] = (params?.matrixPrefix || '') + (s + i)
						}
					}
				}
			}
			//FIXME  自定义请求头
			let source = new WMTS({
				url: params['layerUrl'],
				layer: params['layer'] ? params['layer'] : '0',
				matrixSet: params['matrixSet'] ? params['matrixSet'] : 'EPSG:3857',
				format: params['format'] ? params['format'] : 'image/png',
				crossOrigin: params?.['crossOrigin'] ?? crossOrigin,
				projection: projection,
				version: params?.['version'] ?? '1.0.0',
				tileGrid: new WMTSTileGrid({
					origin: getTopLeft(projectionExtent),
					extent: projectionExtent,
					resolutions: resolutions,
					matrixIds: matrixIds
					// dimensions: params?.['dimensions'],
				}),
				style: params?.['style'] ?? 'default',
				wrapX: false
			})
			if (params['header']) {
				setRequestHeader(source, params['header'])
			}
			return new TileLayer({
				// @ts-ignore
				layerName: layerName,
				extent: toExtent(params, gis),
				minZoom: params?.minzoom ?? 0,
				maxZoom: params?.maxzoom ?? 21,
				zIndex: params?.['zIndex'] ?? 1,
				visible: params?.['visible'] ?? true,
				opacity: params?.['opacity'] ?? 1,
				source
			})
		}
	}

	/**
	 * 创建XYZ图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createXYZLayer(layerName, params, gis?) {
		if (params && params['layerUrl'] && params['create']) {
			let tileGrid
			let tileSize = 256
			if (params['tileSize'] && typeof params['tileSize'] === 'number') {
				tileSize = params['tileSize']
			} else if (
				params['tileGrid'] &&
				params['tileGrid']['tileSize'] &&
				typeof params['tileGrid']['tileSize'] === 'number'
			) {
				tileSize = params['tileGrid']['tileSize']
			}
			let projection = 'EPSG:3857'
			if (params['projection']) {
				projection = params['projection']
			} else {
				projection = CustomProjection.get(params['projection']).getCode()
			}
			if (params['tileGrid'] && params['tileGrid']['resolutions']) {
				tileGrid = new TileGrid({
					tileSize: tileSize,
					origin: params['tileGrid']['origin'] ? params['tileGrid']['origin'] : undefined,
					extent: params['tileGrid']['extent'] ? params['tileGrid']['extent'] : undefined,
					resolutions: params['tileGrid']['resolutions'],
					minZoom:
						params['tileGrid']['minZoom'] && typeof params['tileGrid']['minZoom'] === 'number'
							? params['tileGrid']['minZoom']
							: 0
				})
			}
			return new TileLayer({
				// @ts-ignore
				layerName: layerName,
				zIndex: params['zIndex'],
				visible: params['visible'] === false ? params['visible'] : true,
				opacity: params['opacity'] && typeof params['opacity'] === 'number' ? params['opacity'] : 1,
				source: new XYZ({
					wrapX: false,
					tileGrid: tileGrid,
					tileSize: tileSize,
					opaque: params['opaque'] === true ? params['opaque'] : false, // 图层是否不透明（主题相关）
					tilePixelRatio: params['tilePixelRatio'] ? params['tilePixelRatio'] : 1, // todo 对于高分辨率设备，例如苹果等可能2、3（移动端开发需要注意）
					projection: projection,
					maxZoom: params['maxZoom'] ? params['maxZoom'] : 18,
					minZoom: params['minZoom'] ? params['minZoom'] : 0,
					crossOrigin: params['crossOrigin'] ? params['crossOrigin'] : undefined,
					url: params['layerUrl']
				})
			})
		}
	}

	/**
	 * 创建OSM图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createOSMLayer(layerName, params, gis?) {
		if (params['create']) {
			return new TileLayer({
				// @ts-ignore
				layerName: layerName,
				zIndex: params['zIndex'],
				visible: params['visible'] === false ? params['visible'] : true,
				opacity: params['opacity'] && typeof params['opacity'] === 'number' ? params['opacity'] : 1,
				source: new OSM({
					wrapX: false,
					opaque: params['opaque'] === false ? params['opaque'] : true, // 图层是否不透明（主题相关）
					url: params['layerUrl']
						? params['layerUrl']
						: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					crossOrigin: params['crossOrigin'] ? params['crossOrigin'] : undefined
				})
			})
		}
	}

	/**
	 * 创建百度图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createBaiDuLayer(layerName, params) {
		if (params['create']) {
			return new TileLayer({
				// @ts-ignore
				layerName: layerName,
				zIndex: params['zIndex'],
				visible: params['visible'] === false ? params['visible'] : true,
				opacity: params['opacity'] && typeof params['opacity'] === 'number' ? params['opacity'] : 1,
				source: new Baidu(
					merge(params, {
						wrapX: false,
						projection: params['projection'] ? params['projection'] : 'EPSG:3857',
						origin: params['origin'] ? params['origin'] : [0, 0],
						opaque: params['opaque'] === false ? params['opaque'] : true, // 图层是否不透明（主题相关）
						url: params['layerUrl']
							? params['layerUrl']
							: 'http://online{0-3}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20170607&scaler=1&p=1',
						crossOrigin: params['crossOrigin'] ? params['crossOrigin'] : undefined
					})
				)
			})
		}
	}

	/**
	 * 创建高德图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createGaoDeLayer(layerName, params) {
		if (params['create']) {
			return new TileLayer({
				//@ts-ignore
				layerName: layerName,
				zIndex: params['zIndex'],
				visible: params['visible'] === false ? params['visible'] : true,
				opacity: params['opacity'] && typeof params['opacity'] === 'number' ? params['opacity'] : 1,
				source: new Gaode({
					wrapX: false,
					opaque: params['opaque'] === false ? params['opaque'] : true, // 图层是否不透明（主题相关）
					url: params['layerUrl']
						? params['layerUrl']
						: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
					crossOrigin: params['crossOrigin'] ? params['crossOrigin'] : undefined
				})
			})
		}
	}

	/**
	 * 创建谷歌图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createGoogleLayer(layerName, params) {
		if (params['create']) {
			return new TileLayer({
				//@ts-ignore
				layerName: layerName,
				zIndex: params['zIndex'],
				visible: params['visible'] === false ? params['visible'] : true,
				opacity: params['opacity'] && typeof params['opacity'] === 'number' ? params['opacity'] : 1,
				source: new Google({
					wrapX: false,
					opaque: params['opaque'] === false ? params['opaque'] : true, // 图层是否不透明（主题相关）
					url: params['layerUrl'],
					crossOrigin: params['crossOrigin'] ? params['crossOrigin'] : undefined
				})
			})
		}
	}

	/**
	 * 创建Mapbox矢量图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createMapboxVectorTileLayer(layerName, params, gis?) {
		if (params && params['layerUrl'] && params['create']) {
			let tileGrid = null
			let tileSize = 256
			if (params['tileSize'] && typeof params['tileSize'] === 'number') {
				tileSize = params['tileSize']
			} else if (
				params['tileGrid'] &&
				params['tileGrid']['tileSize'] &&
				typeof params['tileGrid']['tileSize'] === 'number'
			) {
				tileSize = params['tileGrid']['tileSize']
			}
			let projection = 'EPSG:3857'
			if (params['projection']) {
				projection = params['projection']
			} else {
				projection = CustomProjection.get(params['projection']).getCode()
			}
			if (params['tileGrid']) {
				/* eslint new-cap: ["error", { "newIsCap": false }] */
				// @ts-ignore
				tileGrid = new createXYZ({
					tileSize: tileSize,
					extent: params['tileGrid']['extent'] ? params['tileGrid']['extent'] : undefined,
					minZoom:
						params['tileGrid']['minZoom'] && typeof params['tileGrid']['minZoom'] === 'number'
							? params['tileGrid']['minZoom']
							: 0,
					maxZoom:
						params['tileGrid']['maxZoom'] && typeof params['tileGrid']['maxZoom'] === 'number'
							? params['tileGrid']['maxZoom']
							: 22
				})
			}
			// @ts-ignore
			return new VectorTileLayer({
				visible: params['visible'] === false ? params['visible'] : true,
				zIndex: params['zIndex'],
				renderBuffer:
					params['renderBuffer'] && typeof params['renderBuffer'] === 'number'
						? params['renderBuffer']
						: 100,
				renderMode: params['renderMode'] ? params['renderMode'] : 'hybrid', // 渲染方式image，hybrid，vector，性能由高到低
				extent: params['extent'] ? params['extent'] : undefined,
				opacity: params['opacity'] && typeof params['opacity'] === 'number' ? params['opacity'] : 1,
				minResolution:
					params['minResolution'] && typeof params['minResolution'] === 'number'
						? params['minResolution']
						: undefined,
				maxResolution:
					params['maxResolution'] && typeof params['maxResolution'] === 'number'
						? params['maxResolution']
						: undefined,
				preload: params['preload'] && typeof params['preload'] === 'number' ? params['preload'] : 0,
				source: new VectorTile({
					format: new MVT(),
					// @ts-ignore
					crossOrigin: params['crossOrigin'] ?? undefined,
					projection: projection,
					overlaps: params['overlaps'] ? params['overlaps'] : true,
					tileGrid: tileGrid && tileGrid instanceof TileGrid ? tileGrid : undefined,
					tilePixelRatio:
						params['tilePixelRatio'] && typeof params['tilePixelRatio'] === 'number'
							? params['tilePixelRatio']
							: 1,
					url: params['layerUrl'],
					wrapX: false
				})
				// style: MapboxStyle.createMapboxStreetsV6Style()
			})
		}
	}

	/**
	 * 创建图片类型图层
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createImageLayer(layerName, params, gis?) {
		if (params && params['layerUrl'] && params['create']) {
			let source = this.getImagesSource(params)
			return new ImageLayer({
				// @ts-ignore
				layerName: layerName,
				zIndex: params['zIndex'],
				extent: params['extent'] ? params['extent'] : undefined,
				visible: params['visible'] === false ? params['visible'] : true,
				opacity: params['opacity'] && typeof params['opacity'] === 'number' ? params['opacity'] : 1,
				source: source
			})
		}
	}

	/**
	 * 获取影像图层源
	 * @param params
	 * @returns {*}
	 */
	static getImagesSource(params) {
		let source = null
		let projection = CustomProjection.get(params['projection'])
		switch (params['sourceType']) {
			case 'ImageStatic':
				source = new Static({
					crossOrigin: params['crossOrigin'] ?? undefined,
					imageExtent: params['imageExtent'],
					projection: projection,
					imageSize: params['imageSize'] ?? undefined,
					url: params['layerUrl'],
					// @ts-ignore
					wrapX: false
				})
				break
			case 'ImageWMS':
				source = new ImageWMS({
					url: params['layerUrl'],
					crossOrigin: params['crossOrigin'] ? params['crossOrigin'] : undefined,
					params: {
						LAYERS: params['layers'], // require
						STYLES: params['styles'] ? params['styles'] : '',
						TYPE: params['type'] ? params['type'] : '',
						VERSION: params['version'] ? params['version'] : '1.3.0',
						WIDTH: params['width'] ? params['width'] : 256,
						HEIGHT: params['height'] ? params['height'] : 256,
						SRS: params['srs'] ? params['srs'] : 'EPSG:3857',
						CRS: params['srs'] ? params['srs'] : 'EPSG:3857',
						REQUEST: 'GetMap',
						TRANSPARENT: true,
						TILED: params['tiled'] === false ? params['tiled'] : true,
						TILESORIGIN: params['tiledsorrigin'] ?? undefined,
						SERVICE: 'WMS',
						FORMAT: params['format'] ? params['format'] : 'image/png',
						VIEWPARAMS: params['viewparams'] ? params['viewparams'] : ''
					},
					// @ts-ignore
					wrapX: false
				})
				break
			case 'Raster':
				// @ts-ignore
				source = new RasterSource()
				break
			case 'ImageMapGuide':
				source = new ImageMapGuide({
					url: params['layerUrl'],
					// @ts-ignore
					wrapX: false,
					displayDpi:
						params['displayDpi'] && typeof params['displayDpi'] === 'number'
							? params['displayDpi']
							: 96,
					metersPerUnit:
						params['metersPerUnit'] && typeof params['metersPerUnit'] === 'number'
							? params['metersPerUnit']
							: 1,
					hidpi: params['hidpi'] && typeof params['hidpi'] === 'boolean' ? params['hidpi'] : true,
					useOverlay:
						params['useOverlay'] && typeof params['useOverlay'] === 'boolean'
							? params['useOverlay']
							: undefined,
					projection: params['projection'] ? params['projection'] : 'EPSG:3857',
					ratio: params['ratio'] && typeof params['ratio'] === 'number' ? params['ratio'] : 1,
					resolutions:
						params['resolutions'] && Array.isArray(params['resolutions'])
							? params['resolutions']
							: undefined,
					imageLoadFunction:
						params['imageLoadFunction'] && typeof params['imageLoadFunction'] === 'function'
							? params['imageLoadFunction']
							: undefined,
					params:
						params['params'] && typeof params['params'] === 'object' ? params['params'] : undefined
				})
				break
			case 'ImageCanvas':
				source = new ImageCanvasSource({
					projection: params['projection'] ? params['projection'] : 'EPSG:3857',
					ratio: params['ratio'] && typeof params['ratio'] === 'number' ? params['ratio'] : 1,
					resolutions:
						params['resolutions'] && Array.isArray(params['resolutions'])
							? params['resolutions']
							: undefined,
					canvasFunction: params['canvasFunction'],
					state: params['state'] ? params['state'] : undefined,
					// @ts-ignore
					wrapX: false
				})
				break
			case 'ImageArcGISRest':
				source = new ImageArcGISRest({
					url: params['layerUrl'],
					hidpi: params['hidpi'] && typeof params['hidpi'] === 'boolean' ? params['hidpi'] : true,
					crossOrigin: params['crossOrigin'] ? params['crossOrigin'] : undefined,
					projection: params['projection'] ? params['projection'] : 'EPSG:3857',
					ratio: params['ratio'] && typeof params['ratio'] === 'number' ? params['ratio'] : 1,
					resolutions:
						params['resolutions'] && Array.isArray(params['resolutions'])
							? params['resolutions']
							: undefined,
					imageLoadFunction:
						params['imageLoadFunction'] && typeof params['imageLoadFunction'] === 'function'
							? params['imageLoadFunction']
							: undefined,
					params:
						params['params'] && typeof params['params'] === 'object' ? params['params'] : undefined,
					// @ts-ignore
					wrapX: false
				})
				break
			default:
				console.log('sourceType类型未传！')
				return false
		}
		return source
	}

	/**
	 * 获取图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	static create(layerConfig, gis?: object) {
		const layerType: ImageryType = layerConfig['layerType'] as ImageryType
		const layerName: string = layerConfig['layerName'] ?? undefined
		switch (layerType) {
			case ImageryType.TileXYZ:
				return ImageryLayerFactory.createXYZLayer(layerName, layerConfig, gis)
				break
			case ImageryType.TileWMTS:
				return ImageryLayerFactory.createWMTSLayer(layerName, layerConfig, gis)
				break
			case ImageryType.OSM:
				return ImageryLayerFactory.createOSMLayer(layerName, layerConfig, gis)
				break
			case ImageryType.ImageWMS:
				return ImageryLayerFactory.createImageWMSLayer(layerName, layerConfig, gis)
				break
			case ImageryType.TileWMS:
				return ImageryLayerFactory.createTileWMSLayer(layerName, layerConfig, gis)
				break
			case ImageryType.MapboxVectorTile:
				return ImageryLayerFactory.createMapboxVectorTileLayer(layerName, layerConfig, gis)
				break
			case ImageryType.TileArcGISRest:
				return ImageryLayerFactory.createTitleLayer(layerName, layerConfig, gis)
				break
			case ImageryType.BaiDu:
				return ImageryLayerFactory.createBaiDuLayer(layerName, layerConfig)
				break
			case ImageryType.GaoDe:
				return ImageryLayerFactory.createGaoDeLayer(layerName, layerConfig)
				break
			case ImageryType.Google:
				return ImageryLayerFactory.createGoogleLayer(layerName, layerConfig)
				break
			case ImageryType.ImageLayer:
				return ImageryLayerFactory.createXYZLayer(layerName, layerConfig, gis)
				break
			default:
				throw new Error('不支持的图层类型！')
				break
		}
	}
}
