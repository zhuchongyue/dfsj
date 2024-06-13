/**
 * 百度地图服务
 */

import TileImage from 'ol/source/TileImage'
import Attribution from 'ol/control/Attribution'
import TileGrid from 'ol/tilegrid/TileGrid'

export default class Baidu extends TileImage {
	constructor(optOptions) {
		let options = optOptions || {}
		let attributions = []
		if (options.attributions !== undefined) {
			attributions = options.attributions
		} else {
			attributions = [Baidu.attribution]
		}
		options.projection = options['projection'] ? options.projection : 'EPSG:3857'
		let crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : 'anonymous'
		let url =
			options.url !== undefined
				? options.url
				: 'http://online{0-3}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles={styles}&udt=20170607&scaler=1&p=1'
		let hidpi =
			options.hidpi ||
			(window.devicePixelRatio ||
				//@ts-ignore
				window.screen?.deviceXDPI / window.screen?.logicalXDPI) > 1
		url = url.replace('{styles}', hidpi ? 'ph' : 'pl')
		let tileUrlFunction = options.tileUrlFunction ? options.tileUrlFunction : undefined
		if (!tileUrlFunction) {
			tileUrlFunction = function (tileCoord) {
				let z = tileCoord[0]
				let x = tileCoord[1]
				let y = tileCoord[2]
				if (x < 0) {
					x = 'M' + -x
				}
				if (y < 0) {
					y = 'M' + -y
				}
				return url
					.replace('{0-3}', Baidu.getRandom(0, 3))
					.replace('{x}', x.toString())
					.replace('{y}', y.toString())
					.replace('{z}', z.toString())
			}
		}
		let levels = options['levels'] ? options['levels'] : 19
		let resolutions = []
		for (let z = 0; z < levels; z++) {
			resolutions[z] = Math.pow(2, levels - 1 - z)
		}
		let tileGrid = new TileGrid({
			tileSize: options['tileSize'] ? options['tileSize'] : 256,
			origin: options['origin'] ? options['origin'] : [0, 0],
			extent: options['extent'] ? options['extent'] : [-33554432, -33554432, 33554432, 33554432],
			resolutions: resolutions,
			minZoom: options['minZoom'] && typeof options['minZoom'] === 'number' ? options['minZoom'] : 0
		})
		super({
			tileGrid: tileGrid,
			attributions: attributions,
			cacheSize: options.cacheSize,
			projection: options.projection,
			crossOrigin: crossOrigin,
			opaque: options.opaque !== undefined ? options.opaque : true,
			// maxZoom: options.maxZoom !== undefined ? options.maxZoom : 19,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileUrlFunction: tileUrlFunction,
			url: url,
			wrapX: options.wrapX,
			tilePixelRatio: hidpi ? 2 : 1
		})
	}

	static attribution() {
		return new Attribution({
			// @ts-ignore
			html: '&copy; ' + '<a href="http://map.baidu.com/">百度地图</a> ' + 'contributors.'
		})
	}

	static getRandom(min, max) {
		let r = Math.random() * (max - min)
		let re = Math.round(r + min)
		re = Math.max(Math.min(re, max), min)
		return re
	}
}
