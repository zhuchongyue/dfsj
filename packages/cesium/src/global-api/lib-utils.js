import {Cesium, echarts, Supercluster, turf} from './index'

const cache = {}
const DEF_BASE_URL = '/cesium/'
let _baseUrl = DEF_BASE_URL

/**
 * register lib
 * @param name
 * @param lib
 */
export function registerLib(name, lib) {
	cache[name] = lib
}

/**
 * get lib
 * @param name
 * @return {*}
 */
export function getLib(name) {
	return cache[name]
}

/**
 * 1、注册需要用到的库
 * 2、设置cesium的资源地址
 * 3、启动
 */
function register() {
	console.log('注册库...')
	registerLib('Cesium', Cesium)
	registerLib('Supercluster', Supercluster)
	registerLib('turf', turf)
	registerLib('echarts', echarts)
}

export function setResourcesUrl(baseUrl) {
	_baseUrl = baseUrl ?? DEF_BASE_URL
	const Cesium = getLib('Cesium')
	if (!Cesium) {
		throw new Error('missing Cesium Lib')
	}
	_baseUrl && Cesium.buildModuleUrl.setBaseUrl(_baseUrl)
}

register()
