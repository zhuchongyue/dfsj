/**
 * 标绘类
 */
import OverlayType from '../overlay/OverlayType'
import DrawPolyline from './draw/DrawPolyline'
import {VectorLayer} from '../layer'
import DrawPoint from './draw/DrawPoint'
import DrawText from './draw/DrawText'
import DrawBillboard from './draw/DrawBillboard'

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
//********************edit
import EditPoint from "./edit/EditPoint";
import EditPolygon from "./edit/EditPolygon";
import EditPolyline from "./edit/EditPolyline";
import EditArc from "./edit/EditArc";
import EditFineArrow from "./edit/EditFineArrow";
import EditDoubleArrow from "./edit/EditDoubleArrow";
import EditAttackArrow from "./edit/EditAttackArrow";
import EditAssaultDirection from "./edit/EditAssaultDirection";
import EditStraightArrow from "./edit/EditStraightArrow";
import EditTailedAttackArrow from "./edit/EditTailedAttackArrow";
import EditTailedSquadCombat from "./edit/EditTailedSquadCombat";
import EditGatheringPlace from "./edit/EditGatheringPlace";
import EditFreehandPolyline from "./edit/EditFreehandPolyline";
import EditFreehandPolygon from "./edit/EditFreehandPolygon";
import EditRectangle from "./edit/EditRectangle";
import EditLune from "./edit/EditLune";
import EditEllipse from "./edit/EditEllipse";
import EditCircle from "./edit/EditCircle";
import EditSector from "./edit/EditSector";
import EditCurve from "./edit/EditCurve";
import EditCloseCurve from "./edit/EditCloseCurve";



export const POINT = [
	OverlayType.BILLBOARD,
	OverlayType.POINT,
	OverlayType.TEXT,
]
export const SINGLE = [
	OverlayType.POLYLINE,
	OverlayType.FREEHAND_POLYLINE,
]
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
			case OverlayType.POINT:
				drawWorker = new DrawPoint(options)
				break
			case OverlayType.TEXT:
				drawWorker = new DrawText(options)
				break
			case OverlayType.BILLBOARD:
				drawWorker = new DrawBillboard(options)
				break
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
		// console.log('开始绘制...', this._currentWorker, type)
		this._state = 'draw'
		if (this._currentWorker) {
			this._currentWorker.stop()
			this._currentWorker = null
		}
		this._currentWorker = this._createDrawWorker(type, options)?.start(this, {
			...this._options,
			onDrawStop: callback,
			type,
		})
		return this
	}

	_createEditWorker(overlay:any){
		let editWorker = undefined;
		switch (overlay.attr?.type) {
			case OverlayType.POINT:
			case OverlayType.TEXT:
			case OverlayType.BILLBOARD:
				editWorker = new EditPoint(overlay)
				break
			case OverlayType.POLYLINE:
				editWorker = new EditPolyline(overlay)
				break
			case OverlayType.POLYGON:
				editWorker = new EditPolygon(overlay)
				break
			case OverlayType.CIRCLE:
				editWorker = new EditCircle(overlay)
				break
			case OverlayType.ARC:
				editWorker = new EditArc(overlay)
				break
			case OverlayType.FINE_ARROW: //细箭头
				editWorker = new EditFineArrow(overlay)
				break
			case OverlayType.DOUBLE_ARROW:
				editWorker = new EditDoubleArrow(overlay)
				break
			case OverlayType.ATTACK_ARROW:
				editWorker = new EditAttackArrow(overlay)
				break
			case OverlayType.ASSAULT_DIRECTION:
				editWorker = new EditAssaultDirection(overlay)
				break
			case OverlayType.STRAIGHT_ARROW:
				editWorker = new EditStraightArrow(overlay)
				break
			case OverlayType.TAILED_ATTACK_ARROW:
				editWorker = new EditTailedAttackArrow(overlay)
				break
			case OverlayType.TAILED_SQUAD_COMBAT:
				editWorker = new EditTailedSquadCombat(overlay)
				break
			case OverlayType.FREEHAND_POLYLINE:
				editWorker = new EditFreehandPolyline(overlay)
				break
			case OverlayType.RECTANGLE:
				editWorker = new EditRectangle(overlay)
				break
			case OverlayType.ELLIPSE:
				editWorker = new EditEllipse(overlay)
				break
			case OverlayType.SECTOR:
				editWorker = new EditSector(overlay)
				break
			case OverlayType.LUNE:
				editWorker = new EditLune(overlay)
				break
			case OverlayType.CURVE:
				editWorker = new EditCurve(overlay)
				break
			case OverlayType.GATHERING_PLACE:
				editWorker = new EditGatheringPlace(overlay)
				break
			case OverlayType.CLOSED_CURVE:
				editWorker = new EditCloseCurve(overlay)
				break
			case OverlayType.FREEHAND_POLYGON:
				editWorker = new EditFreehandPolygon(overlay)
				break
		}
		return editWorker
	}

	edit(overlay, callback, options = {}) {
		this._state = 'edit'
		if (this._currentWorker) {
			this._currentWorker.stop()
		}
		this._currentWorker = this._createEditWorker(overlay)?.start(this, {
			...this._options,
			onEditStop: callback,
		})
		return this
	}



	stop() {
		if (this._currentWorker) {
			this._currentWorker.stop()
		}
		this._currentWorker = null
		return undefined
	}

	/** 设置样式*/
	setStyle(style){
		console.log(this._state , this._currentWorker)
		this._currentWorker.setStyle?.(style)
		this._currentWorker._overlay.setStyle?.(style)
		this._currentWorker._delegate.setStyle?.(style)
	}
	setAttr(attr){
		this._currentWorker.setAttr?.(attr)
		this._currentWorker._overlay.attr = attr
		this._currentWorker._delegate.attr = attr
	}
	destroy() {
		this._map.removeLayer(this._layer)
		this._map = undefined
		this._layer = undefined
		return this
	}
}
