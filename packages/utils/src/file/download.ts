import {dataURLtoBlob, urlToBase64} from './base64Conver'
import {openWindow} from '../common'
import {TargetContext} from '../../typings'
/**
 * 下载在线图片
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
	urlToBase64(url).then((base64) => {
		downloadByBase64(base64, filename, mime, bom)
	})
}
/**
 * 下载基于 base64 的图片
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
	const base64Buf = dataURLtoBlob(buf)
	downloadByData(base64Buf, filename, mime, bom)
}
/**
 * 根据后台接口文件流下载
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
	const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
	const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })
	// @ts-ignore
	if (typeof window.navigator.msSaveBlob !== 'undefined') {
		// @ts-ignore
		window.navigator.msSaveBlob(blob, filename)
	} else {
		const blobURL = window.URL.createObjectURL(blob)
		const tempLink = document.createElement('a')
		tempLink.style.display = 'none'
		tempLink.href = blobURL
		tempLink.setAttribute('download', filename)
		if (typeof tempLink.download === 'undefined') {
			tempLink.setAttribute('target', '_blank')
		}
		document.body.appendChild(tempLink)
		tempLink.click()
		document.body.removeChild(tempLink)
		window.URL.revokeObjectURL(blobURL)
	}
}

/**
 * 根据文件地址下载文件
 * @param {*} sUrl
 */
export function downloadByUrl({
	url,
	target = '_blank',
	fileName
}: {
	url: string
	target?: TargetContext
	fileName?: string
}): boolean {
	const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
	const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1

	if (/(iP)/g.test(window.navigator.userAgent)) {
		console.error('Your browser does not support download!')
		return false
	}
	if (isChrome || isSafari) {
		const link = document.createElement('a')
		link.href = url
		link.target = target

		if (link.download !== undefined) {
			link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)
		}

		if (document.createEvent) {
			const e = document.createEvent('MouseEvents')
			e.initEvent('click', true, true)
			link.dispatchEvent(e)
			return true
		}
	}
	if (url.indexOf('?') === -1) {
		url += '?download'
	}

	openWindow(url, { target })
	return true
}
