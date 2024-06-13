import Control from 'ol/control/Control'
import Interaction from 'ol/interaction/Interaction'
import {Map as olMap, View} from 'ol'
import LayerEvent from '../event/type/LayerEvent'
import {LayerEventType, LayerGroupEventType} from '../event/EventType'
import LayerGroupEvent from '../event/type/LayerGroupEvent'
import LayerHelper from './LayerHelper'
import ImageryType from '../imagery/ImageryType'
import TileLayer from 'ol/layer/Tile'
import ImageLayer from 'ol/layer/Image'
import VectorTileLayer from 'ol/layer/VectorTile'
import CustomProjection from '../proj/CustomProjection'

export default class Global {
	public _delegate: any | olMap = null //实例化地图
	public _targetEl: HTMLElement | string
	public _view: any | View = null
	public _options: any | {} = {}
	public transform: any | {} = {}
	events
	selectInteraction
	moveInteraction
	currentSelectFeature
	lastSelectFeature
	public config = {
		INDEX_URL: 'https://xxxxx',
		API_URL: '',
		REQUIRE_ACCESS_TOKEN: true,
		ACCESS_TOKEN: null,
		INTERACTIONS: {
			altShiftDragRotate: true,
			doubleClickZoom: true,
			keyboard: true,
			mouseWheelZoom: true,
			shiftDragZoom: true,
			dragPan: true,
			pinchRotate: true,
			pinchZoom: true
		}
	}
	public _layerCache: Object
	public _layerGroupCache: Object
	//基础图层
	public _baseLayers: Array<any> = []
	public _labelLayers: Array<any> = []
	public _projection: any

	constructor(options) {
		this._layerCache = {}
		this._layerGroupCache = {}
		this._options = options
		// this._projection = CustomProjection.get(this._options?.view?.['projection'] || 'EPSG:3857')
		this._projection = new CustomProjection(this._options?.view?.['projection'] || 'EPSG:3857')
			?.projection
		if (options['extent']) this._projection.setExtent(options['extent'])
	}

	get projection() {
		return this._projection
	}

	get view() {
		return this._view
	}

	get baseLayers() {
		const baseLayerKey = 'isBase'
		const labelLayerKey = 'isBaseLabel'
		const _baseLayers = LayerHelper.getLayersArrayByKeyValue(this._delegate, baseLayerKey, true)
		const _labelLayers = LayerHelper.getLayersArrayByKeyValue(this._delegate, labelLayerKey, true)
		return _baseLayers.concat(_labelLayers)
	}

	get zoom() {
		return this.view.getZoom()
	}

	/**
	 * 更新底图和标准层
	 * @private
	 */
	updateBaseLayer() {
		const {
			baseLayerKey = 'isBase',
			labelLayerKey = 'isBaseLabel',
			// labelLayerKey='isLabelLayer',
			labelAliasKey = 'layerName',
			isDefaultKey = 'isDefault'
		} = this._options
		this._baseLayers = LayerHelper.getLayersArrayByKeyValue(this._delegate, baseLayerKey, true)

		this._labelLayers = LayerHelper.getLayersArrayByKeyValue(this._delegate, labelLayerKey, true)

		if (this._baseLayers && this._baseLayers.length > 0) {
			this._baseLayers.filter((_item) => {
				return !!_item
			})
		}
		if (this._labelLayers && this._labelLayers.length > 0) {
			this._labelLayers.filter((_item) => {
				return !!_item
			})
		}
	}

	/**
	 * 添加控件
	 * @param control
	 */
	addControl(control) {
		if (this._delegate && control instanceof Control) {
			this._delegate.addControl(control)
		} else {
			throw new Error('不存在地图或者传入控件对象有误！')
		}
	}

	/**
	 * 添加交互
	 * @param interaction
	 */
	addInteraction(interaction) {
		console.log('===================interaction======================================')
		if (this._delegate && interaction instanceof Interaction) {
			this._delegate.addInteraction(interaction)
		} else {
			throw new Error('不存在地图或者传入交互对象有误！')
		}
	}

	/**
	 * 添加服务 图层
	 * */
	addImagery(layer) {
		this._delegate.addLayer(layer)
	}

	/**
	 * 移除服务 图层
	 * */
	removeImagery(layer) {
		this._delegate.removeLayer(layer)
	}

