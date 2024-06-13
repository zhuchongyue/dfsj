import Layer from './Layer'
import Util from '../utils/Util'
import State from '../state/State'
import {Observable} from 'ol'
import {LayerGroupEventType} from '../event/EventType'

class LayerGroup extends Observable {
	public _id: any
	public _cache: any
	public _show: any
	public _map: any
	public _state: any

	constructor(id) {
		super()
		this._id = id || Util.uuid()
		this._cache = {}
		this._show = true
		this._map = undefined
		// this._layerGroupEvent = new LayerGroupEvent()
		// @ts-ignore
		this.on(LayerGroupEventType.ADD, this._onAdd, this)
		// @ts-ignore
		this.on(LayerGroupEventType.REMOVE, this._onRemove, this)
		this._state = State.INITIALIZED
	}

	get id() {
		return this._id
	}

	get type() {
		return Layer.getLayerType('layer_group')
	}

	set show(show) {
		this._show = show
		Object.keys(this._cache).forEach((key) => {
			this._cache[key].show = this._show
		})
	}

	get show() {
		return this._show
	}

	// get layerGroupEvent() {
	//   // return this._layerGroupEvent
	// }

	get state() {
		return this._state
	}

	/**
	 *
	 * @param viewer
	 * @private
	 */
	_onAdd(event) {
		console.log('添加图层组', event)
		this._map = event.map
		Object.keys(this._cache).forEach((key) => {
			this._map.addLayer(this._cache[key])
		})
		this._state = State.ADDED
	}

	/**
	 *
	 * @private
	 */
	_onRemove() {
		console.log('移除图层组', this._cache)
		Object.keys(this._cache).forEach((key) => {
			this._map && this._map.removeLayer(this._cache[key])
		})
		this._cache = {}
		this._state = State.REMOVED
	}

	/**
	 * Adds a layer
	 * @param layer
	 * @returns {LayerGroup}
	 */
	addLayer(layer) {
		if (!Object(this._cache).hasOwnProperty(layer.id)) {
			this._cache[layer.id] = layer
			this._map && this._map.addLayer(layer)
		}
		return this
	}

	/**
	 * Removes a layer
	 * @param layer
	 * @returns {LayerGroup}
	 */
	removeLayer(layer) {
		if (Object(this._cache).hasOwnProperty(layer.id)) {
			this._map && this._map.removeLayer(layer)
			delete this._cache[layer.id]
		}
		return this
	}

	/**
	 * Returns a layer by id
	 * @param id
	 * @returns {*|undefined}
	 */
	getLayer(id) {
		return this._cache[id] || undefined
	}

	/**
	 * Returns all layers
	 * @returns {[]}
	 */
	getLayers() {
		let result = []
		Object.keys(this._cache).forEach((key) => {
			result.push(this._cache[key])
		})
		return result
	}

	/**
	 * Adds to the viewer
	 * @param viewer
	 * @returns {LayerGroup}
	 */
	addTo(viewer) {
		if (viewer && viewer.addLayerGroup) {
			viewer.addLayerGroup(this)
		}
		return this
	}

	/**
	 *
	 * @returns {LayerGroup}
	 */
	remove() {
		this._map && this._map.removeLayerGroup(this)
		return this
	}

	fire(event) {
		// @ts-ignore
		this.dispatchEvent(event)
	}

	listen(type, callback, context) {
		this.on(type, callback)
		return this
	}

	off(type, callback, context) {
		this.un(type, callback)
		return this
	}
}

Layer.registerType('layer_group')

export default LayerGroup
