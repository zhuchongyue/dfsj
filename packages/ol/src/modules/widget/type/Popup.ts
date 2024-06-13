import Widget from '../Widget'
import State from '../../state/State'
import olOverlayPopup from 'ol-ext/overlay/Popup.js'

class Popup extends Widget {
	constructor() {
		super()
		this._ready = true
		this._state = State.INITIALIZED
		this._wrapper = new olOverlayPopup({
			popupClass: 'default anim', //"tooltips", "warning" "black" "default", "tips", "shadow",
			closeBox: false,
			positioning: 'auto',
			autoPan: {
				animation: { duration: 250 }
			}
		})
	}

	get type() {
		return Widget.getWidgetType('popup')
	}

	/**
	 *
	 * @private
	 */
	_installHook() {
		Object.defineProperty(this._map, 'popup', {
			value: this,
			writable: false
		})
	}

	_enableHook() {
		if (this._enable) {
			this._map._delegate?.addOverlay(this._wrapper)
		} else {
			this._map._delegate?.removeOverlay(this._wrapper)
		}
	}

	setPosition(pos: [number, number]) {
		let Transform = this._map?.transform
		pos = Transform.transform(pos)
		super.setPosition(pos)
		this._wrapper.setPosition(pos)
	}

	hide() {
		super.hide()
		this._wrapper.hide()
	}

	show(pos: [number, number], content: string | HTMLElement) {
		let Transform = this._map?.transform
		pos = Transform.transform(pos)
		super.show(pos, content)
		this._wrapper.show(pos, content)
	}
}

Widget.registerType('popup')
export default Popup
