import Draw from 'ol/interaction/Draw'
import {Overlay} from 'ol'
import {MouseEventType} from '../event'
import Popup from 'ol-ext/overlay/Popup'
import {unByKey} from 'ol/Observable'
import State from '../state/State'
import {SpecsDrawConfig} from './MeasureType'

// type S =  keyof typeof State
type S = (typeof State)[keyof typeof State]

export default class MeasureBase extends Draw {
	protected _map: any
	protected _layer: any
	protected _options: SpecsDrawConfig | any
	protected _length: any
	protected _area: any
	protected _tips: any = []
	protected _pointCount: number = 2
	protected _style: any
	protected _beforeStartListener: any
	protected _startTip: any
	protected listener: any
	protected drawingFeature: any

	protected _drawStartListener: any = null
	protected _drawEndListener: any = null
	protected _state: S = State.INSTALLED

	constructor({ type, source, style }) {
		super({
			type: type ?? 'LineString',
			source: source,
			style: style
		})
		this._style = style
	}

	get state() {
		return this._state
	}

	get map() {
		return this._map
	}

	_onDrawStop(ev?) {
		this._pointCount = 2
		this._unbindEvent()
		this._unBindBeforeMove()
	}

	_onCalc(feature) {}

	/***
	 * 结束绘制
	 * @param evt
	 */
	_onDrawEnd(evt) {
		this._state = State.END
		this._pointCount = 2
	}

	/***
	 * 开始绘制
	 * @param evt
	 */
	_onDrawStart(evt) {
		this._state = State.PROCEED
		this._unBindBeforeMove()
	}

	_bindEvent() {
		this._bindBeforeMove()
		this._drawStartListener = this.on('drawstart', this._onDrawStart.bind(this))
		this._drawEndListener = this.on('drawend', this._onDrawEnd.bind(this))
	}

	_unbindEvent() {
		// this._unBindBeforeMove()
		// this.un('drawstart', this._onDrawStart.bind(this))
		// this.un('drawend', this._onDrawEnd.bind(this))
		unByKey(this._drawStartListener)
		unByKey(this._drawEndListener)
		this._drawEndListener = null
		this._drawStartListener = null
	}

	_bindBeforeMove() {
		this._beforeStartListener = this._map.on(MouseEventType.POINTER_MOVE, (ev) => {
			const coordinate = ev?.movement?.coordinate
			this._startTip.setPosition?.(coordinate)
		})
	}

	_unBindBeforeMove() {
		this._beforeStartListener && unByKey(this._beforeStartListener)
		this._beforeStartListener = null
		this._startTip?.hide?.()
		this._startTip && this._map._delegate?.removeOverlay(this._startTip)
		this._startTip = null
	}

	_startHook(measure, options) {
		this._map = measure.map
		this._startTip = new Popup({
			positioning: 'center-right',
			className: 'default specs'
		})
		this._map._delegate?.addOverlay(this._startTip)
		this._startTip.show?.('点击左键开始!')
		this._unbindEvent()
		this._bindEvent()
		this._layer = measure.layer
		this._options = options
		// this._options.onDrawStop = this._onDrawStop.bind(this)
		// this._options.onCalc = this._onCalc.bind(this)
	}

	start(measure, options) {
		this._startHook(measure, options)
		this._map.addInteraction(this)
		return this
	}

	//删除提示框
	judgeOverlay(overlay) {
		if (!overlay) return
		if (Array.isArray(overlay)) {
			overlay?.map((ov, index) => {
				if (ov instanceof Overlay) {
					this._map._delegate?.removeOverlay(ov)
				}
			})
		} else if (overlay instanceof Overlay) {
			this._map._delegate?.removeOverlay(overlay)
		}
	}

	_removeOverlays() {
		this.judgeOverlay(this._tips)
		this.judgeOverlay(this._length)
		this.judgeOverlay(this._area)
		this._area = null
		this._length = null
		this._tips = []
	}

	deactivate() {
		this._onDrawStop()
		unByKey(this.listener)
		this.listener = null
		this.setActive(false)
	}

	dispose() {
		this._removeOverlays()
		this._unBindBeforeMove()
	}
}