	setLayerProperties(layer: string | any, key, value) {
		let target: any = layer
		if (typeof layer == 'string') {
			target = LayerHelper.getLayerByLayerName(this._delegate, layer)
		}
		console.log('target', target)
		target?.setProperties(key, value)
		return this
	}

	setLayerVisible(layer: string | any, visible: boolean = true) {
		let target: any = layer
		if (typeof layer == 'string') {
			target = LayerHelper.getLayerByLayerName(this._delegate, layer)
		}
		target?.setVisible(visible)
		return this
	}

	/**
	 * 添加图层
	 * @param layer
	 */
	addLayer(layer) {
		// console.log('layer',layer)
		// this._delegate.addLayer(layer);
		!this._layerCache?.[layer?.type] && (this._layerCache[layer?.type] = {})
		if (!Object(this._layerCache[layer?.type]).hasOwnProperty(layer.id)) {
			layer.fire(new LayerEvent(LayerEventType.ADD, this))
			this._layerCache[layer?.type][layer.id] = layer
		}
	}

	/**
	 * 移除图层
	 * @param layer
	 */
	removeLayer(layer) {
		if (Object(this._layerCache[layer?.type]).hasOwnProperty(layer.id)) {
			layer.fire(LayerEventType.REMOVE, this)
			delete this._layerCache[layer?.type][layer.id]
		}
	}

	/**
	 *
	 * @param layerGroup
	 * @returns {Viewer}
	 */
	addLayerGroup(layerGroup) {
		this._addLayerGroup(layerGroup)
		return this
	}

	/***
	 *
	 * @param layerGroup
	 * @private
	 */
	_addLayerGroup(layerGroup) {
		console.log('_addLayerGroup----', layerGroup)
		if (!Object(this._layerGroupCache).hasOwnProperty(layerGroup.id)) {
			layerGroup.fire(new LayerGroupEvent(LayerGroupEventType.ADD, this))
			this._layerGroupCache[layerGroup.id] = layerGroup
		}
	}

	/**
	 *
	 * @param layerGroup
	 * @returns {Viewer}
	 */
	removeLayerGroup(layerGroup) {
		this._removeLayerGroup(layerGroup)
		return this
	}

	/**
	 *
	 * @param layerGroup
	 * @private
	 */
	_removeLayerGroup(layerGroup) {
		if (Object(this._layerGroupCache).hasOwnProperty(layerGroup.id)) {
			layerGroup.fire(new LayerGroupEvent(LayerGroupEventType.REMOVE, this))
			delete this._layerGroupCache[layerGroup.id]
		}
	}

	/**
	 * 添加overlay
	 * @param overlay
	 */
	addOverlay(overlay) {
		this._delegate.addOverlay(overlay)
	}

	/**
	 * 移除overlay
	 * @param overlay
	 */
	removeOverlay(overlay) {
		this._delegate.removeOverlay(overlay)
	}

	/**
	 * 增加修订计数器并调用change事件
	 */
	changed() {
		this._delegate.changed()
	}

	/**
	 * 触发事件
	 * @param event
	 * @returns {boolean|undefined}
	 */
	dispatchEvent(event) {
		return this._delegate.dispatchEvent(event)
	}

	/**
	 * 查找像素位置最近的要素
	 * @param pixel
	 * @param callback
	 * @param options
	 * @returns {T|undefined}
	 */
	forEachFeatureAtPixel(pixel, callback, options) {
		return this._delegate.forEachFeatureAtPixel(pixel, callback, options)
	}

	/**
	 * 查找像素位置的图层
	 * @param pixel
	 * @param callback
	 * @param optThis
	 * @param optLayerFilter
	 * @param optThis2
	 * @returns {T|undefined}
	 */
	forEachLayerAtPixel(pixel, callback, optThis, optLayerFilter, optThis2) {
		return this._delegate.forEachLayerAtPixel(pixel, callback, optThis, optLayerFilter, optThis2)
	}

	/**
	 * 获取set的属性值
	 * @param key
	 */
	get(key) {
		return this._delegate.get(key)
	}

	/**
	 * 获取使用的控件
	 * @returns {ol.Collection.<Control>}
	 */
	getControls() {
		return this._delegate.getControls()
	}

	/**
	 * 获取开启的所有交互
	 * @returns {ol.Collection.<Interaction>}
	 */
	getInteractions() {
		return this._delegate.getInteractions()
	}

