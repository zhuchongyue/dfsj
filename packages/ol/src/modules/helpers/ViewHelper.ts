/**
 * @view 视图工具
 */
import {buffer, containsXY, getBottomLeft, getSize, getTopRight} from 'ol/extent'
import {Mixin} from 'ts-mixer'
import Global from './Global'

class ViewHelper extends Mixin(Global) {
	/***
	 * 飞行到点位
	 */
	flyToPosition(coordinate: [number, number], { zoom = 0, duration = 500, callBack = () => {} }) {
		let durations = [duration / 2, duration, duration / 2]
		const zoomed = zoom || this._view.getZoom()
		let Transform = this?.transform
		coordinate = Transform.transform(coordinate)
		if (coordinate && Array.isArray(coordinate) && this._delegate) {
			this._delegate.getView().animate(
				{
					center: coordinate,
					duration: durations[1]
				},
				{
					zoom: zoomed,
					duration: durations[2]
				},
				() => {
					console.log('飞行完毕')
					callBack && callBack?.()
				}
			)
		}
	}

	/***
	 * 飞行到范围
	 */

	flyToBounds(bounds: [], { padding = [0, 0, 0, 0], duration = 100 }) {
		this.zoomToExtent(bounds, { padding, duration })
	}

	/**
	 * 获取当前视图范围
	 * @param size
	 * @returns {ol.Extent|*}
	 */
	getExtent(size) {
		if (size) {
			return this._view.calculateExtent(size)
		} else {
			return this._view.calculateExtent(this._delegate.getSize())
		}
	}

	/**
	 * 获取当前地图的范围
	 * @returns {ol.Extent}
	 */
	getMapCurrentExtent() {
		if (this._delegate) {
			return this._view.calculateExtent(this._delegate.getSize())
		}
	}

	/**
	 * 缩放到全图
	 */
	zoomMaxExtent(zoom) {
		let view = this._delegate.getView()
		zoom = typeof zoom === 'number' ? zoom : 2
		if (this._delegate && view) {
			let center = view.getCenter()
			if (center) {
				this._view.setCenter(center)
				this._view.setZoom(zoom)
			}
		}
	}

	/**
	 * 判断点是否在视图内，如果不在地图将自动平移
	 * @param coordinate (当前点坐标)
	 */
	movePointToView(coordinate) {
		if (this._delegate) {
			let extent = this.getMapCurrentExtent()
			if (!containsXY(extent, coordinate[0], coordinate[1])) {
				this._delegate.getView().animate({
					center: [coordinate[0], coordinate[1]],
					duration: 400
				})
			}
		}
	}

	/**
	 * 调整当前要素范围
	 * @param extent
	 * @param params
	 * @returns {*}
	 */
	adjustExtent(extent, params) {
		if (this._delegate) {
			params = params || {}
			let size = getSize(extent)
			let adjust = typeof params['adjust'] === 'number' ? params['adjust'] : 0.2
			let minWidth = typeof params['minWidth'] === 'number' ? params['minWidth'] : 0.05
			let minHeight = typeof params['minHeight'] === 'number' ? params['minHeight'] : 0.05
			if (size[0] <= minWidth || size[1] <= minHeight) {
				let bleft = getBottomLeft(extent) // 获取xmin,ymin
				let tright = getTopRight(extent) // 获取xmax,ymax
				let xmin = bleft[0] - adjust
				let ymin = bleft[1] - adjust
				let xmax = tright[0] + adjust
				let ymax = tright[1] + adjust
				extent = buffer([xmin, ymin, xmax, ymax], adjust)
			}
			return extent
		}
	}

	/**
	 * 缩放到当前范围
	 * @param extent
	 * @param isanimation
	 * @param duration
	 */
	zoomToExtent(extent, { padding = [0, 0, 0, 0], duration = 300 }) {
		let Transform = this?.transform
		extent = Transform.transformExtent(extent)
		if (this._delegate) {
			let view = this._delegate.getView()
			let size = this._delegate.getSize()
			view.fit(extent, {
				size: size,
				padding: padding,
				duration: duration ?? 0,
				maxZoom: view.getMaxZoom() || undefined
			})
		}
	}

	/**
	 * 调整图层
	 * @constructor
	 */
	orderLayerZindex() {
		let layerindex = 10
		if (this._delegate) {
			// let pointLayers = this.pointLayers;
			// let lineLayers = this.lineLayers;
			// let polygonLayers = this.polygonLayers;
			// polygonLayers.forEach(layerName => {
			//   if (layerName) {
			//     let layer = this.getLayerByLayerName(layerName);
			//     if (layer) {
			//       layer.setZIndex(layerindex++);
			//     }
			//   }
			// });
			// lineLayers.forEach(layerName => {
			//   if (layerName) {
			//     let layer = this.getLayerByLayerName(layerName);
			//     if (layer) {
			//       layer.setZIndex(layerindex++);
			//     }
			//   }
			// });
			// pointLayers.forEach(layerName => {
			//   if (layerName) {
			//     let layer = this.getLayerByLayerName(layerName);
			//     if (layer) {
			//       layer.setZIndex(layerindex++);
			//     }
			//   }
			// });
		}
	}
}

export default ViewHelper
