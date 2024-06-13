import {connectEvent} from '../../utils/EventUtil'
import {MapEventType, MouseEventType, OverlayEventType} from '../EventType'
import OverlayEvent from './OverlayEvent'
import MapEvent from './MapEvent'
import StyleHelper from '../../style/StyleHelper'

let lastFeature = null
export default class MouseEvent {
	public _map: any
	public _cache: {}

	constructor(map: any) {
		this._map = map
		this._cache = {}
		this._setInputAction()
	}

	/**
	 * Register Cesium mouse events
	 * @private
	 */
	_setInputAction() {
		//无论是singleclick还是dblclick，都会首先触发click事件。
		// singleclick事件相当于执行一次click事件。
		// dblclick事件相当于执行两次click事件。
		connectEvent(this._map._delegate, MouseEventType.CLICK, this._clickHandler, this) //鼠标点击事件
		connectEvent(this._map._delegate, MouseEventType.SINGLE_CLICK, this._singleClickHandler, this) //鼠标单击事件
		connectEvent(this._map._delegate, MouseEventType.DB_CLICK, this._dbClickHandler, this) //鼠标双击事件
		connectEvent(this._map._delegate, MouseEventType.POINTER_MOVE, this._mouseMoveHandle, this) //鼠标移动事件
		connectEvent(this._map._delegate, MouseEventType.WHEEL, this._setDynamicStyleHandler, this) //鼠标滚轮事件
		connectEvent(this._map._delegate, MapEventType.MOVEEND, this._mouseWheelHandler, this) //地图视窗变化事件
		// connectEvent(this._map.view , MapEventType.CHANGE_RESOLUTION ,this._setDynamicStyleHandler,this)
	}

	/**
	 * 根据鼠标获取要素
	 * @param movement
	 */
	_getFeature(movement) {
		let feature = this._map._delegate.forEachFeatureAtPixel(
			movement.pixel,
			function (feature, layer) {
				return feature
			}
		)
		const mouseInfo = this.getMouseInfo(movement)
		let targetInfo = this._getTargetInfo(feature)
		return {
			feature: feature,
			mouseInfo: mouseInfo,
			targetInfo: targetInfo
		}
	}

	/** 单击地图回调函数*/
	_singleClickHandler(movement) {
		const { feature, mouseInfo, targetInfo } = this._getFeature(movement)
		// console.log('___单击地图事件回调___', targetInfo)
		this._map.dispatchEvent(
			new MapEvent(MouseEventType.SINGLE_CLICK, { ...mouseInfo, ...targetInfo })
		)
		// if (targetInfo?.overlay) {
		//     targetInfo.overlay.fire(new OverlayEvent(OverlayEventType.CLICK, {
		//         mouseInfo, targetInfo
		//     }))
		// }
	}

	/** 点击回调函数*/
	_clickHandler(movement) {
		const { feature, mouseInfo, targetInfo } = this._getFeature(movement)
		// console.log('___单击地图事件回调___', targetInfo)
		this._map.dispatchEvent(new MapEvent(MouseEventType.CLICK, { ...mouseInfo, ...targetInfo }))
		if (targetInfo?.overlay) {
			targetInfo.overlay.fire(
				new OverlayEvent(OverlayEventType.CLICK, {
					mouseInfo,
					targetInfo
				})
			)
		}
	}

	/** 双击回调函数*/
	_dbClickHandler(movement) {
		const { feature, mouseInfo, targetInfo } = this._getFeature(movement)
		// console.log('___双击地图事件回调___', targetInfo)
		this._map.dispatchEvent(
			new MapEvent(OverlayEventType.DB_CLICK, { ...mouseInfo, ...targetInfo })
		)
		if (targetInfo?.overlay) {
			targetInfo.overlay.fire(
				new OverlayEvent(OverlayEventType.DB_CLICK, {
					mouseInfo,
					targetInfo
				})
			)
		}
	}

	/**
	 * 鼠标移动事件
	 */

