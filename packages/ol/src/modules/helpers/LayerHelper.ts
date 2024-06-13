import {Group as LayerGroup} from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Circle, Fill, Stroke, Style} from 'ol/style'
import {Feature} from 'ol'

export default class LayerHelper {
	/**
	 * 获取所有图层（内部处理）
	 * @param layers
	 * @returns {Array}
	 */
	static getAllLayersInternal = function (layers) {
		let _target = []
		if (layers.length > 0) {
			layers.forEach((layer) => {
				if (layer instanceof LayerGroup) {
					let layers = layer.getLayers().getArray()
					let _layer = LayerHelper.getAllLayersInternal(layers)
					if (_layer) {
						_target = _target.concat(_layer)
					}
				} else {
					_target.push(layer)
				}
			})
		}
		return _target
	}

	/**
	 * 获取所有图层（将图层组里面的图层解析出来）
	 * @returns {Array}
	 */
	static getAllLayers = function (map) {
		let targetLayers = []
		if (map) {
			const layers = map.getLayers().getArray()
			targetLayers = LayerHelper.getAllLayersInternal(layers)
		}
		return targetLayers
	}

	/**
	 * 通过layerName获取图层
	 * @param map
	 * @param layerName
	 * @returns {*}
	 */
	static getLayerByLayerName = function (map, layerName) {
		let targetLayer = null
		if (map) {
			const layers = map.getLayers().getArray()
			targetLayer = LayerHelper.getLayerInternal(layers, 'layerName', layerName)
		}
		return targetLayer
	}

	/**
	 * 内部处理获取图层方法
	 * @param layers
	 * @param key
	 * @param value
	 * @returns {*}
	 */
	static getLayerInternal = function (layers, key, value) {
		let _target = null
		if (layers.length > 0) {
			layers.every((layer) => {
				if (layer instanceof LayerGroup) {
					let layers = layer.getLayers().getArray()
					_target = LayerHelper.getLayerInternal(layers, key, value)
					if (_target) {
						return false
					} else {
						return true
					}
				} else if (layer.get(key) === value) {
					_target = layer
					return false
				} else {
					return true
				}
			})
		}
		return _target
	}

	/**
	 * 根据相关键值键名获取图层集合
	 * @param layers
	 * @param key
	 * @param value
	 * @returns {Array}
	 */
	static getLayersArrayInternal = function (layers, key, value) {
		let _target = []
		if (layers.length > 0) {
			layers.forEach((layer) => {
				// console.log('%c layer', 'color: red;');
				// console.log(layer, key, value)
				if (layer instanceof LayerGroup) {
					let layers = layer.getLayers().getArray()
					let _layer = LayerHelper.getLayersArrayInternal(layers, key, value)
					if (_layer) {
						_target = _target.concat(_layer)
					}
				} else if (layer.get(key) === value) {
					_target.push(layer)
				}
			})
		}
		return _target
	}

	/**
	 * 通过键名键值获取图层（注意键名键值必须是set(key, value)）
	 * @param map
	 * @param key
	 * @param value
	 */
	static getLayerByKeyValue = function (map, key, value) {
		let targetLayer = null
		if (map) {
			const layers = map.getLayers().getArray()
			targetLayer = LayerHelper.getLayerInternal(layers, key, value)
		}
		return targetLayer
	}

	/**
	 * 通过键名键值获取图层集合（注意键名键值必须是set(key, value)）
	 * @param map
	 * @param key
	 * @param value
	 */
	static getLayersArrayByKeyValue = function (map, key, value) {
		let targetLayers = []
		console.log('%c 通过键名键值获取图层集合', 'color: red;')
		if (map) {
			let layers = map.getLayers().getArray()
			targetLayers = LayerHelper.getLayersArrayInternal(layers, key, value)
			console.log('layers', layers, targetLayers)
		}
		return targetLayers
	}

	/**
	 * 通过要素获取图层
	 * @param map
	 * @param feature
	 * @returns {*}
	 */
	static getLayerByFeature = function (map, feature) {
		let targetLayer
		if (map && feature instanceof Feature) {
			const layers = map.getLayers().getArray()
			targetLayer = LayerHelper._getLayerByFeatureInternal(layers, feature)
		}
		return targetLayer
	}

	/**
	 * 处理要素获取图层方法
	 * @param layers
	 * @param feature
	 * @returns {*}
	 * @private
	 */
	static _getLayerByFeatureInternal = function (layers, feature) {
		let _target
		layers.every((layer) => {
			if (layer && layer instanceof VectorLayer && layer.getSource) {
				let source = layer.getSource()
				if (source.getFeatures) {
					let features = source.getFeatures()
					features.every((feat) => {
						if (feat === feature) {
							_target = layer
							return false
						} else {
							return true
						}
					})
				}
				return !_target
			} else if (layer instanceof LayerGroup) {
				let layers = layer.getLayers().getArray()
				_target = LayerHelper._getLayerByFeatureInternal(layers, feature)
				if (_target) {
					return false
				} else {
					return true
				}
			} else {
				return true
			}
		})
		return _target
	}

	/**
	 * 创建临时图层
	 * @param map
	 * @param layerName
	 * @param params
	 * @returns {*}
	 */
	static createVectorLayer = function (map, layerName, params) {
		if (map) {
			let vectorLayer = LayerHelper.getLayerByLayerName(map, layerName)
			if (!(vectorLayer instanceof VectorLayer)) {
				vectorLayer = null
			}
			if (!vectorLayer) {
				if (params && params.create) {
					vectorLayer = new VectorLayer({
						// @ts-ignore
						layerName: layerName,
						declutter: params['declutter'],
						renderMode: params['renderMode'],
						renderOrder: params['renderOrder'],
						renderBuffer: params['renderBuffer'],
						updateWhileAnimating: params['updateWhileAnimating'],
						updateWhileInteracting: params['updateWhileInteracting'],
						params: params,
						layerType: 'vector',
						source: new VectorSource({
							wrapX: false
						}),
						style: new Style({
							fill: new Fill({
								color: 'rgba(67, 110, 238, 0.4)'
							}),
							stroke: new Stroke({
								color: '#4781d9',
								width: 2
							}),
							image: new Circle({
								radius: 7,
								fill: new Fill({
									color: '#ffcc33'
								})
							})
						}),
						zIndex: params['zIndex'] ?? 1
					})
				}
			}
			if (map && vectorLayer) {
				if (params && params.hasOwnProperty('selectable')) {
					vectorLayer.set('selectable', params.selectable)
				}
				// 图层只添加一次
				let _vectorLayer = LayerHelper.getLayerByLayerName(map, layerName)
				if (!_vectorLayer || !(_vectorLayer instanceof VectorLayer)) {
					map.addLayer(vectorLayer)
				}
			}
			return vectorLayer
		}
	}
}
