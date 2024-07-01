/**
 * 编辑的工具
 */
import {MouseEventType, PlotEventType} from '../event/EventType'
import {Observable} from 'ol'
import {unByKey} from 'ol/Observable'
import {VectorLayer} from '../layer'
import PlotEvent from '../event/type/PlotEvent'
import {Point} from '../overlay'
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom'
import DragPan from 'ol/interaction/DragPan'; 

const DEF_OPTS = {
    icon_center_color: 'yellow',
    icon_anchor_color: 'red',
    icon_midAnchor_color: 'blue',
}

class EditTool extends Observable {
    public _map: any
    public _anchorLayer: any
    public _tooltipMess: undefined
    public _options: any = {}
    public clickListener: any
    public contextmenuListener: any
    //操作过程中需要取消一些地图的默认交互   比如：双击放大地图   鼠标拖动地图
    public dblClickZoomInteraction: DoubleClickZoom;
    public dragPanInteraction: DragPan;
    protected _pickedAnchor: any;
    protected _isMoving: boolean;
    protected _anchors: any[];
    //编辑只需要这3个事件  并且记录一下当前活动的控制点
    protected startPoint: [number, number];//整体拖动的起始点;
    protected entirety: any;//整体移动
    protected controlPoint: any;//当前处理的控制点
    protected pointerdownListener: any; //鼠标按下事件
    protected pointerupListener: any; //鼠标抬起事件
    protected pointermoveListener: any;//鼠标移动事件
    //初始的位置
    protected anchorsPositions: any[][];//坐标点信息  方便拖拽时使用
    constructor() {
        super()
        this._anchorLayer = new VectorLayer('edit-anchor-layer', {
            zIndex: 100
        })
        this._options = {}
        this._tooltipMess = undefined
        this._pickedAnchor = undefined
        this._isMoving = false
        this._anchors = [];
        this.anchorsPositions = []
    }

    set tooltipMess(tooltipMess) {
        this._tooltipMess = tooltipMess
    }

    //********************* start *********************
    //查看是否为控制点  是则变化鼠标样式
    _onMouseOverOutHandler(e) {
        const overlay = e?.movement?.overlay;
        const position = e?.movement?.coordinate ?? null
        if (!position) {
            return false
        }
        if (overlay) {
            const attr = overlay.attr;
            const plot = attr?.plot;
            const control = attr?.control;
            if (plot || control) {
                this._map._delegate.getTargetElement().style.cursor = 'move';
            }
            let message: any = null;
            unByKey(this.pointerdownListener)
            this.pointerdownListener = null
            unByKey(this.pointerupListener)
            this.pointerupListener = null
            if (plot) {
                message = `<span style="color: red;font-weight: bolder">整体:</span>按下鼠标拖动!`;
                // unByKey(this.pointermoveListener)
                // this.pointermoveListener = null;
                this.pointerdownListener = this._map.on(MouseEventType.POINTERDOWN, this._onMouseDownHandler.bind(this))
                // console.log('这是矢量面', overlay)
            }
            if (control) {
                message = `<span style="color: #bf00ff;font-weight: bolder">控制点:</span>按下鼠标拖动!`;
                // unByKey(this.pointermoveListener)
                // this.pointermoveListener = null;
                this.pointerdownListener = this._map.on(MouseEventType.POINTERDOWN, this._onMouseDownHandler.bind(this))
                // console.log('这是控制点', overlay)
            }
            this.fire(new PlotEvent(PlotEventType.ANCHOR_MOVING, position, {message}))
            if (!Reflect.has(attr, 'plot') && !Reflect.has(attr, 'control')) {
                this.fire(new PlotEvent(PlotEventType.ANCHOR_MOVING, position, {hideTip: true}))
            }
        } else {
            this.fire(new PlotEvent(PlotEventType.ANCHOR_MOVING, position, {hideTip: true}))
        }
    }