	_mouseMoveHandle(movement) {
		let pixel = this._map._delegate.getEventPixel(movement.originalEvent)
		let feature = this._map._delegate.forEachFeatureAtPixel(
			pixel,
			function (feature, layer) {
				return feature
			},
			{ hitTolerance: 2 }
		)
		const hit = this._map._delegate.hasFeatureAtPixel(pixel, function (feature, layer) {}, {
			hitTolerance: 2
		})
		// if (lastFeature !== feature) {
		if (feature && feature?.overlayId && feature?.layerId) {
			let targetInfo = this._getTargetInfo(feature)
			this._map._delegate.getTargetElement().style.cursor = hit ? 'pointer' : ''
			targetInfo.overlay?.fire(
				new OverlayEvent(OverlayEventType.MOUSEOVER, targetInfo.layer, {
					coordinate: movement?.coordinate,
					fixed: lastFeature == feature
				})
			)

			lastFeature = feature
		} else {
			let targetInfo = this._getTargetInfo(lastFeature)
			targetInfo.overlay?.fire(
				new OverlayEvent(OverlayEventType.MOUSEOUT, targetInfo.layer, {
					coordinate: movement?.coordinate,
					fixed: lastFeature == feature
				})
			)
			this._map._delegate.getTargetElement().style.cursor = hit ? 'auto' : 'auto'
			lastFeature = null
		}
		// }
		const mouseInfo = this.getMouseInfo(movement)
		let targetInfo = this._getTargetInfo(lastFeature)
		this._map.dispatchEvent(
			new MapEvent(MouseEventType.POINTER_MOVE, { ...mouseInfo, ...targetInfo })
		)
	}

	/** 鼠标移动回调函数*/
	_mouseWheelHandler(movement) {
		const mouseInfo = this.getMouseInfo(movement)
		this._map.dispatchEvent(new MapEvent(MouseEventType.WHEEL, { ...mouseInfo }))
	}

	/**
	 * FIXME 这个函数是根据矢量图层要素的配置是否根据zooms 来动态设置要素样式
	 * */
	_setDynamicStyleHandler(movement) {
		const vectorLayerCache = this._map?._layerCache?.['vector']
		const conform = Object.values(vectorLayerCache).filter((vl: any) => vl?.dynamic)
		const zoom = this._map.zoom
		console.log('相当于层级变化...', movement, zoom)
		// this._map.dispatchEvent(new MapEvent(MapEventType.CHANGE_RESOLUTION, movement))
		return
		if (conform?.length) {
			conform.forEach((overlay: any) => {
				const overlays = overlay?.getOverlays()
				console.log(overlays.length)
				overlays.forEach((overlay) => {
					const dynamic = overlay.dynamic
					const zooms = dynamic?.zooms
					if (zooms != null && (zoom < zooms[0] || zoom > zooms[1])) {
						overlay.setStyle(StyleHelper.EMPTY_STYLE)
						overlay.set('visible', false)
					} else {
						overlay.setStyle(dynamic, zoom)
						overlay.set('visible', true)
					}
				})
			})
		}
	}

	getMouseInfo(movement) {
		const extent = this._map._delegate.getView().calculateExtent() //范围
		let screen = movement.pixel //屏幕位置
		let coordinate = movement.coordinate //点击的地理位置
		let center = this._map._delegate.getView().getCenter() //中心点
		let zoom = this._map._delegate.getView().getZoom() //层级
		let Transform = this._map?.transform
		return {
			extent: Transform.transformExtentToLonLat(extent),
			screen,
			coordinate: Transform.transformToLonLat(coordinate),
			center: Transform.transformToLonLat(center),
			zoom
		}
	}

	/**
	 * 获取Overlay的id 方便查询
	 * @param target
	 * @returns {any}
	 * @private
	 */
	_getOverlayId(target) {
		let overlayId = undefined
		if (target?.overlayId) overlayId = target.overlayId
		return overlayId
	}

	/**
	 * Returns the target information for the mouse event
	 * @param target
	 * @returns {{instanceId: *, overlay: undefined, feature: undefined, layer: undefined}}
	 * @private
	 */
	_getTargetInfo(target) {
		let overlay = undefined
		let layer = undefined
		let feature = undefined
		// console.log(this._map)
		// console.log('this._map?.getLayers()',this._map?.getLayers())
		if (target) {
			feature = target
			layer = this._map?.getLayers()?.filter((item) => item.layerId === target.layerId)[0]
			if (layer?.getOverlay) {
				overlay = layer.getOverlay(target.overlayId)
			}
		}
		return {
			layer: layer,
			overlay: overlay,
			feature: feature,
			instanceId: target?.instanceId
		}
	}
}
