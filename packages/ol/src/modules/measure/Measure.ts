import Angle from './type/Angle'
import Area from './type/Area'
import Distance from './type/Distance'
import MeasureType, {SpecsDrawConfig} from './MeasureType'
import {VectorLayer} from '../layer'
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom'
import StyleHelper from '../style/StyleHelper'
import Style from '../style/Style'
import State from '../state/State'

const styleDef = {
	outlineWidth: 2,
	outlineColor: '#F09',
	outlineLineCap: 'round', // 设置线的两端为圆头
	color: 'rgba(0,255,0,0.1)'
}

class Measure {
	protected _map: any
	protected _layer: any
	protected _source: any
	protected dblClickZoomInteraction: any
	protected _session: Array<any> = []
	protected _style: any = {}

	constructor(map, style?) {
		if (!map) {
			throw Error('missing map param')
		}
		this._style = { ...styleDef, ...style }
		this._map = map
		this._layer = new VectorLayer('measure-layer')
		this._map.addLayer(this._layer)
	}

	get olStyle() {
		const helper = StyleHelper.Polygon(this._style)
		return Style.create(helper, {})
	}

	get source() {
		return this._source
	}

	get map() {
		return this._map
	}

	get layer() {
		return this._layer
	}

	/**
	 *
	 * @param options
	 * @returns {Measure}
	 */
	angle(options: SpecsDrawConfig = {}) {
		this._activate()
		this._session.push(
			new Angle({
				type: 'LineString',
				source: this.source,
				style: this.olStyle
			}).start(this, options)
		)
		return this
	}

	/**
	 *
	 * @param options
	 * @returns {Measure}
	 */
	area(options: SpecsDrawConfig = {}) {
		this._activate()
		this._session.push(
			new Area({
				type: 'Polygon',
				source: this.source,
				style: this.olStyle
			}).start(this, options)
		)
		return this
	}

	/**
	 *
	 * @param options
	 * @returns {Measure}
	 */
	distance(options: SpecsDrawConfig = {}) {
		this._activate()
		this._session.push(
			new Distance({
				type: 'LineString',
				source: this.source,
				style: this.olStyle
			}).start(this, options)
		)
		return this
	}

	/** 保持最后一次测量的类型*/

	_activate() {
		this._session?.forEach((s, index) => {
			s?.deactivate?.()
		})
		this._session = this._session.filter((s) => s.state !== State.INSTALLED)
	}

	/**
	 *
	 * @param type
	 * @param options
	 * @returns {Measure}
	 */
	activate(type, options: SpecsDrawConfig = {}) {
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
		switch (type) {
			case MeasureType.ANGLE:
				this.angle(options)
				break
			case MeasureType.AREA:
				this.area(options)
				break
			case MeasureType.DISTANCE:
				this.distance(options)
				break
			default:
				break
		}
		return this
	}

	/**
	 *
	 * @returns {Measure}
	 */
	deactivate() {
		this._map.drawTool.tooltipMess = ''
		this._map.drawTool?.deactivate?.()
		this._map.editTool.tooltipMess = ''
		this._map.editTool?.deactivate?.()
		if (this._session?.length) {
			this._session.map((s, index) => {
				s?.deactivate?.()
			})
		}
		// setTimeout(() => {
		if (this.dblClickZoomInteraction != null) {
			this._map.addInteraction(this.dblClickZoomInteraction)
		}
		// }, 0)
		return this
	}

	clear() {
		this.deactivate()
		if (this._session?.length) {
			this._session.map((s, index) => {
				s?.dispose?.()
			})
		}
		this._session = []
		this._layer?.clear?.()
	}

	dispose() {
		this.clear()
		this._layer && this._map.removeLayer(this._layer)
		this._map = null
		this._layer = null
		this._source = null
	}
}

export default Measure
