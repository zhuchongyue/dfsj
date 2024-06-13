/**
 * View 初始化
 */
import {View as OlView} from 'ol'
import {easeOut} from 'ol/easing'

export default class View extends OlView {
	_delegate

	constructor(map) {
		const { _options, projection } = map
		const option = _options?.view ?? {}
		//计算中心位置
		let center = option?.center?.length == 2 ? map.transform.transform(option['center']) : [0, 0]
		const extent =
			option?.extent?.length == 4 ? map.transform.transformExtent(option['extent']) : []
		const fixExtent =
			option?.fixExtent?.length == 4
				? map.transform.transformExtent(option['fixExtent'])
				: undefined
		if (extent.length == 4) {
			center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
		}
		super({
			center: center,
			zoom: option?.['zoom'] ?? 5,
			minZoom: option?.['minZoom'] ?? 0,
			maxZoom: option?.['maxZoom'] ?? 20,
			extent: fixExtent,
			// zoomFactor: option?.['zoomFactor'] ?? 1,
			// rotation: option?.['rotation'] ?? 0,
			// enableRotation: option?.['enableRotation'] ?? false,
			projection: projection,
			// extent: option?.['extent'] && Array.isArray(option?.['extent']) && option?.['extent'].length === 4  && option?.['extent'] || undefined,
			// resolutions: option?.['resolutions'] &&Array.isArray(option?.['resolutions']) && option?.['resolutions']?.length > 0  &&  option['resolutions']|| undefined,
			// smoothResolutionConstraint : option?.['smoothExtentConstraint'] ?? false,
			// constrainResolution:option?.['constrainResolution'] ?? true,
			smoothResolutionConstraint: false,
			constrainResolution: true
		})
		this._delegate = map
	}

	/**
	 * 放大
	 */
	zoomIn(duration) {
		let zoom = this._delegate._delegate.getView().getZoom()
		this._delegate._delegate.getView().animate({
			zoom: zoom + 1,
			duration: duration && typeof duration === 'number' ? duration : 300
		})
	}

	/**
	 * 缩小
	 */
	zoomOut(duration) {
		let zoom = this._delegate._delegate.getView().getZoom()
		this._delegate._delegate.getView().animate({
			zoom: zoom - 1,
			duration: duration && typeof duration === 'number' ? duration : 300
		})
	}

	/**
	 * zoomByDelta
	 * @param delta
	 * @param duration
	 * @returns {boolean}
	 */
	zoomByDelta(delta, duration) {
		let view = this._delegate._delegate.getView()
		if (!view || !(view instanceof OlView)) {
			return false
		} else {
			// @ts-ignore
			let currentResolution = view.getResolution()
			if (currentResolution) {
				// @ts-ignore
				let newResolution = view.constrainResolution(currentResolution, delta)
				if (duration > 0) {
					// @ts-ignore
					if (view.getAnimating()) {
						// @ts-ignore
						view.cancelAnimations()
					}
					// @ts-ignore
					view.animate({
						resolution: newResolution,
						duration: duration,
						easing: easeOut
					})
				} else {
					// @ts-ignore
					view.setResolution(newResolution)
				}
			}
		}
	}
}
