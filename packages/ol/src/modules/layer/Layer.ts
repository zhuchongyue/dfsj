/***
 * 图层
 */
// import { Cesium } from '@dfsj-cesium-modules/namespace'
// import { Util } from '@dfsj-cesium-modules/utils'
// import State from '@dfsj-cesium-modules/state/State'
// import { LayerEventType, OverlayEventType, LayerEvent } from '@dfsj-cesium-modules/event'
import LayerType from './LayerType'
import Util from '../utils/Util'
import {Observable} from 'ol'
import {LayerEventType, OverlayEventType} from '../event/EventType'
import State from '../state/State'
import VectorLayer from 'ol/layer/Vector'
import OverlayEvent from '../event/type/OverlayEvent'
import GraphicAnimationImp from '../effect/GraphicAnimationImp'

class Layer extends Observable {
	public _id: string
	public _bid: string
	public _delegate: any
	public _map: any
	public _state: any
	public _visible: boolean
	public _cache: {}
	public _attr: {}
	public _layerEvent: any
	public _animation: any
	public _dynamic: boolean = false
	public _buffer: any

	constructor(id) {
		super()
		this._id = Util.uuid()
		this._bid = id || Util.uuid()
		this._delegate = undefined
		this._map = undefined
		this._state = undefined
		this._visible = true
		this._cache = {}
		this._attr = {}
		this._layerEvent = {}
		this._buffer = []
		this._animation = new GraphicAnimationImp()

		// @ts-ignore
		this.on(LayerEventType.ADD, this._onAdd, this)
		// @ts-ignore
		this.on(LayerEventType.REMOVE, this._onRemove, this)
	}

	get dynamic() {
		return this._dynamic
	}

	set dynamic(b: boolean) {
		this._dynamic = b
	}

	get source() {
		return this._delegate?.getSource?.() || null
	}

	get animation() {
		return this._animation
	}

	get layerId() {
		return this._id
	}

	get id() {
		return this._bid
	}

	get delegate() {
		return this._delegate
	}

	set show(show) {
		this._visible = show
		this._delegate && (this._delegate.show = this._visible)
	}

	get show() {
		return this._visible
	}

	get layerEvent() {
		return this._layerEvent
	}

	set attr(attr) {
		this._attr = attr
	}

	get attr() {
		return this._attr
	}

	get state() {
		return this._state
	}

	/**
	 * The hook for added
	 * @public
	 */
	_addedHook() {}

	/**
	 * The hook for removed
	 * @public
	 */
	_removedHook() {}

	/**
	 * The layer added callback function
	 * Subclasses need to be overridden
	 * @param viewer
	 * @public
	 */
	_onAdd(event) {
		// console.log({event})
		console.log('.///////////////////////////////////////', event)
		this._map = event.map
		if (!this._delegate) {
			return
		}
		if (this._delegate instanceof VectorLayer) {
			this._map?._delegate?.addLayer(this._delegate)
		}
		this._addedHook && this._addedHook()
		this._state = State.ADDED
	}

	/**
	 * The layer added callback function
	 * Subclasses need to be overridden
	 * @public
	 */
	_onRemove() {
		if (!this._delegate) {
			return
		}
		if (this._map) {
			this._cache = {}
			if (this._delegate instanceof VectorLayer) {
				this._map?._delegate?.removeLayer(this._delegate)
			}
			this._removedHook && this._removedHook()
			this._state = State.REMOVED
		}
	}

	/**
	 * The layer add overlay
	 * @param overlay
	 * @public
	 */
	_addOverlay(overlay) {
		if (!this._cache.hasOwnProperty(overlay.overlayId)) {
			this._cache[overlay.overlayId] = overlay
			this._delegate && overlay.fire(new OverlayEvent(OverlayEventType.ADD, this))
			if (this._state === State.CLEARED) {
				this._state = State.ADDED
			}
		}
	}

	/**
	 * The layer remove overlay
	 * @param overlay
	 * @public
	 */
	_removeOverlay(overlay) {
		if (this._cache.hasOwnProperty(overlay.overlayId)) {
			this._delegate && overlay.fire(OverlayEventType.REMOVE, this)
			delete this._cache[overlay.overlayId]
		}
	}

