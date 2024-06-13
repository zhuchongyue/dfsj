import {EsriJSON, GeoJSON, GPX, IGC, KML, MVT, Polyline, TopoJSON, WFS, WKT, WMSGetFeatureInfo} from 'ol/format'
import OSMXML from 'ol/format/OSMXML'
import GMLBase from 'ol/format/GMLBase'
import {Geometry as olGeometry, LineString, Point, Polygon} from 'ol/geom'
import {GeometryFormatType} from '../overlay/GeometryType'
import {CustomProjection, ProjTypes} from '../proj'

const SOURCE_KEY = `dataProjection` // 数据源的投影
const DESTINATION_KEY = `featureProjection` //需要转换到目的投影
export default class GeometryHelper {
	static getFormatType(format: GeometryFormatType) {
		let type
		if (format) {
			switch (format) {
				case GeometryFormatType.MVT:
					type = new MVT()
					break
				case GeometryFormatType.GeoJSON:
					type = new GeoJSON()
					break
				case GeometryFormatType.EsriJSON:
					type = new EsriJSON()
					break
				case GeometryFormatType.TopoJSON:
					type = new TopoJSON()
					break
				case GeometryFormatType.IGC:
					type = new IGC()
					break
				case GeometryFormatType.Polyline:
					type = new Polyline()
					break
				case GeometryFormatType.WKT:
					type = new WKT()
					break
				case GeometryFormatType.GMLBase:
					type = new GMLBase()
					break
				case GeometryFormatType.GPX:
					type = new GPX()
					break
				case GeometryFormatType.KML:
					type = new KML()
					break
				case GeometryFormatType.OSMXML:
					type = new OSMXML()
					break
				case GeometryFormatType.WFS:
					type = new WFS()
					break
				case GeometryFormatType.WMSGetFeatureInfo:
					type = new WMSGetFeatureInfo()
					break
				default:
					type = new WKT()
					break
			}
		}
		return type
	}

	/**
	 * 读取空间信息(无类型默认以wkt方式读取)
	 * @param geomData
	 * @param options
	 * @returns {*}
	 * 1、geomData:直接是geom的数据
	 * 2、geomData:是对象形式  {
	 *     geometry：是geom数据、数组
	 *     geomType：是枚举类的type数据结构
	 * }
	 */
	static getGeomFromGeomData(geomData, options = {}) {
		//给定默认的
		if (!Reflect.has(options, SOURCE_KEY) || !Reflect.has(options, DESTINATION_KEY)) {
			Reflect.defineProperty(options, SOURCE_KEY, { value: ProjTypes.EPSG4326 })
			Reflect.defineProperty(options, DESTINATION_KEY, { value: CustomProjection.epsgCode })
		}

		/** 检查投影信息*/
		const definedProj =
			Reflect.has(options, SOURCE_KEY) &&
			Reflect.has(options, DESTINATION_KEY) &&
			options[SOURCE_KEY] &&
			options[DESTINATION_KEY]
		const transformProj = (geom: any) => {
			if (definedProj) {
				//坐标系如果相同则不需要转换
				if (options[SOURCE_KEY] == options[DESTINATION_KEY]) return geom
				return geom.transform(options[SOURCE_KEY], options[DESTINATION_KEY])
			}
			return geom
		}
		options = options || {}
		let featureGeom = null
		if (!geomData) return
		try {
			/**
			 * geomData直接是Geom
			 */
			if (geomData instanceof olGeometry) {
				featureGeom = geomData
				if (definedProj) {
					featureGeom = transformProj(featureGeom)
				}
				/**
				 * 存在geometry字段并且为Geom
				 * */
			} else if (Reflect.has(geomData, 'geometry') && geomData['geometry'] instanceof olGeometry) {
				featureGeom = geomData['geometry']
				if (definedProj) {
					featureGeom = transformProj(featureGeom)
				}
				/**
				 * 点数据
				 */
			} else if (
				(Array.isArray(geomData) && geomData?.length == 2) ||
				options['geometryType'] == GeometryFormatType.Point
			) {
				featureGeom = transformProj(new Point(geomData))
			} else if (options['geometryType'] == GeometryFormatType.Polyline) {
				featureGeom = transformProj(new LineString(geomData))
			} else if (options['geometryType'] == GeometryFormatType.Polygon) {
				featureGeom = transformProj(new Polygon(geomData))
			} else {
				if (Reflect.has(options, 'geometryType') || Reflect.has(geomData, 'geometryType')) {
					const geomType = options['geometryType'] || geomData['geometryType']
					let geomFormat = GeometryHelper.getFormatType(geomType)
					console.log('geomFormat', geomData, geomFormat, options)
					featureGeom = geomFormat.readGeometry(geomData?.['geometry'] || geomData, {
						dataProjection: options[SOURCE_KEY] ?? ProjTypes.EPSG4326,
						featureProjection: options[DESTINATION_KEY] ?? CustomProjection.epsgCode
					})
				}
			}
			// console.log(CustomProjection.epsgCode)
			// console.log('0000000', featureGeom)
			return featureGeom
		} catch (e) {
			console.log({ e })
		}
	}
}
