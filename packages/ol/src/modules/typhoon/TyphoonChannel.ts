/**
 * 单个的台风
 * 台风的时间作为台风节点的唯一标识
 */
import {Feature, Observable} from 'ol'
import {TyphoonData, TyphoonForecast, TyphoonLocation, TyphoonOptions} from './types'
import {LayerGroup, VectorLayer} from '../layer'
import merge from 'lodash-es/merge'
import {pointOverlay, typhoonOptions} from './BasicConfig'
import {Billboard, Point, Polygon} from '../overlay'
import {MapEventType, OverlayEventType} from '../event/EventType'
import AdapterMapping from './adapter'
import {TTyphoonResultV2} from './adapter/result'
import Polyline from '../overlay/vector/Polyline'
import {GeometryFormatType} from '../overlay/GeometryType'
import * as turf from '@turf/turf'
import {diff} from '@dfsj/utils'
import MapEvent from '../event/type/MapEvent'

export enum ETyphoonLayer {
	TyphoonChannelGroup = 'TyphoonChannelGroup',
	WindCircle = 'WindCircle',
	WindRealPath = 'WindRealPath',
	WindRealNode = 'WindRealNode',
	StartPoint = 'StartPoint',
	LandPoint = 'LandPoint'
}

export interface TyphoonChannelOptions {
	autoPlay: boolean
	interval: number
	forecast: any[] | null | any
}

const angles = [0, 90, 180, 270]
const orders = [0, 1, 3, 2]
const defForecast = ['中国', '中国台湾', '日本', '中国香港', '美国']
export default class TyphoonChannel extends Observable {
	protected options: TyphoonOptions = null
	protected lands: any[] | Array<any> = [] // Land points
	protected effected: Feature[] | Array<any> = [] // Effect areas
	protected data: TyphoonData = null // Typhoon data
	protected handler = null // The timer handler
	protected projection: string
	private map: any
	public layerGroup: any
	public startLayer: any //起点
	public windRealPathLayer: any //实时路径
	public windRealNodeLayer: any //实时节点信
	public windCircleLayer: any //当前风圈
	public landLayer: any //登陆点
	public channelId: any
	public autoPlay: boolean = true //是否自动播放
	public interval: number = 150 //自动播放的时间
	public playing = false //正在播放;
	public index: number = 0 //播放的索引
	public timer: any = null //定时器
	//预报的选项
	private forecast: Array<any | string> | any = []
	public forecastLayerMap: Map<any, any> = new Map()

	constructor(
		channelId: any,
		options: Partial<TyphoonChannelOptions> = {
			autoPlay: true,
			interval: 150,
			forecast: defForecast
		}
	) {
		super()
		this.channelId = channelId
		this.layerGroup = new LayerGroup(ETyphoonLayer.TyphoonChannelGroup + channelId)
		this.autoPlay = options?.autoPlay
		this.interval = options?.interval
		this.index = 0
		this.forecast = options.forecast
	}

	_showOverlay(e, loader: Function, defCoordinate?: []) {
		const fixed = e?.argument?.fixed
		let Transform = this.map.transform
		const coordinate = Transform.transformToLonLat(e?.argument?.coordinate ?? defCoordinate)
		if (fixed) {
			this.map.popup.setPosition(coordinate)
		} else {
			const strHtml = loader?.call(this)
			this.map.popup.show(coordinate, strHtml)
		}
	}

	/**
	 * 初始话检查一下
	 */
	_initBasicLayer() {
		if (!this.windRealPathLayer) {
			this.windRealPathLayer = new VectorLayer(ETyphoonLayer.WindRealPath + this.channelId)
			let realLine = new Polyline([], {
				geometryType: GeometryFormatType.Polyline
			})
			this.windRealPathLayer.addOverlay(realLine)
			this.layerGroup.addLayer(this.windRealPathLayer)
		}
		if (!this.windRealNodeLayer) {
			this.windRealNodeLayer = new VectorLayer(ETyphoonLayer.WindRealNode + this.channelId)
			this.layerGroup.addLayer(this.windRealNodeLayer)
		}
		if (!this.landLayer) {
			this.landLayer = new VectorLayer(ETyphoonLayer.LandPoint + this.channelId)
			this.layerGroup.addLayer(this.landLayer)
		}
	}

