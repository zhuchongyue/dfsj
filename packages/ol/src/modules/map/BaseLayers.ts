/**
 * @desc 底图相关处理
 */
import OSM from 'ol/source/OSM'
import {Group as LayerGroup, Tile as TileLayer} from 'ol/layer'
import Attribution from 'ol/control/Attribution'
import {toConsumableArray} from '../utils/common'
import ImageryLayerFactory from '../imagery/ImageryLayerFactory'
import {Mixin} from 'ts-mixer'
import Global from '../helpers/Global'

class BaseLayer extends Mixin(Global) {
	/**
	 * 添加底图
	 * @param params
	 * @returns {[*]}
	 */
	addBaseLayer(params = []) {
		if (!params || !Array.isArray(params) || params.length <= 0) {
			return [
				new LayerGroup({
					layers: [
						new TileLayer({
							source: new OSM()
						})
					],
					// @ts-ignore
					isBaseLayer: true
				})
			]
		} else {
			// console.log('创建图层组')
			return [
				new LayerGroup({
					layers: this._getBaseLayerGroup(params),
					// @ts-ignore
					isBaseLayer: true
				})
			]
		}
	}

	/**
	 * 切换底图
	 * */
	changeBaseLayer(key, value) {
		this.updateBaseLayer()

		console.log('key, value', key, value)
		console.log('###_baseLayers', this._baseLayers)
		console.log('###_labelLayers', this._labelLayers)
		if (this._baseLayers.length > 0) {
			if (this._labelLayers && this._labelLayers.length > 0) {
				// 处理标注层
				this._labelLayers.forEach((labelLayer) => {
					if (labelLayer && labelLayer.get(this._options.labelAliasKey) === value) {
						labelLayer.setVisible(true)
					} else {
						labelLayer.setVisible(false)
					}
				})
			}
			this._baseLayers.forEach((layer) => {
				if (layer && layer.get(key) === value) {
					layer.setVisible(true)
					// layer.set(this._options.isDefaultKey, true);
					layer.set('isDefault', true)
				} else {
					layer.setVisible(false)
					// layer.set(this._options.isDefaultKey, false);
					layer.set('isDefault', false)
				}
			})
		} else {
			throw new Error('请检查是否存在底图获取底图数量是否和配置相同！')
		}
	}

	/**
	 * 获取图层组
	 * @returns {ol.layer.Group}
	 */
	_getBaseLayerGroup(layerConfigs) {
		let [layers, labelLayers, _layers, labelLayersConfig] = [[], [], [], []]
		if (layerConfigs && Array.isArray(layerConfigs) && layerConfigs.length > 0) {
			layerConfigs.forEach((_config) => {
				if (_config['layerName'] && _config['layerUrl'] && _config['layerType']) {
					// console.log(layerConfigs)
					// console.log('标注层',_config['label'] ,typeof _config['label'] === 'object')
					this.layerUnique(_config)
					let layer = this._getLayer(_config)
					if (_config['addLayer']) this.addLayer(layer)
					if (layer) layers.push(layer)
					if (_config['label'] && Array.isArray(_config['label'])) {
						_config['label'].forEach((_label) => {
							if (_label['layerName'] && _label['layerUrl'] && _label['layerType']) {
								labelLayersConfig.push(_label)
							}
						})
					} else if (typeof _config['label'] === 'object') {
						// 处理多个标注层的情况
						labelLayersConfig.push(_config['label'])
					}
				}
			})
		}
		labelLayers = this._getBaseLayerLabel(labelLayersConfig)
		_layers = layers.concat(labelLayers)
		return _layers
	}

	/**
	 * 主要处理标注层
	 * @param labelLayersConfig
	 * @returns {null}
	 * @private
	 */
	_getBaseLayerLabel(labelLayersConfig) {
		// console.log({labelLayersConfig})
		let [labelLayers, _labelLayersLayerNames] = [[], new Set()]
		if (labelLayersConfig && Array.isArray(labelLayersConfig) && labelLayersConfig.length > 0) {
			labelLayersConfig.forEach((config) => {
				if (config['layerName'] && config['layerUrl'] && config['layerType']) {
					_labelLayersLayerNames.add(config['layerName'])
				}
			})
			const layers = [...toConsumableArray(_labelLayersLayerNames)]
			// console.log({layers})
			layers.forEach((layerName) => {
				labelLayersConfig.every((configM) => {
					if (configM && configM['layerName'] === layerName) {
						this.layerUnique(configM)
						let labelLayer = this._getLayer(configM)
						if (labelLayer) labelLayers.push(labelLayer)
						if (configM['addLayer']) this.addLayer(labelLayer)
						return false
					}
					return true
				})
			})
		}
		return labelLayers
	}

