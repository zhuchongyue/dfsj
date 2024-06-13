import State from '../state/State'
import WidgetType from './WidgetType'

class Widget {
	public _map: any
	public _enable: boolean
	public _wrapper: any
	public _ready: boolean
	public _state: any

	constructor() {
		this._map = undefined
		this._enable = false
		this._wrapper = {}
		this._ready = false
	}

	set enable(enable) {
		if (this._enable === enable) {
			return
		}
		this._enable = enable
		this._state = this._enable ? State.ENABLED : State.DISABLED
		this._enableHook && this._enableHook()
	}

	get enable() {
		return this._enable
	}

	get state() {
		return this._state
	}

	_installHook() {}

	_enableHook() {}

	_checkEnable() {
		if (!this._enable) throw Error('请先设置Tooltip.enable为true！')
	}

	/** 设置内容*/
	setContent(content: string | HTMLElement) {
		this._checkEnable()
	}

	/** 隐藏*/
	hide() {}

	/** 展示*/
	show(pos: [number, number], content: string | HTMLElement) {
		this._checkEnable()
	}

	/** 设置坐标*/
	setPosition(pos: [number, number]) {
		this._checkEnable()
	}

	install(map) {
		this._map = map
		this._installHook && this._installHook()
		this._state = State.INSTALLED
	}

	/**
	 * Registers type
	 * @param type
	 */
	static registerType(type) {
		if (type) {
			WidgetType[type.toLocaleUpperCase()] = type.toLocaleLowerCase()
		}
	}

	/**
	 *
	 * @param type
	 */
	static getWidgetType(type) {
		return WidgetType[type.toLocaleUpperCase()] || undefined
	}
}

export default Widget
