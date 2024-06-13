/**
 * 标绘类
 */
import OverlayType from '../overlay/OverlayType'
import DrawPolyline from './draw/DrawPolyline'
import {VectorLayer} from '../layer'
import DrawPolygon from './draw/DrawPolygon'
import DrawArc from './draw/DrawArc'
import DrawFineArrow from './draw/DrawFineArrow'
import DrawDoubleArrow from './draw/DrawDoubleArrow'
import DrawAttackArrow from './draw/DrawAttackArrow'
import DrawAssaultDirection from './draw/DrawAssaultDirection'
import DrawStraightArrow from './draw/DrawStraightArrow'
import DrawTailedAttackArrow from './draw/DrawTailedAttackArrow'
import DrawTailedSquadCombat from './draw/DrawTailedSquadCombat'
import DrawFreehandPolyline from './draw/DrawFreehandPolyline'
import DrawRectangle from './draw/DrawRectangle'
import DrawEllipse from './draw/DrawEllipse'
import DrawSector from './draw/DrawSector'
import DrawLune from './draw/DrawLune'
import DrawCurve from './draw/DrawCurve'
import DrawGatheringPlace from './draw/DrawGatheringPlace'
import DrawClosedCurve from './draw/DrawClosedCurve'
import DrawFreehandPolygon from './draw/DrawFreehandPolygon'
import DrawCircle from './draw/DrawCircle'

export default class Plot {
	public _map: any
	public _options: any
	public _state: string
	public _currentWorker: any
	public _layer: VectorLayer

	constructor(map, options: any = {}) {
		this._map = map
		this._options = options
		this._layer = new VectorLayer('plot-layer')
		this._map.addLayer(this._layer)
		this._state = undefined
	}

	get map() {
		return this._map
	}

	get layer() {
		return this._layer
	}

	get state() {
		return this._state
	}

	_createDrawWorker(type, options) {
		let drawWorker = null
		switch (type) {
			case OverlayType.POLYLINE:
				drawWorker = new DrawPolyline(options)
				break
			case OverlayType.POLYGON:
				drawWorker = new DrawPolygon(options)
				break
			case OverlayType.CIRCLE:
				drawWorker = new DrawCircle(options)
				break
			case OverlayType.ARC:
				drawWorker = new DrawArc(options)
				break
			case OverlayType.FINE_ARROW: //细箭头
				drawWorker = new DrawFineArrow(options)
				break
			case OverlayType.DOUBLE_ARROW:
				drawWorker = new DrawDoubleArrow(options)
				break
			case OverlayType.ATTACK_ARROW:
				drawWorker = new DrawAttackArrow(options)
				break
			case OverlayType.ASSAULT_DIRECTION:
				drawWorker = new DrawAssaultDirection(options)
				break
			case OverlayType.STRAIGHT_ARROW:
				drawWorker = new DrawStraightArrow(options)
				break
			case OverlayType.TAILED_ATTACK_ARROW:
				drawWorker = new DrawTailedAttackArrow(options)
				break
			case OverlayType.TAILED_SQUAD_COMBAT:
				drawWorker = new DrawTailedSquadCombat(options)
				break
			case OverlayType.FREE_HAND_POLYLINE:
				drawWorker = new DrawFreehandPolyline(options)
				break
			case OverlayType.RECTANGLE:
				drawWorker = new DrawRectangle(options)
				break
			case OverlayType.ELLIPSE:
				drawWorker = new DrawEllipse(options)
				break
			case OverlayType.SECTOR:
				drawWorker = new DrawSector(options)
				break
			case OverlayType.LUNE:
				drawWorker = new DrawLune(options)
				break
			case OverlayType.CURVE:
				drawWorker = new DrawCurve(options)
				break
			case OverlayType.GATHERING_PLACE:
				drawWorker = new DrawGatheringPlace(options)
				break
			case OverlayType.CLOSED_CURVE:
				drawWorker = new DrawClosedCurve(options)
				break
			case OverlayType.FREEHAND_POLYLINE:
				drawWorker = new DrawFreehandPolyline(options)
				break
			case OverlayType.FREEHAND_POLYGON:
				drawWorker = new DrawFreehandPolygon(options)
				break
		}
		return drawWorker
	}

	draw(type, callback, options = {}) {
		console.log('开始绘制...', this._currentWorker, type)
		this._state = 'draw'
		if (this._currentWorker) {
			this._currentWorker.stop()
			this._currentWorker = null
		}
		this._currentWorker = this._createDrawWorker(type, options)?.start(this, {
			...this._options,
			onDrawStop: callback
		})
		console.log('重新绘制...', this._currentWorker)
		return this
	}

	/**
	 *
	 * @return {Plot}
	 */
	stop() {
		if (this._currentWorker) {
			this._currentWorker.stop()
		}
		this._currentWorker = null
		return undefined
	}

	/**
	 *
	 * @returns {Plot}
	 */
	destroy() {
		this._map.removeLayer(this._layer)
		this._map = undefined
		this._layer = undefined
		return this
	}
}