	/** 播放*/
	play() {
		const optioned: TyphoonOptions = this.options
		const data = this.data
		const realPath = data?.locations ?? []
		const length = realPath?.length || 0
		//超过就移除定时器
		if (this.index >= length) {
			clearInterval(this.timer)
			this.playing = false
			return
		}
		this.playing = true
		let node = realPath[this.index] //实际位置节点
		let curPosition = node.coordinates
		let nextPosition: any = [] //下一个点
		if (this.index < realPath.length - 1) {
			let nextNode = realPath[this.index + 1]
			nextPosition = nextNode.coordinates
		}
		this.drawWindCircle(node, optioned)
		//创建路径
		// console.log({curPosition, nextPosition})
		if (nextPosition.length) {
			let overlay = this.windRealPathLayer?.getOverlays?.()?.[0]
			// console.log('overlay', overlay)
			if (!overlay) return
			overlay.attr = { data }
			overlay.setStyle(this.options.path)
			if (this.index == 0) {
				overlay.setCoordinates([curPosition, nextPosition])
			} else {
				overlay.appendCoordinate(nextPosition)
			}
		}
		//创建节点
		let nodePoint = new Point(node.coordinates)
		nodePoint.attr = { data, node }
		nodePoint.setStyle(optioned.point)
		//鼠标移入事件
		nodePoint.listen(OverlayEventType.MOUSEOVER, (e) => {
			const execute = () => {
				const { title, content } = pointOverlay
				return `
                        <div>${title(nodePoint?.attr)}
                        ${content(nodePoint?.attr)}
                        </div>
                        `
			}

			this._showOverlay(e, execute, nodePoint.center)
		})
		//鼠标移除事件
		nodePoint.listen(OverlayEventType.MOUSEOUT, (e) => {
			this.map.popup.hide()
		})
		//鼠标点击节点信息
		nodePoint.listen(OverlayEventType.CLICK, (e) => {
			//@ts-ignore
			if (!nodePoint.attr.node?.time) return
			this.map.dispatchEvent(
				new MapEvent(MapEventType.TYPHOON, {
					data,
					node
				})
			)
			//@ts-ignore
			this.active(nodePoint.attr.node?.time)
		})

		this.windRealNodeLayer.addOverlay(nodePoint)
		this.index = this.index + 1
	}

	/** 无需播放*/
	direct() {
		const data = this.data
		const realPath = data?.locations ?? []
		realPath.forEach((node: TyphoonLocation) => {
			let nodePoint = new Point(node.coordinates)
			nodePoint.attr = { data, node }
			nodePoint.setStyle(this.options.point)
			//鼠标移入事件
			nodePoint.listen(OverlayEventType.MOUSEOVER, (e) => {
				const execute = () => {
					const { title, content } = pointOverlay
					return `
                          <div>${title(nodePoint?.attr)}
                    ${content(nodePoint?.attr)}
                    </div> 
                        `
				}
				this._showOverlay(e, execute, nodePoint.center)
			})
			//鼠标移除事件
			nodePoint.listen(OverlayEventType.MOUSEOUT, (e) => {
				this.map.popup.hide()
			})
			this.windRealNodeLayer.addOverlay(nodePoint)
			//路线
			const coords = data.locations.reduce((p, v) => p.concat([v.coordinates]), [])
			let overlay = this.windRealPathLayer?.getOverlays?.()?.[0]
			if (!overlay) return
			overlay.attr = { data }
			overlay.setStyle(this.options.path)
			overlay.setCoordinates(coords)
		})
		this.drawWindCircle(data.locations[data.locations.length - 1], this.options)
	}