    //在控制点按下鼠标
    _onMouseDownHandler(e) {
        const overlay = e?.movement?.overlay;
        const position = e?.movement?.coordinate ?? null
        if (!position) {
            return false
        }  ;
        //是控制点
        if (overlay?.attr?.control) {
            this.entirety = null;
            this.controlPoint = overlay;
            this.startPoint = position;
            // this._map.off(MouseEventType.POINTER_MOVE, this._onMouseOverOutHandler.bind(this))
            unByKey(this.pointermoveListener);
            this.pointermoveListener = null;
            unByKey(this.pointerupListener);
            this.pointerupListener = null;
            this.fire(new PlotEvent(PlotEventType.ANCHOR_DOWN, position, {
                ...this.controlPoint.attr
            }))
            this.pointermoveListener = this._map.on(MouseEventType.POINTER_MOVE, this._onControlPointMouseMoveHandler.bind(this))
            this.pointerupListener = this._map.on(MouseEventType.POINTERUP, this._onMouseUpHandler.bind(this))
        }
        ;
        //整体拖动
        if (overlay?.attr?.plot) {
            this.controlPoint = null;
            this.entirety = overlay;
            this.startPoint = position;
            unByKey(this.pointermoveListener);
            unByKey(this.pointerupListener);
            this.fire(new PlotEvent(PlotEventType.ANCHOR_DOWN, position, {
                ...this.entirety.attr
            }))
            this.pointermoveListener = this._map.on(MouseEventType.POINTER_MOVE, this._onControlPointMouseMoveHandler.bind(this))
            this.pointerupListener = this._map.on(MouseEventType.POINTERUP, this._onMouseUpHandler.bind(this))
        }
    }

    //鼠标按键抬起
    _onMouseUpHandler(e) {
        unByKey(this.pointermoveListener);
        unByKey(this.pointerupListener);
        this.pointerupListener = null;
        this.pointermoveListener = null;
        this.startPoint = [0, 0];
        this._onEditPause()
        this.pointermoveListener = this._map.on(MouseEventType.POINTER_MOVE, this._onMouseOverOutHandler.bind(this))
    }

    _onControlPointMouseMoveHandler(e) {
        e?.stopPropagation();
        e?.preventDefault();
        this._map._delegate.getTargetElement().style.cursor = 'move';
        const movement = e?.movement;
        const position = movement?.coordinate ?? null
        if (!position) {
            return false
        }
        ;
        //控制点
        if (this.controlPoint) {
            this.controlPoint.setCoordinates(position);
            this.fire(new PlotEvent(PlotEventType.ANCHOR_MOVING, position, {
                ...this.controlPoint.attr
            }))
            //整体移动
        } else if (this.entirety) {
            unByKey(this.pointerdownListener)
            let dx = position[0] - this.startPoint[0];
            let dy = position[1] - this.startPoint[1];
            this._anchors.forEach((anchor, index) => {
                const ap = this.anchorsPositions[index];
                if (ap?.[0] && ap?.[1]){
                    let coordinate = [ap[0] + dx, ap[1] + dy];
                    anchor.setCoordinates(coordinate);
                }
            })
            this.fire(new PlotEvent(PlotEventType.ANCHOR_MOVING, position, {
                ...this.entirety.attr,
                dx,
                dy
            }))
        }
    }

    //********************* end *********************
    _onClick(e) {
        const overlay = e?.movement?.overlay;
        const position = e?.movement?.coordinate ?? null;
        const attr = overlay?.attr ?? {}
        if (!position) {
            return false
        }
        ;
        if (!overlay && !Reflect.has(attr, 'plot') && !Reflect.has(attr, 'control')) {
            this._onEditStop()
        }
    }

