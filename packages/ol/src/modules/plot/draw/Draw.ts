import {PlotEventType} from '../../event/EventType'
import PlotEvent from '../../event/type/PlotEvent'
import {Constants, distance} from '../../utils/plot'
import {unByKey} from 'ol/Observable'
import Util from '../../utils/Util'
import Popup from "ol-ext/overlay/Popup";
import {POINT,SINGLE} from "../Plot";

interface Config {
	style: object
	buffer: number | boolean
	popup: boolean
}

const DEF_STYLE = {
	zIndex: 8,
	outlineWidth: 2,
	outlineColor: '#00aaff',
	outlineLineCap: 'round', // 设置线的两端为圆头
	color: 'rgba(14, 190 ,196,0.3)'
}
const DEF_BUFFER_STYLE = {
	zIndex: 2,
	outlineWidth: 1,
	outlineColor: '#00aaff',
	outlineDash: [5, 5, 5], // 设置线的两端为圆头
	color: 'rgba(241,148,148,0.3)'
}

class Draw {
	public _map: any
	public _id: any
	public _style: any
	public _bufferStyle: any
	public _delegate: any
	public _options: any | Config
	public _config: any | Object
	public _positions: any[]
	public _layer: any
	public fixPointCount: number
	public freehand: boolean

	protected _onDrawAnchorLister: any = null
	protected _onAnchorMovingLister: any = null
	protected _onDrawStopLister: any = null
	//提示
	protected _buffer //缓冲
	protected _popup //提示

	//绘制提示
	protected _startTip:any;

	constructor(config) {
		this._id = config?.id || Util.uuid()
		this._config = config
		const style = config?.style ?? {}
		this._style = {
			...DEF_STYLE,
			...style
		}
		this._bufferStyle = DEF_BUFFER_STYLE
		this._map = null
		this._delegate = undefined
		this._options = {}
		this._positions = []
		this.freehand = false
		this.fixPointCount = Number.MAX_SAFE_INTEGER
	}

	get config(): Config {
		return this._config
	}

	get getOverlays() {
		return null
	}

	get positions() {
		return this._positions.slice(0)
	}

	get count() {
		return this._positions.length
	}

	get drawTool() {
		return this._map?.drawTool
	}
	get type(){
		return this._options?.type
	}
	get isPoint(){
        return POINT.includes(this.type)
	}

	generate(position?) {}

	_mountedHook() {}

	_stoppedHook() {
		console.log('_options', this._options)
		console.log('停止绘制:_positions',this._positions)
		if (this._positions && this._delegate) {
			if (this.fixPointCount) {
				this._delegate.attr.fixPoints = this.positions?.slice(0,this.fixPointCount);
			}
			this._options.onDrawStop &&
				this._options.onDrawStop(this._delegate, {
					buffer: this._buffer,
					popup: this._popup,
					overlays: this.getOverlays
				})
			this._delegate = null
			this._buffer = null
			this._popup = null
			this._positions = []
		}
	}

	_onDrawAnchor({ position }) {
		if (this.count == this.fixPointCount) {
			console.log('停止绘制')
			this.stop()
			return
		} else {
			if (
				this._positions?.length > 1 &&
				distance(position, this.positions[this.count - 1]) < Constants.ZERO_TOLERANCE
			) {
				console.log('_onDrawAnchor距离太接近,不做处理了')
				return
			}
			this._positions.push(position)
			if (this._positions.length >= 1) {
				this.generate()
				this.drawTool.fire(new PlotEvent(PlotEventType.CREATE_ANCHOR, position))
			}
			if (this.count == this.fixPointCount)this.stop()
		}
	}

	/**
	 * 鼠标移动
	 * @param position
	 */
	_onAnchorMoving({ position }) {
		if (this.count <= 1){
			this._startTip.setPosition?.(position)
		} else{
			this._startTip.hide?.();
		}
		if (
			this._positions.length &&
			distance(position, this.positions[this.count - 1]) < Constants.ZERO_TOLERANCE
		) {
			console.log('_onAnchorMoving距离太接近,不做处理了')
			return
		}
		const copy =  this._positions.slice(0);
		let positions = [];
		if (!this.freehand) {
			positions = copy.concat([position]);
		} else {
			if (!this._positions.length) return
			this._positions.push(position)
			positions = this._positions
		}
		if (position.length >= 1) this.generate(positions)
	}

	_onDrawStop() {
		this._map.drawTool.deactivate()
		this._unbindEvent()
		this._delegate && this._layer.removeOverlay(this._delegate)
		if (this._popup) {
			if (Array.isArray(this._popup)) {
				this._popup?.forEach((popup) => {
					this._map._delegate?.removeOverlay(popup)
				})
			} else {
				this._map._delegate?.removeOverlay(this._popup)
			}
		}
		this._buffer && this._layer.removeOverlay(this._buffer)
		this._stoppedHook()
	}

	_bindEvent() {
		console.log('Draw _bindEvent')
		this._onDrawAnchorLister = this.drawTool.on(PlotEventType.DRAW_ANCHOR,this._onDrawAnchor.bind(this))
		this._onAnchorMovingLister = this.drawTool.on(PlotEventType.ANCHOR_MOVING,this._onAnchorMoving.bind(this))
		this._onDrawStopLister = this.drawTool.on(PlotEventType.DRAW_STOP, this._onDrawStop.bind(this))
	}

	_unbindEvent() {
		console.log('Draw _unbindEvent')
		this.drawTool.off(PlotEventType.DRAW_ANCHOR, this._onDrawAnchor.bind(this))
		this.drawTool.off(PlotEventType.ANCHOR_MOVING, this._onAnchorMoving.bind(this))
		this.drawTool.off(PlotEventType.DRAW_STOP, this._onDrawStop.bind(this))
		unByKey(this._onDrawAnchorLister)
		unByKey(this._onAnchorMovingLister)
		unByKey(this._onDrawStopLister)
		this._onDrawAnchorLister = null
		this._onAnchorMovingLister = null
		this._onDrawStopLister = null
	}

	start(plot, options) {
		this._map = plot._map
		this._layer = plot?._layer
		this._options = options
		// this._map.editTool.deactivate()
		this._map.drawTool.activate(options)
		this._mountedHook()
		this._unbindEvent()
		this._bindEvent()

		this._startTip =  new Popup({
			positioning: 'center-right',
			className: "default specs"});
		this._map._delegate?.addOverlay(this._startTip);
		this._startTip.show?.(this.isPoint ? '点击左键结束!':'点击左键开始!');
		return this
	}

	stop() {
		this._startTip?.hide?.()
		this._map._delegate?.removeOverlay(this._startTip);
		this._startTip = null
		this.drawTool.fire(new PlotEvent(PlotEventType.DRAW_STOP, null))
		return this
	}
}

export default Draw
