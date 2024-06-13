/***
 * 自定义请求头限制
 * 鉴权使用
 */
import TileState from 'ol/TileState'
import TileImage from 'ol/source/TileImage'

export const setRequestHeader = (source, header) => {
	if (source && source instanceof TileImage) {
		source.setTileLoadFunction(function (tile, src) {
			let xhr = new XMLHttpRequest()
			xhr.open('GET', src)
			if (header && Object.prototype.toString.call(header) === '[object Object]') {
				Object.keys(header).forEach((key) => {
					xhr.setRequestHeader(key, header[key])
				})
			}
			xhr.onloadstart = function () {
				xhr.responseType = 'blob'
			}
			xhr.addEventListener('loadend', function (evt) {
				let data = this.response
				if (data !== undefined) {
					// @ts-ignore
					tile.getImage().src = URL.createObjectURL(data)
					// @ts-ignore
					tile.getImage().onload = function () {
						URL.revokeObjectURL(this.src)
					}
				} else {
					tile.setState(TileState.ERROR)
				}
			})
			xhr.addEventListener('error', function () {
				tile.setState(TileState.ERROR)
			})

			xhr.send()
		})
		return source
	}
}
