/**
 * 谷歌地图服务
 */

import XYZ from 'ol/source/XYZ'
import Attribution from 'ol/control/Attribution'

export default class Google extends XYZ {
	constructor(optOptions) {
		let options = optOptions || {}
		let attributions: any = ''
		if (options.attributions !== undefined) {
			attributions = options.attributions
		} else {
			attributions = [Google.attribution]
		}
		let crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : 'anonymous'
		let url =
			options.url !== undefined
				? options.url
				: 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'

		super({
			attributions: attributions,
			cacheSize: options.cacheSize,
			crossOrigin: crossOrigin,
			opaque: options.opaque !== undefined ? options.opaque : true,
			maxZoom: options.maxZoom !== undefined ? options.maxZoom : 19,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileLoadFunction: options.tileLoadFunction,
			url: url,
			wrapX: options.wrapX
		})
	}

	static attribution() {
		return new Attribution({
			// @ts-ignore
			html: '&copy; ' + '<a href="http://www.google.cn/maps">谷歌地图</a> ' + 'contributors.'
		})
	}
}