	/**
	 * 设置数据
	 * @param data
	 * @param options
	 */
	update(originData: TTyphoonResultV2 | any, options?: TyphoonOptions) {
		let data = null
		this.data = data = AdapterMapping.v2.convert(originData)
		console.log(' this.data', this.data)
		this.calcDices(this.data.land, this.data.locations)
		if (!data) return
		const optioned: TyphoonOptions = (this.options = merge({}, typhoonOptions, options))
		this._initBasicLayer()
		const start = data.locations[0]
		this.drawStart(start, optioned)
		if (this.autoPlay) {
			this.timer = setInterval(this.play.bind(this), this.interval)
		} else {
			this.direct()
		}
		return this
	}

	/**
	 * 绘制起始点
	 */
	drawStart(start: TyphoonLocation, optioned?: TyphoonOptions) {
		let layer = this.startLayer
		const data = this.data
		if (layer) {
			layer.clear?.()
		} else {
			layer = new VectorLayer(ETyphoonLayer.StartPoint + this.channelId)
			this.startLayer = layer
			this.layerGroup.addLayer(layer)
		}
		let startPoint = new Point(start.coordinates)
		startPoint.attr = { data, node: start }
		startPoint.setStyle(optioned.start)
		startPoint.listen(OverlayEventType.MOUSEOVER, (e) => {
			console.log('鼠标移入开始点', e)
		})
		layer.addOverlay(startPoint)
	}

	/** 绘制预报路径*/
	drawForecast(center: TyphoonLocation, optioned: TyphoonOptions) {
		const data = this.data
		center.forecast?.forEach((forecast: TyphoonForecast) => {
			const organization = forecast.organization
			const locations = forecast.locations
			let layer = this.forecastLayerMap.get(organization) ?? null
			if (layer) {
				layer?.clear?.()
			} else {
				layer = new VectorLayer(organization + this.channelId)
				this.layerGroup.addLayer(layer)
			}
			locations.forEach((node) => {
				let forecastPoint = new Point(node.coordinates)
				forecastPoint.attr = { data, node, forecast }
				forecastPoint.setStyle(optioned.point)
				//鼠标移入事件
				forecastPoint.listen(OverlayEventType.MOUSEOVER, (e) => {
					const execute = () => {
						const { title, content } = pointOverlay
						return `
                       <div>${title(forecastPoint?.attr)}
                    ${content(forecastPoint?.attr)}
                        </div>
                        `
					}

					this._showOverlay(e, execute, forecastPoint.center)
				})
				//鼠标移除事件
				forecastPoint.listen(OverlayEventType.MOUSEOUT, (e) => {
					this.map.popup.hide()
				})
				layer.addOverlay(forecastPoint)
			})
			let coords = forecast.locations.reduce((p, v) => p.concat([v.coordinates]), [])
			let forecastLine = new Polyline(coords, {
				geometryType: GeometryFormatType.Polyline
			})
			forecastLine.attr = { data: forecast }
			forecastLine.setStyle(optioned.path)
			layer.addOverlay(forecastLine)
			//设置
			if (!this.forecast?.includes(organization)) {
				layer.setVisible(false)
			}
			this.forecastLayerMap.set(organization, layer)
		})
	}

	/*** 绘制登陆点信息点*/

	drawLand(center: TyphoonLocation, optioned: TyphoonOptions) {
		//@ts-ignore
		const index = center?.index
		const land = this.lands.find((l) => l.index == index)
		if (land) {
			let landBillBoard = new Billboard(land.coordinates, {})
			landBillBoard.attr = { data: center, node: land }
			landBillBoard.setStyle(optioned.land)
			//展示登陆点的信息
			landBillBoard.listen(OverlayEventType.MOUSEOVER, (e) => {
				const execute = () => {
					const { title, content } = optioned.land?.overlay
					return `
                         <div>${title?.(landBillBoard.attr)}
                    ${content?.(landBillBoard?.attr)}
                    </div> 
                        `
				}
				//@ts-ignore
				this._showOverlay(e, execute, landBillBoard.center)
			})
			//鼠标移除事件
			landBillBoard.listen(OverlayEventType.MOUSEOUT, (e) => {
				this.map.popup.hide()
			})

			this.landLayer.addOverlay(landBillBoard)
		}
	}

