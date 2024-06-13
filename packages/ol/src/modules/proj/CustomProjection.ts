import {register} from 'ol/proj/proj4'
import proj4 from 'proj4'
import Projection from 'ol/proj/Projection'
import {addProjection} from 'ol/proj'
import Transform from './Transform'
import * as proj from 'ol/proj.js'

/**
 * @classdesc 自定义坐标系
 * @module proj/CustomProjection
 */
const DEFAULT_SUPPORT_PROJECTION = ['EPSG:3857', 'EPSG:4326']
export default class CustomProjection {
	public projection = null
	static projection = null
	static epsgCode = null
	static strategy = {
		'EPSG:4490': (code) => {
			proj4.defs(code, Transform.proj4text[Transform.interconversion(code)]['proj4text'])
			register(proj4)
			const projection = new Projection({
				code,
				units: 'degrees',
				axisOrientation: 'neu'
			})
			projection.setExtent([-180, -90, 180, 90])
			projection.setWorldExtent([-180, -90, 180, 90])
			addProjection(projection)
			return projection
		}
	}

	/**
	 *  @param {String} epsgCode 'EPSG:4490'
	 *  @param {String} proj4Text 坐标参考串
	 */
	constructor(epsgCode) {
		if (DEFAULT_SUPPORT_PROJECTION.includes(epsgCode)) {
			this.projection = proj.get(epsgCode)
			CustomProjection.projection = proj.get(epsgCode)
			CustomProjection.epsgCode = epsgCode
		} else {
			if (!CustomProjection.strategy[epsgCode]) {
				throw new Error('自定义坐标配置不存在!' + epsgCode)
			}
			this.projection = CustomProjection.strategy[epsgCode](epsgCode)
			CustomProjection.projection = CustomProjection.strategy[epsgCode](epsgCode)
			CustomProjection.epsgCode = epsgCode
		}
	}

	/**
	 * 获取地图投影，如果不存在则注册。
	 *
	 * #注意：4490投影目前还有问题，请勿使用！
	 * @param code 投影代码
	 */
	static get(epsgCode) {
		let projection = undefined
		if (epsgCode == null) return projection
		if (DEFAULT_SUPPORT_PROJECTION.includes(epsgCode)) {
			projection = proj.get(epsgCode)
		} else {
			if (!CustomProjection.strategy[epsgCode]) {
				throw new Error('自定义坐标配置不存在!' + epsgCode)
			}
			projection = CustomProjection.strategy[epsgCode](epsgCode)
		}
		return projection

		// //如果投影为null，则使用默认投影（由ol决定）
		// if (CustomProjection.projection && code == CustomProjection.epsgCode) return CustomProjection.projection;
		// if (DEFAULT_SUPPORT_PROJECTION.includes(code)){
		//     return  proj.get(code);
		// }
		// new CustomProjection(code)
		// return  CustomProjection.projection ?? undefined;
	}
}
