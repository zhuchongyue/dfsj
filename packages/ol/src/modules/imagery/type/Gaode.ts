/**
 * 高德地图服务
 */
import XYZ from 'ol/source/XYZ'
import Attribution from 'ol/control/Attribution'

export default class Gaode extends XYZ {
	constructor(optOptions) {
		let options = optOptions || {}
		let attributions: any = ''
		if (options.attributions !== undefined) {
			attributions = options.attributions
		} else {
			attributions = [Gaode.attribution]
		}
		let crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : undefined
		let url =
			options.url !== undefined
				? options.url
				: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
		var tileUrlFunction = options.tileUrlFunction ? options.tileUrlFunction : undefined
		super({
			attributions: attributions,
			cacheSize: options.cacheSize,
			crossOrigin: crossOrigin,
			opaque: options.opaque !== undefined ? options.opaque : true,
			maxZoom: options.maxZoom !== undefined ? options.maxZoom : 19,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileLoadFunction: options.tileLoadFunction,
			tileUrlFunction: tileUrlFunction,
			url: url,
			wrapX: options.wrapX
		})
	}

	static attribution() {
		return new Attribution({
			// @ts-ignore
			html: '&copy; ' + '<a href="http://ditu.amap.com/">高德地图</a> ' + 'contributors.'
		})
	}
}