	/**
	 * 绘制中心圈
	 * @param center
	 * @param optioned
	 */
	drawWindCircle(center: TyphoonLocation, optioned: TyphoonOptions) {
		let layer = this.windCircleLayer
		//当前的位置
		const data = this.data
		if (layer) {
			layer.clear?.()
		} else {
			layer = new VectorLayer(ETyphoonLayer.WindCircle + this.channelId)
			this.windCircleLayer = layer
			this.layerGroup.addLayer(layer)
		}

		let centerPoint = new Billboard(center.coordinates, {})
		centerPoint.attr = { data, node: center }
		//如果是在编的就需要旋转
		if (data.alive) {
			centerPoint.animation = { type: 'rotation' }
		}
		centerPoint.setStyle(optioned.center)
		layer.addOverlay(centerPoint)
		// console.log('center', center)
		if (center.radius7) {
			//@ts-ignore
			let point1 = this.getSectorPoints(center.coordinates, center.radius7.ne, 0, 90, 90)
			//@ts-ignore
			let point2 = this.getSectorPoints(center.coordinates, center.radius7.se, 90, 180, 90)
			//@ts-ignore
			let point3 = this.getSectorPoints(center.coordinates, center.radius7.sw, 180, 270, 90)
			//@ts-ignore
			let point4 = this.getSectorPoints(center.coordinates, center.radius7.nw, 270, 360, 90)
			const poly1 = turf.polygon([point1])
			const poly2 = turf.polygon([point2])
			const poly3 = turf.polygon([point3])
			const poly4 = turf.polygon([point4])
			const union = turf.union(poly1, poly2)
			const union1 = turf.union(union, poly3)
			const union2 = turf.union(union1, poly4)
			const shapeCoords = union2.geometry.coordinates
			const radius7 = new Polygon(shapeCoords, {
				geometryType: GeometryFormatType.Polygon
			})
			radius7.attr = { ...center }
			radius7.setStyle(optioned.radius7)
			//展示风圈的信息
			radius7.listen(OverlayEventType.MOUSEOVER, (e) => {
				//todo
				const execute = () => {
					const { title, content } = optioned.radius7?.overlay
					return `
                         <div>${title}
                    ${content?.(radius7?.attr)}
                    </div> 
                        `
				}
				//@ts-ignore
				this._showOverlay(e, execute, radius7.center)
			})
			//鼠标移除事件
			radius7.listen(OverlayEventType.MOUSEOUT, (e) => {
				this.map.popup.hide()
			})
			layer.addOverlay(radius7)
		}
		if (center.radius10) {
			//@ts-ignore
			let point1 = this.getSectorPoints(center.coordinates, center.radius10.ne, 0, 90, 90)
			//@ts-ignore
			let point2 = this.getSectorPoints(center.coordinates, center.radius10.se, 90, 180, 90)
			//@ts-ignore
			let point3 = this.getSectorPoints(center.coordinates, center.radius10.sw, 180, 270, 90)
			//@ts-ignore
			let point4 = this.getSectorPoints(center.coordinates, center.radius10.nw, 270, 360, 90)
			const path = point1.concat(point2).concat(point3).concat(point4)
			const p = path.filter((e) => {
				return e[0] != center.coordinates[0] && e[1] != center.coordinates[1]
			})
			const radius10 = new Polygon([p], {
				geometryType: GeometryFormatType.Polygon
			})
			radius10.attr = center
			radius10.setStyle(optioned.radius10)
			//展示风圈的信息
			radius10.listen(OverlayEventType.MOUSEOVER, (e) => {
				const execute = () => {
					const { title, content } = optioned.radius10?.overlay
					return `
                         <div>${title}
                    ${content?.(radius10?.attr)}
                    </div> 
                        `
				}
				//@ts-ignore
				this._showOverlay(e, execute, radius10.center)
			})
			//鼠标移除事件
			radius10.listen(OverlayEventType.MOUSEOUT, (e) => {
				this.map.popup.hide()
			})
			layer.addOverlay(radius10)
		}

		if (center.radius12) {
			//@ts-ignore
			let point1 = this.getSectorPoints(center.coordinates, center.radius12.ne, 0, 90, 90)
			//@ts-ignore
			let point2 = this.getSectorPoints(center.coordinates, center.radius12.se, 90, 180, 90)
			//@ts-ignore
			let point3 = this.getSectorPoints(center.coordinates, center.radius12.sw, 180, 270, 90)
			//@ts-ignore
			let point4 = this.getSectorPoints(center.coordinates, center.radius12.nw, 270, 360, 90)
			const path = point1.concat(point2).concat(point3).concat(point4)
			const p = path.filter((e) => {
				return e[0] != center.coordinates[0] && e[1] != center.coordinates[1]
			})
			const radius12 = new Polygon([p], {
				geometryType: GeometryFormatType.Polygon
			})
			radius12.attr = center
			radius12.setStyle(optioned.radius12)
			//展示风圈的信息
			radius12.listen(OverlayEventType.MOUSEOVER, (e) => {
				const execute = () => {
					const { title, content } = optioned.radius12?.overlay
					return `
                         <div>${title}
                    ${content?.(radius12?.attr)}
                    </div> 
                        `
				}
				//@ts-ignore
				this._showOverlay(e, execute, radius12.center)
			})
			//鼠标移除事件
			radius12.listen(OverlayEventType.MOUSEOUT, (e) => {
				this.map.popup.hide()
			})
			layer.addOverlay(radius12)
		}

		// center.radius7
		if (false) {
			// if (this.radius == null) {
			const items = center.radius7,
				coords = center.coordinates
			const radiusCoords: number[][] = items
				.map((e, i) => {
					let radius = items[orders[i]] / 100
					let count = 90
					let endAngle = angles[i] + 90
					return Array.from({ length: count }, (_, j) => {
						let angle = angles[i] + ((endAngle - angles[i]) * j) / count
						let sin = Math.sin((angle * Math.PI) / 180)
						let cos = Math.cos((angle * Math.PI) / 180)
						let pos = [coords[0] + radius * sin, coords[1] + radius * cos]
						return pos
					})
				})
				.reduce((p, v) => p.concat(v), [])
			const radius7 = new Polygon([radiusCoords], {
				geometryType: GeometryFormatType.Polygon
			})
			radius7.attr = center
			//@ts-ignore
			radius7.setStyle(optioned.radius)
			layer.addOverlay(radius7)
		}
		//绘制预报
		this.drawForecast(center, optioned)
		this.drawLand(center, optioned)
	}

