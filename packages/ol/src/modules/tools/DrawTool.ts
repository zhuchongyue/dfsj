/**
 * 默认的配置
 */
import {MouseEventType, PlotEventType} from '../event/EventType'
import {Observable} from 'ol'
import {unByKey} from 'ol/Observable'
import {VectorLayer} from '../layer'
import PlotEvent from '../event/type/PlotEvent'
import {Point} from '../overlay'
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom'

const DEF_OPTS = {}

class DrawTool extends Observable {
	public _map: any
	public _anchorLayer: any
	public _tooltipMess: undefined
	public _options: {}
	public _floatingAnchor: any
	public clickListener: any
	public pointerMoveListener: any
	public dbclickListener: any
	public dblClickZoomInteraction: DoubleClickZoom

	constructor() {
		super()
		this._anchorLayer = new VectorLayer('draw-anchor-layer')
		this._options = {}
		this._floatingAnchor = undefined
		this._tooltipMess = undefined
	}

	set tooltipMess(tooltipMess) {
		this._tooltipMess = tooltipMess
	}

	_onClick(e) {
		console.log('%%%%单击事件', this)
		// let _that = this.drawTool;
		let _that = this
		const movement = e?.movement
		const position = movement?.coordinate ?? null
		if (!position) return
		if (!_that._floatingAnchor) {
			_that._floatingAnchor = _that._onCreateAnchor({ position })
		}

		_that.fire(new PlotEvent(PlotEventType.DRAW_ANCHOR, position))
	}

	_onMouseMove(e) {
		let _that = this
		const movement = e?.movement
		const position = movement?.coordinate ?? null
		if (!position) return
		_that._floatingAnchor && _that._floatingAnchor.setCoordinates?.(position)
		_that.fire(new PlotEvent(PlotEventType.ANCHOR_MOVING, position))
	}

	_onDBClick(e) {
		console.log('%%%双击结束事件', e)
		console.log('_onMouseMove', this)
		e?.preventDefault?.()
		let _that = this
		const movement = e?.movement
		const position = movement?.coordinate ?? null
		_that.fire(new PlotEvent(PlotEventType.DRAW_STOP, position))
	}

	_onCreateAnchor({ position, isCenter = false }) {
		console.log('_onCreateAnchor', position)
		const pos = new Point(position)
		pos.setStyle({
			image: {
				type: 'circle',
				image: {
					radius: 5,
					stroke: {
						strokeColor: 'rgba(51,51,51,0.77)',
						strokeWidth: 1
					},
					fill: {
						fillColor: (v) => 'red'
					}
				}
			}
		})
		this._anchorLayer.addOverlay(pos)
		return pos
	}

	_onClearAnchor(e) {
		console.log('_onCreateAnchor', e)
	}

	_bindEvent() {
		this.clickListener = this._map.on(MouseEventType.CLICK, this._onClick.bind(this))
		this.pointerMoveListener = this._map.on(
			MouseEventType.POINTER_MOVE,
			this._onMouseMove.bind(this)
		)
		this.dbclickListener = this._map.on(MouseEventType.DB_CLICK, this._onDBClick.bind(this))
		// @ts-ignore
		this.on(PlotEventType.CREATE_ANCHOR, this._onCreateAnchor)
		// @ts-ignore
		this.on(PlotEventType.CLEAR_ANCHOR, this._onClearAnchor)
	}

	_unbindEvent() {
		console.log('Draw Tool_unbindEvent~~~~~~~')
		unByKey(this.clickListener)
		unByKey(this.pointerMoveListener)
		unByKey(this.dbclickListener)
		this.clickListener = null
		this.pointerMoveListener = null
		this.dbclickListener = null
		// @ts-ignore
		this.un(PlotEventType.CREATE_ANCHOR, this._onCreateAnchor)
		// @ts-ignore
		this.un(PlotEventType.CLEAR_ANCHOR, this._onClearAnchor)
	}

	listen(type, callback, context = this) {
		this.on(type, callback)
		return this
	}

	off(type, callback, context) {
		this.un(type, callback)
		return this
	}

	fire(event) {
		// console.log('ds',event)event
		this.dispatchEvent(event)
		return this
	}

	activate() {
		this._unbindEvent()
		this._bindEvent()
		const interactions = this._map.getInteractions()
		let length = interactions.getLength()
		for (let i = 0; i < length; i++) {
			let item = interactions.item(i)
			if (item instanceof DoubleClickZoom) {
				this.dblClickZoomInteraction = item
				interactions.remove(item)
				break
			}
		}
	}

	deactivate() {
		this._unbindEvent()
		this._anchorLayer.clear()
		this._floatingAnchor = undefined
		setTimeout(() => {
			if (this.dblClickZoomInteraction != null) {
				// this._map.addInteraction(this.dblClickZoomInteraction);
				// this.dblClickZoomInteraction = null;
			}
		}, 200)
	}

	install(map) {
		this._map = map
		// this._map.dataSources.add(this._anchorLayer)
		this._map.addLayer(this._anchorLayer)
		Object.defineProperty(this._map, 'drawTool', {
			value: this,
			writable: false
		})
	}
}

export default DrawTool