	/**
	 * Add overlay
	 * @param overlay
	 * @returns {Layer}
	 */
	addOverlay(overlay) {
		this._addOverlay(overlay)
		return this
	}

	/**
	 * Add overlays
	 * @param overlays
	 * @returns {Layer}
	 */
	addOverlays(overlays) {
		if (Array.isArray(overlays)) {
			overlays.forEach((item) => {
				this._addOverlay(item)
			})
		}
		return this
	}

	/**
	 * Remove overlay
	 * @param overlay
	 * @returns {Layer}
	 */
	removeOverlay(overlay) {
		this._removeOverlay(overlay)
		return this
	}

	/**
	 * Returns the overlay by overlayId
	 * @param overlayId
	 * @returns {*|undefined}
	 */
	getOverlay(overlayId) {
		return this._cache[overlayId] || undefined
	}

	/**
	 * Returns the overlay by bid
	 * @param id
	 * @returns {any}
	 */
	getOverlayById(id) {
		let overlay = undefined
		Object.keys(this._cache).forEach((key) => {
			if (this._cache[key].id === id) {
				overlay = this._cache[key]
			}
		})
		return overlay
	}

	/**
	 * Returns the overlays by attrName and AttrVal
	 * @param attrName
	 * @param attrVal
	 * @returns {[]}
	 */
	getOverlaysByAttr(attrName, attrVal) {
		let result = []
		this.eachOverlay((item) => {
			if (item.attr[attrName] === attrVal) {
				result.push(item)
			}
		}, this)
		return result
	}

	/**
	 * Iterate through each overlay and pass it as an argument to the callback function
	 * @param method
	 * @param context
	 * @returns {Layer}
	 */
	eachOverlay(method, context) {
		Object.keys(this._cache).forEach((key) => {
			method && method.call(context || this, this._cache[key])
		})
		return this
	}

	/**
	 * Returns all overlays
	 * @returns {[]}
	 */
	getOverlays() {
		let result = []
		Object.keys(this._cache).forEach((key) => {
			result.push(this._cache[key])
		})
		return result
	}

	/**
	 * Clears all overlays
	 * Subclasses need to be overridden
	 */
	clear() {}

	/**
	 * Removes from the viewer
	 */
	remove() {
		if (this._map) {
			// this._map.removeLayer(this)
		}
	}

	/**
	 * Adds to the viewer
	 * @param viewer
	 * @returns {Layer}
	 */
	addTo(viewer) {
		if (viewer?.addLayer) {
			viewer.addLayer(this)
		}
		return this
	}

	/**
	 * sets the style, the style will apply to every overlay of the layer
	 * Subclasses need to be overridden
	 * @param style
	 */
	setStyle(style) {}

	/**
	 * Subscribe event
	 * @param type
	 * @param callback
	 * @param context
	 * @returns {Layer}
	 */
	listen(type, callback, context) {
		console.log('ddddddddddddddd', this, callback, context)
		this._layerEvent.on(type, callback, context || this)
		return this
	}

	/**
	 * Unsubscribe event
	 * @param type
	 * @param callback
	 * @param context
	 * @returns {Layer}
	 */
	off(type, callback, context) {
		this._layerEvent.off(type, callback, context || this)
		return this
	}

	/**
	 * Trigger subscription event
	 * @param type
	 * @param params
	 * @returns {Layer}
	 */
	fire(event) {
		// console.log(event)
		// this._layerEvent.fire(type, params)
		// @ts-ignore
		this.dispatchEvent(event)
		// return this
	}

	/**
	 * Registers Type
	 * @param type
	 */
	static registerType(type) {
		if (type) {
			LayerType[type.toLocaleUpperCase()] = type.toLocaleLowerCase()
		}
	}

	/**
	 * Returns type
	 * @param type
	 * @returns {*|undefined}
	 */
	static getLayerType(type) {
		return LayerType[type.toLocaleUpperCase()] || undefined
	}
}

export default Layer
