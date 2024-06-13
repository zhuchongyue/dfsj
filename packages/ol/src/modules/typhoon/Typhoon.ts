import {VectorLayer} from '../layer'
import {CustomProjection} from '../proj'
import {Feature} from 'ol'
import Polyline from '../overlay/vector/Polyline'
import {GeometryFormatType} from '../overlay/GeometryType'
import {policeLine} from './BasicConfig'
import TyphoonChannel from './TyphoonChannel'

export default class Typhoon {
	private _layer: VectorLayer //图层
	private _projection: any //投影坐标
	private _policeLines: Feature[] //警戒线
	private _options: any //选项配置
	private _map: any
	private _channels: Map<any, any> = new Map()

	constructor(map, options?) {
		this._map = map
		this._channels = new Map()
		this._options = options || {}
		this._layer = new VectorLayer('twwwwwh')
		console.log('_layer', this._layer)
		this._projection = CustomProjection.projection
		this.initialize()
	}

	get channels() {
		let result = []
		this._channels.forEach((value, key, map) => {
			result.push(value)
		})
		return result
	}

	/** 获取指定的台风*/
	getChannel(id) {
		const result = this._channels.get(id)
		return result ?? null
	}

	/***
	 * 初始化
	 * 绘制警戒线
	 */
	initialize() {
		policeLine.lines.forEach((line) => {
			let polyline = new Polyline(line.coordinates, {
				geometryType: GeometryFormatType.Polyline
			})
			polyline.setStyle({
				zIndex: 199,
				color: line.color,
				outlineColor: line.color,
				outlineWidth: line.width, // 设置线的两端为圆头
				outlineDash: line.style === 'dotted' ? [5, 5, 5] : null,
				label: {
					text: line.title,
					font: line.font,
					placement: 'line',
					textAlign: 'end',
					textOffsetY: 10,
					color: line.color
				}
			})
			this._layer.addOverlay(polyline)
		})
		this._map.addLayer(this._layer)
		this._layer.delegate?.changed?.()
	}

	/**
	 * 设置可见性
	 */
	visible() {}

	/** addChannel*/
	addChannel(channel: TyphoonChannel | any) {
		channel.addTo(this._map)
		this._channels.set(channel.channelId, channel)
	}

	removeChannel(id: string) {
		const target = this._channels.get(id)
		if (target) {
			target?.clear?.()
			target?.dispose?.()
			this._channels.delete(id)
		}
	}

	clear(id?: string) {
		if (id) {
			const target = this._channels.get(id)
			target?.clear?.()
		} else {
			this._channels.forEach((value, key, map) => {
				value?.clear?.()
			})
		}
	}

	/**
	 * 销毁
	 */
	dispose() {
		this._layer?.clear()
		this._map = null
		this.clear()
		this._channels.forEach((value, key, map) => {
			value?.dispose?.()
		})
		this._channels.clear()
	}
}
