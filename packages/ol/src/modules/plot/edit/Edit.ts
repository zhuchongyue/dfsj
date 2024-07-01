/**
 * 标绘编辑基类
 */
import Popup from "ol-ext/overlay/Popup";
import {unByKey} from "ol/Observable";
import {PlotEventType} from "../../event";
import {Point} from "ol/geom";
import PlotEvent from "../../event/type/PlotEvent";
import {POINT, SINGLE} from "../Plot";

class Edit {
    public _map: any;
    public _overlay: any;
    protected _layer: any;
    protected _options: any;
    protected _startTip: any;
    protected _onAnchorMovingLister: any;
    protected _onEditStopLister: any; //停止当前图形的编辑  进入下一个图形
    protected _onEditPauseLister: any; //编辑结束<鼠标抬起事件>  可以再继续编辑

    protected _onAnchorDownLister: any;
    protected _onAnchorUpLister: any;


    protected _startPoint: [number, number];

    public _delegate: any;
    public _positions: any[];

    public hasControlPoint: boolean;

    constructor(overlay) {
        this._map = undefined
        this._layer = undefined
        this._overlay = overlay;
        this._overlay.show = false;//可以直接删除
        this._startPoint = [0, 0];
        this.hasControlPoint = false;
    }

    get style() {
        return this._overlay?.style
    }

    get attr() {
        return this._overlay?.attr
    }

    get type() {
        return this._overlay?.attr?.type
    }

    get isPoint() {
        return POINT.includes(this.type)
    }

    get editTool() {
        return this._map.editTool
    }

    generate(newPoints?) {
    }
    getLastControlPoints(){
        return this._delegate.attr?.lastFixPoints ?? []
    }
    //获取控制点信息
    getControlPoints(geometry = this._overlay) {
        let points: Point[] = [];
        const geom = geometry?.delegate.getGeometry();
        if (geom) {
            points = geom.getCoordinates();
            console.log('points', points)
        }
        if (points.length == 1) {
            // @ts-ignore
            points = points[0]
        }
        if (this.isPoint) {
            // @ts-ignore
            points = [points]
        }
        return points;
    }

    _mountedHook() {
    }

    _stoppedHook() {
        console.log('_stoppedHook', this._options, this)
        if (this._positions && this._delegate) {
            this._options.onEditStop &&
            this._options.onEditStop(this._delegate)
            this._delegate = null
            this._positions = []
        }
    }

    _mountAnchor() {
        //生成控制点
        this._positions = this.getControlPoints();
        console.info('生成控制点信息', this._positions);
        this._positions.forEach((item, index) => {
            this.editTool.fire(new PlotEvent(PlotEventType.CREATE_ANCHOR,
                item,
                {index: index},
            ))
        })
    }

    _onEditAnchorStop({position, params}) {
    }

    _onAnchorMoving({position, params}) {
        const single = SINGLE.includes(this._delegate.attr?.type) ?? false;
        if (Reflect.has(params, 'message') && params?.message) {
            if (!this.isPoint) this._startTip.show(position, params?.message)
            return
        }
        if (Reflect.has(params, 'hideTip') && params?.hideTip) this._startTip.hide();
        //判断是控制点还是整体移动;
        if (Reflect.has(params, 'control')) {
            let message = `<span style="color: #bf00ff;font-weight: bolder">控制点:</span>鼠标抬起结束拖动!`;
            if (!this.isPoint) this._startTip.show(position, message)
            const index = params?.index;
            this._positions[index] = position;
            if (this.hasControlPoint) {
                this.generate()
            } else {
                //TODO 设置坐标
                const updateCoord = this.isPoint ? this._positions?.[0] : single ? this._positions : [this._positions];
                this._delegate.setCoordinates(updateCoord)
            }
        }
        if (Reflect.has(params, 'plot')) {
            let message = `<span style="color: red;font-weight: bolder">整体:</span>鼠标抬起结束拖动!`;
            if (!this.isPoint) this._startTip.show(position, message)
            let dx = params?.dx;
            let dy = params?.dy;
            const newPoints = [];
            this._positions.forEach((p) => {
                let coordinate = [p[0] + dx, p[1] + dy];
                newPoints.push(coordinate)
            });
            if (this.hasControlPoint) {
                this.generate(newPoints)
            } else {
                //TODO 设置坐标
                const updateCoord = this.isPoint ? newPoints?.[0] : single ? newPoints : [newPoints];
                this._delegate.setCoordinates(updateCoord)
            }
        }
    }

    //停止
    _onEditStop() {
        this.editTool.deactivate()
        this._delegate && this._layer.removeOverlay(this._delegate)
        this._unbindEvent();
        this._stoppedHook()
    }

    //暂停编辑
    _onEditPause() {
        if (this.hasControlPoint){
            this._positions = this.getLastControlPoints();
            this._delegate.attr.fixPoints = this._positions;
            if (Reflect.has(this._delegate.attr,'lastFixPoints')) delete this._delegate.attr.lastFixPoints
            return;
        }
        this._positions = this.getControlPoints(this._delegate);
    }

    //*******************
    _onAnchorDown({position, params}) {
        this._startPoint = position
    }

    _onAnchorUp() {
        this._startPoint = [0, 0]
    }

    _bindEvent() {
        this._onAnchorDownLister = this.editTool.on(PlotEventType.ANCHOR_DOWN, this._onAnchorDown.bind(this))
        this._onAnchorUpLister = this.editTool.on(PlotEventType.ANCHOR_UP, this._onAnchorUp.bind(this))
        this._onAnchorMovingLister = this.editTool.on(PlotEventType.ANCHOR_MOVING, this._onAnchorMoving.bind(this))
        this._onEditStopLister = this.editTool.on(PlotEventType.EDIT_STOP, this._onEditStop.bind(this))
        this._onEditPauseLister = this.editTool.on(PlotEventType.EDIT_PAUSE, this._onEditPause.bind(this))
    }

    _unbindEvent() {
        unByKey(this._onAnchorDownLister)
        unByKey(this._onAnchorUpLister)
        unByKey(this._onAnchorMovingLister)
        unByKey(this._onEditStopLister)
        unByKey(this._onEditPauseLister)
        this._onAnchorDownLister = null
        this._onAnchorUpLister = null
        this._onAnchorMovingLister = null
        this._onEditStopLister = null
        this._onEditPauseLister = null
    }

    start(plot, options) {
        console.log('开始编辑了...', plot, options)
        this._map = plot.map
        this._layer = plot?.layer
        this._options = options
        this._map.editTool.deactivate()
        this._map.editTool.activate(options)
        this._mountedHook()
        this._mountAnchor()
        this._unbindEvent()
        this._bindEvent()
        this._startTip = new Popup({
            positioning: 'center-right',
            className: "default specs"
        });
        this._map._delegate?.addOverlay(this._startTip);
        this._startTip?.hide()
        // this._startTip.show?.('选中控制点，点击左键开始编辑!');
        return this
    }

    stop() {
        this._startTip?.hide?.()
        this._map._delegate?.removeOverlay(this._startTip);
        this._startTip = null
        this.editTool.fire(new PlotEvent(PlotEventType.EDIT_STOP, null))
        return this
    }
}

export default Edit;