	/**
	 * 获取图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_getLayer(layerConfig) {
		const layerType = layerConfig['layerType']
		// console.log('layerType',layerType)
		switch (layerType) {
			case 'TileXYZ':
				return this._getXYZLayer(layerConfig)
				break
			case 'TileWMTS':
				return this._getWMTSLayer(layerConfig)
				break
			case 'OSM':
				return this._getOSMLayer(layerConfig)
				break
			case 'ImageWMS':
				return this._getImageWMSLayer(layerConfig)
				break
			case 'TileWMS':
				return this._getTileWMSLayer(layerConfig)
				break
			case 'MapboxVectorTile':
				return this._getMapboxVectorTileLayer(layerConfig)
				break
			case 'TileArcGISRest':
				return this._getTileArcGISRestLayer(layerConfig)
				break
			case 'BaiDu':
				return this._getBaiDuLayer(layerConfig)
				break
			case 'GaoDe':
				return this._getGaoDeLayer(layerConfig)
				break
			case 'Google':
				return this._getGoogleLayer(layerConfig)
				break
			case 'ImageLayer':
				return this._getImageLayer(layerConfig)
				break
			default:
				throw new Error('不支持的图层类型！')
				break
		}
	}

	/**
	 * 获取标准XYZ图层
	 * @param layerConfig
	 * @returns {ol.layer.Tile}
	 * @private
	 */
	_getXYZLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		if (!layerConfig.hasOwnProperty('tileGrid')) {
			layerConfig['tileGrid'] = {}
		}
		let layer = ImageryLayerFactory.createXYZLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 加载开源OSM图层
	 * @param layerConfig
	 * @returns {ol.layer.Tile}
	 * @private
	 */
	_getOSMLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createOSMLayer(layerName, layerConfig)
		// console.log('layer',layer)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 加载百度图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_getBaiDuLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createBaiDuLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 加载高德图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_getGaoDeLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createGaoDeLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 加载google图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_getGoogleLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createGoogleLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 获取标准WMTS图层
	 * @param layerConfig
	 * @returns {ol.layer.Tile}
	 * @private
	 */
	_getWMTSLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createWMTSLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * Images WMS 方式加载
	 * @param layerConfig
	 * @private
	 */
	_getImageWMSLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createImageWMSLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * Title WMS 方式加载
	 * @param layerConfig
	 * @returns {ol.layer.Tile}
	 * @private
	 */
	_getTileWMSLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createTileWMSLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 添加MapBox的矢量图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_getMapboxVectorTileLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createMapboxVectorTileLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 创建arcgis矢量渲染图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_getTileArcGISRestLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createTitleLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 获取静态图层
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_getImageLayer(layerConfig) {
		let layerName = layerConfig['layerName'] || ''
		layerConfig['addLayer'] = false
		layerConfig['create'] = true
		let layer = ImageryLayerFactory.createImageLayer(layerName, layerConfig)
		layer = this._addLayerAlias(layer, layerConfig)
		return layer
	}

	/**
	 * 添加底图标识
	 * @param layer
	 * @param layerConfig
	 * @returns {*}
	 * @private
	 */
	_addLayerAlias(layer, layerConfig) {
		const isDefault = layerConfig['isDefault'] === true ? layerConfig['isDefault'] : false
		layer.set('isDefault', isDefault)
		layer.set('isBaseLayer', true)
		//FIXME 增加字段
		layer.set('isBase', layerConfig['isBase'])
		layer.set('isBaseLabel', layerConfig['isBaseLabel'])

		layer.setVisible(isDefault)
		layer.set('alias', layerConfig['alias'] ? layerConfig['alias'] : '')
		layer.getSource().setAttributions(this._getAttribution(layerConfig['attribution']))
		// console.log({layer})
		return layer
	}

	/**
	 * 获取版权信息
	 * @returns {Xr.Attribution|Jr.Attribution|Wr.Attribution|*|Attribution|ol.control.Attribution}
	 * @private
	 */
	_getAttribution(params) {
		let attribution
		if (params === true) {
			params = {}
			params['url'] = this.config.INDEX_URL
			params['messages'] = 'contributors.'
			params['title'] = 'ol-map'
			attribution = new Attribution({
				target:
					'&copy; ' +
					'<a href="' +
					params['url'] +
					'">' +
					params['title'] +
					'</a> ' +
					params['messages']
			})
		} else if (typeof params === 'object') {
			attribution = new Attribution({
				target:
					'&copy; ' +
					'<a href="' +
					params['url'] +
					'">' +
					params['title'] +
					'</a> ' +
					params['messages']
			})
		}
		return attribution
	}
}

export default BaseLayer
