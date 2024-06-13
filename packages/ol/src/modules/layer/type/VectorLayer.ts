import olVectorLayer from 'ol/layer/Vector'
import VectorEventType from 'ol/source/VectorEventType.js'
import RenderEventType from 'ol/render/EventType.js'
import {VectorSourceEvent} from 'ol/source/Vector'
import {Vector as VectorSource} from 'ol/source'
import Layer from '../Layer'
import {getVectorContext} from 'ol/render'
import State from '../../state/State'

export default class VectorLayer extends Layer {
	protected listener: any = null

	constructor(id, config?) {
		super(id)
		this._delegate = new olVectorLayer({
			//矢量图层
			source: new VectorSource({
				features: []
			}),
			zIndex: config?.zIndex || 10
		})
		const source = this._delegate?.getSource()
		source.on(VectorEventType.ADDFEATURE, (event: VectorSourceEvent) => {
			const animation = event.feature?.get('animation')
			if (animation) {
				this._buffer.push(event.feature)
			}
		})
		// @ts-ignore
		source.on(VectorEventType.REMOVEFEATURE, (event: VectorSourceEvent) => {
			let index = this._buffer.indexOf(event.feature)
			if (index >= 0) this._buffer.splice(index, 1)
		})
		// @ts-ignore
		this._delegate.on(RenderEventType.POSTRENDER, (event: RenderEvent) => {
			if (this._buffer.length === 0) return
			this._animation.setContext(getVectorContext(event))
			this._buffer.forEach((feature) => {
				// let options = feature.get(key);
				// let options = {
				//     type:'twinkle',
				//     geometry:'content',
				//     color:"red"
				// }
				// let options = {
				//     type:'scale',
				//     scales:[0.5,1]
				// }
				//
				// let options = {
				//     type: 'flow',
				//     render: "dosh",            // 当render为dosh时，必须为polyline设置外边框
				//     // colors:any[],                     // 仅适用于gradient
				//     speed: 0.5,                         // 线条流动速度，推荐速度0.5
				//     direction: 1,                      // 线条流动方向
				// }

				// let options = {
				//     type: "ripple",
				//     width: 5,   // 波浪线宽度
				//     color: 'red',   // 波浪线颜色
				//     count:2 ,   // 波浪线数量
				//     radius: [0,50],    // 波浪半径（最小和最大）
				// }
				const animation = feature?.get('animation')
				if (animation) this._animation.render(feature, animation, event.frameState)
			})
			this._delegate?.changed?.()
			// gis.map.render();
		})
	}

	get type() {
		return Layer.getLayerType('vector')
	}

	setVisible(visible: boolean) {
		this._delegate.setVisible(visible)
		return this
	}

	clear() {
		this._delegate.getSource().clear(true)
		this._cache = {}
		this._state = State.CLEARED
		return this
	}
}
Layer.registerType('vector')