	/** 计算登陆点在路径里面的索引位子*/
	calcDices(loginPoints, pathPoints) {
		const loginIndices = []
		for (let i = 0; i < loginPoints.length; i++) {
			const loginPoint = loginPoints[i]
			let closestIndex = 0
			let minTimeDiff = Infinity
			for (let j = 0; j < pathPoints.length; j++) {
				const pathPoint = pathPoints[j]
				const timeDiff = Math.abs(
					new Date(loginPoint.time).getTime() - new Date(pathPoint.time).getTime()
				)
				if (timeDiff < minTimeDiff) {
					minTimeDiff = timeDiff
					closestIndex = j
				}
			}
			let land = { ...loginPoint, index: closestIndex }
			loginIndices.push(land)
		}
		this.lands = loginIndices
	}

	/***
	 * 绘制影响范围区域
	 * @param time
	 */
	drawEffect() {}

	active(time: string | number) {
		if (!time) throw Error('必须传入台风节点的唯一标识！')
		const current = this.data?.locations?.find((lo) => {
			return time === lo?.time
		})
		if (current) {
			this.drawWindCircle(current, this.options)
		}
	}

	/** 设置预报台的显示隐藏*/
	setForecastChannel(arg: boolean | Array<string>) {
		if (typeof arg == 'boolean') {
			if (!this.forecastLayerMap.size) throw Error('预报台数据为空！')
			this.forecastLayerMap.forEach((value, key, map) => {
				value?.setVisible?.(arg)
			})
			this.forecast = arg ? defForecast : []
		} else if (Array.isArray(arg)) {
			const {absent, additional, identical} = diff(this.forecast, arg)
			if (absent.length) {
				absent.forEach((value) => {
					let layer = this.forecastLayerMap.get(value)
					layer?.setVisible?.(false)
				})
			}
			if (additional.length) {
				additional.forEach((value) => {
					let layer = this.forecastLayerMap.get(value)
					layer?.setVisible?.(true)
				})
			}
			this.forecast = [...arg]
		}
	}