    _onContextmenu(e) {
         //阻止浏览器右键的默认事件
        e?.preventDefault?.();
        e?.stopPropagation?.();
    }
    _onEditPause() {
        this._anchors.forEach((value, index) => {
            const ap = value?.position;
            if (ap?.[0] && ap?.[1]) this.anchorsPositions[index] = ap
        })
        this.fire(new PlotEvent(PlotEventType.EDIT_PAUSE, null, {}))
    }
    _onEditStop() {
        this.fire(new PlotEvent(PlotEventType.EDIT_STOP, null, {}));
    }
    _onCreateAnchor({
                        position, params = {
            index: 0, isCenter: false, isMid: false
        }
                    }) {
        const {isMid, index, isCenter} = params;
        const color = isMid
            ? this._options.icon_midAnchor_color
            : isCenter
                ? this._options.icon_center_color
                : this._options.icon_anchor_color
        const anchor = new Point(position);
        anchor.setStyle({
            size: 5,
            color: color,
            outlineColor: 'rgba(255,255,255,0.9)',
            outlineWidth: 1,
            image: {
                type: 'circle',
            }
        })
        anchor.attr = {
            isMid: isMid,
            index: index,
            control: true
        }
        this._anchorLayer.addOverlay(anchor)
        this._anchors.push(anchor);
        this.anchorsPositions[index] = position;
        return anchor
    }

    _onClearAnchor(e) {
        console.log('_onCreateAnchor', e)

    }

    _bindEvent() {
        this.pointermoveListener = this._map.on(MouseEventType.POINTER_MOVE, this._onMouseOverOutHandler.bind(this))
        this.clickListener = this._map.on(MouseEventType.CLICK, this._onClick.bind(this));
        this.contextmenuListener = this._map._delegate?.on(MouseEventType.CONTEXTMENU, this._onContextmenu.bind(this));
        // @ts-ignore
        this.on(PlotEventType.CREATE_ANCHOR, this._onCreateAnchor)
        // @ts-ignore
        this.on(PlotEventType.CLEAR_ANCHOR, this._onClearAnchor)
    }

    _unbindEvent() {
        console.log('Edit Tool_unbindEvent~~~~~~~')
        unByKey(this.clickListener);
        unByKey(this.pointermoveListener);
        unByKey(this.contextmenuListener);
        unByKey(this.pointerdownListener);
        unByKey(this.pointerupListener);
        this.clickListener = null
        this.pointermoveListener = null
        this.contextmenuListener = null
        this.pointerdownListener = null
        this.pointerupListener = null
        // @ts-ignore
        this.un(PlotEventType.CREATE_ANCHOR, this._onCreateAnchor)
        // @ts-ignore
        this.un(PlotEventType.CLEAR_ANCHOR, this._onClearAnchor)
    }

    listen(type, callback, context = this) {
        this.on(type, callback)
        return this
    }

    off(type, callback, context) {
        this.un(type, callback)
        return this
    }

    fire(event) {
        this.dispatchEvent(event)
        return this
    }

    activate(options = {}) {
        this._unbindEvent()
        this._bindEvent()
        const interactions = this._map.getInteractions()
        let length = interactions.getLength()
        this._options = {...DEF_OPTS, ...options}
        //双击的
        for (let i = 0; i < length; i++) {
            let item = interactions.item(i)
            if (item instanceof DoubleClickZoom) {
                this.dblClickZoomInteraction = item
                interactions.remove(item)
                break
            }
        }
        //地图拖动的
        for (let i = 0; i < length; i++) {
            let item = interactions.item(i)
            if (item instanceof DragPan) {
                this.dragPanInteraction = item
                interactions.remove(item)
                break
            }
        }
        this.fire(new PlotEvent(PlotEventType.EDIT_START, null, {options: this._options}))
        return this
    }

    deactivate() {
        console.log('！！！！！！！！！deactivate！！！！！！！添加交互')
        this._unbindEvent();
        this._anchorLayer.clear();
        this._anchors = [];
        this.anchorsPositions = [];
        // setTimeout(() => {
        if (this.dblClickZoomInteraction != null) {
            this._map.addInteraction(this.dblClickZoomInteraction);
            this.dblClickZoomInteraction = null;
        }
        if (this.dragPanInteraction != null) {
            this._map.addInteraction(this.dragPanInteraction);
            this.dragPanInteraction = null;
        }
        // }, 200)
    }

    install(map) {
        this._map = map
        this._map.addLayer(this._anchorLayer)
        Object.defineProperty(this._map, 'editTool', {
            value: this,
            writable: false
        })
    }
}

export default EditTool