	/**
	 * 获取像素位置对应的坐标
	 * @param pixel
	 * @returns {ol.Coordinate}
	 */
	getCoordinateFromPixel(pixel) {
		return this._delegate.getCoordinateFromPixel(pixel)
	}

	/**
	 * 获取坐标对应的像素
	 * @param coordinate
	 * @returns {ol.Pixel}
	 */
	getPixelFromCoordinate(coordinate) {
		return this._delegate.getPixelFromCoordinate(coordinate)
	}

	/**
	 * 返回事件触发位置的坐标
	 * @param event
	 * @returns {ol.Coordinate}
	 */
	getEventCoordinate(event) {
		return this._delegate.getEventCoordinate(event)
	}

	/**
	 * 返回事件触发位置的像素
	 * @param event
	 * @returns {ol.Pixel}
	 */
	getEventPixel(event) {
		return this._delegate.getEventPixel(event)
	}

	/**
	 * 获取像素位置的所有要素
	 * @param pixel
	 * @param options
	 * @returns {Array.<ol.Feature|ol.render.Feature>}
	 */
	getFeaturesAtPixel(pixel, options) {
		return this._delegate.getFeaturesAtPixel(pixel, options)
	}

	/**
	 *
	 * @param id
	 * @returns {undefined}
	 */
	getLayerGroup(id) {
		return this._layerGroupCache[id] || undefined
	}

	/**
	 * Checks to see if the layer is included
	 * @param layer
	 * @returns {boolean}
	 */
	hasLayer(layer) {
		// eslint-disable-next-line no-prototype-builtins
		return Object(this._layerCache[layer?.type]).hasOwnProperty(layer.id)
	}

	/**
	 * Returns a layer by id
	 * @param id
	 * @returns {*|undefined}
	 */
	getLayer(id) {
		let filters = this.getLayers().filter((item) => item.id === id)
		return filters && filters.length ? filters[0] : undefined
	}

	/**
	 * 获取地图上所有图层
	 * @returns {!ol.Collection.<ol.layer.Base>}
	 */
	getLayers() {
		let result = []
		Object.keys(this._layerCache).forEach((type) => {
			let cache = this._layerCache[type]
			Object.keys(cache).forEach((layerId) => {
				result.push(cache[layerId])
			})
		})
		return result
	}

	/**
	 * 根据id获取Overlay
	 * @param id
	 * @returns {ol.Overlay}
	 */
	getOverlayById(id) {
		return this._delegate.getOverlayById(id)
	}

	/**
	 * 获取地图上所有的overlay
	 * @returns {ol.Collection.<ol.Overlay>}
	 */
	getOverlays() {
		return this._delegate.getOverlays()
	}

	/**
	 * 获取属性
	 * @returns {Object.<string, *>}
	 */
	getProperties() {
		return this._delegate.getProperties()
	}

	/**
	 * 获取修订计数器
	 * @returns {number}
	 */
	getRevision() {
		return this._delegate.getRevision()
	}

	/**
	 * 获取地图尺寸
	 * @returns {ol.Size|undefined}
	 */
	getSize() {
		return this._delegate.getSize()
	}

	/**
	 * 获取初始化地图的要素对象
	 * @returns {Element|string|undefined}
	 */
	getTarget() {
		return this._delegate.getTarget()
	}

	/**
	 * 获取目标对象
	 * @returns {Element}
	 */
	getTargetElement() {
		return this._delegate.getTargetElement()
	}

	/**
	 * 获取对象属性名称列表。
	 * @returns {Array.<string>}
	 */
	getKeys() {
		return this._delegate.getKeys()
	}

	/**
	 * 获取视图对象
	 * @returns {View}
	 */
	getView() {
		return this._delegate.getView()
	}

	/**
	 * 获取用作地图视口的元素
	 * @returns {Element}
	 */
	getViewport() {
		return this._delegate.getViewport()
	}

	/**
	 * 所在像素是否有要素
	 * @param pixel
	 * @param options
	 * @returns {boolean}
	 */
	hasFeatureAtPixel(pixel, options) {
		return this._delegate.hasFeatureAtPixel(pixel, options)
	}

	/**
	 * 移除控件
	 * @param control
	 * @returns {Control|undefined}
	 */
	removeControl(control) {
		return this._delegate.removeControl(control)
	}

	/**
	 * 移除交互
	 * @param interaction
	 * @returns {Interaction|undefined}
	 */
	removeInteraction(interaction) {
		return this._delegate.removeInteraction(interaction)
	}