	/***
	 * 清空数据
	 */
	clear() {
		this.windRealNodeLayer?.clear?.()
		this.windRealPathLayer?.clear?.()
		this.windCircleLayer?.clear?.()
		this.startLayer?.clear?.()
		this.landLayer?.clear?.()
		this.forecastLayerMap.forEach((value, key, map) => {
			value?.clear?.()
		})
	}

	/***
	 * 移除覆盖物
	 * @param overlays
	 */
	remove(overlays: any | Array<any>) {
		this.clear()
	}

	/***
	 * 加入到地图展示
	 * @param map
	 */
	addTo(map: any) {
		this.map = map
		map.addLayerGroup(this.layerGroup)
		this.map.popup.enable = true
	}

	/***
	 * 销毁台风
	 */
	dispose() {
		this.layerGroup && this.map.removeLayerGroup(this.layerGroup)
		this.map.popup.enable = false
		this.map = null
		this.layerGroup = null
		this.clear()
		this.windRealNodeLayer = null
		this.windRealPathLayer = null
		this.windCircleLayer = null
		this.startLayer = null
		this.landLayer = null
	}

	/**
	 * @description 逆时针计算扇形风圈的点集合
	 * @param center - {Array<String|Number>}中心点，例如[117.23,23.123]
	 * @param radius - {String|Number} 半径km
	 * @param startAngle - {String|Number} 起始角度（单位°）
	 * @param endAngle - {String|Number} 结束角度（单位°）
	 * @param pointNum - {String|Number} 返回构成的弧点个数，默认30
	 * @return {Array}
	 */
	getSectorPoints(center, radius, startAngle, endAngle, pointNum) {
		radius = Number(radius) * 1000
		// const metersPerUnit = CustomProjection.projection.getMetersPerUnit();
		let metersPerUnit = 111319.49079327358 //1度多少米
		radius = radius / metersPerUnit //转化为度
		center = [Number(center[0]), Number(center[1])]
		startAngle = Number(startAngle)
		endAngle = Number(endAngle)
		pointNum = Number(pointNum || 30)
		let sin
		let cos
		let x
		let y
		let angle
		let points = new Array()
		let pointsLL = new Array()
		points.push([center[0], center[1]])
		for (let i = 0; i <= pointNum; i++) {
			angle = startAngle + ((endAngle - startAngle) * i) / pointNum
			sin = Math.sin((angle * Math.PI) / 180)
			cos = Math.cos((angle * Math.PI) / 180)
			x = center[0] + radius * sin
			y = center[1] + radius * cos

			points[i + 1] = [x, y]
		}
		points.push([center[0], center[1]])
		for (let j = 0; j < points.length; j++) {
			pointsLL[j] = points[j]
		}

		return pointsLL
	}
}