	/**
	 * 手动调用渲染器
	 */
	render() {
		this._delegate.render()
	}

	/**
	 * 以同步方式请求（立即渲染）
	 * @param key
	 * @param value
	 * @param silent
	 */
	renderSync(key, value, silent) {
		this._delegate.renderSync(key, value, silent)
	}

	/**
	 * 设置图层组
	 * @param layerGroup
	 */
	setLayerGroup(layerGroup) {
		this._delegate.setLayerGroup(layerGroup)
	}

	/**
	 * 设置属性值
	 * @param values
	 * @param silent <更新而不触发事件>
	 */
	setProperties(values, silent) {
		this._delegate.setProperties(values, silent)
	}

	/**
	 * 设置地图大小
	 * @param size
	 */
	setSize(size) {
		this._delegate.setSize(size)
	}

	/**
	 * 设置地图所在目标元素
	 * @param target
	 */
	setTarget(target) {
		this._delegate.setTarget(target)
	}

	/**
	 * 获取当前地图
	 * @returns {Map|*}
	 */
	getMap() {
		return this._delegate
	}

	/**
	 * 设置地图实例
	 * @param map
	 */
	setMap(map) {
		if (map && map instanceof olMap) {
			this._delegate = map
		}
	}

	/**
	 * 重新设置视图
	 * @param view
	 */
	setView(view) {
		if (this._delegate && view instanceof View) {
			this._delegate.setView(view)
		} else {
			throw new Error('不存在地图或者传入视图对象有误！')
		}
	}

	/**
	 * 取消属性
	 * @param key
	 * @param silent
	 */
	unset(key, silent) {
		this._delegate.unset(key, silent)
	}

	/**
	 * 更新地图大小
	 * @returns {Map|*|null|_openlayers2.Map.default}
	 */
	updateSize() {
		if (this._delegate) {
			this._delegate.updateSize()
			return this._delegate
		} else {
			throw new Error('未实例化地图对象！')
		}
	}

	/**
	 * 移除选择交互的要素，避免清除不掉要素
	 * @param feature
	 * @param clearHole
	 * @private
	 */
	_removeSelectFeature(feature, clearHole) {
		if (this.selectInteraction) {
			const features = this.selectInteraction.getFeatures().getArray()
			if (features && features.length > 0) {
				for (let i = 0; i < features.length; i++) {
					if (clearHole) {
						this.selectInteraction.getFeatures().remove(features[i])
					} else if (!clearHole && features[i] === feature) {
						this.selectInteraction.getFeatures().remove(features[i])
					}
				}
			}
		}
	}

	/**
	 * 检查唯一性
	 */
	layerUnique(layerConfig: any) {
		let exitLayer = void 0

		const {
			addLayer = true,
			layerType = undefined,
			layerName = undefined,
			create = true
		} = layerConfig
		// console.log('layerUnique' , layerConfig,layerName)
		exitLayer = LayerHelper.getLayerByLayerName(this._delegate, layerName) ?? undefined

		if (exitLayer) {
			switch (layerType) {
				case ImageryType.TileWMS:
				case ImageryType.TileWMTS:
				case ImageryType.OSM:
				case ImageryType.TileArcGISRest:
				case ImageryType.BaiDu:
				case ImageryType.GaoDe:
				case ImageryType.Google:
					if (exitLayer instanceof TileLayer && addLayer) {
						this.removeLayer(exitLayer)
					}
					break

				case ImageryType.ImageWMS:
				case ImageryType.ImageLayer:
					if (exitLayer instanceof ImageLayer && addLayer) {
						this.removeLayer(exitLayer)
					}
					break
				case ImageryType.MapboxVectorTile:
					if (exitLayer instanceof VectorTileLayer && addLayer) {
						this.removeLayer(exitLayer)
					}
					break
			}
		}
		return exitLayer
	}

	/**
	 * Adds a plugin
	 * @param plugin
	 * @returns {Map}
	 */
	_use(plugin) {
		if (plugin && plugin.install) {
			plugin.install(this)
		}
		return this
	}

	/** 销毁*/
	destroy() {
		this._delegate && this._delegate.destroy && this._delegate.destory()
		this._delegate && this._delegate.dispose && this._delegate.dispose()
		this._delegate = null
		this._view = null
	}
}
