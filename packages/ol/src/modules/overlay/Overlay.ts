import {Observable} from 'ol'
import Util from '../utils/Util'
import {OverlayEventType} from '../event/EventType'
import OverlayType from './OverlayType'
import State from '../state/State'
import merge from 'lodash-es/merge'
import cloneDeep from 'lodash-es/cloneDeep'
import CustomProjection from '../proj/CustomProjection'
import {getCenter} from 'ol/extent'
import Style from '../style/Style'
import {Style as olStyle} from 'ol/style'

export default class Overlay extends Observable {
    public _delegate: any
    public _layer: any
    public _state: any
    public _show: boolean
    public _style: any = {}
    public _attr: {}
    public _allowDrillPicking: boolean
    public _contextMenu: any[]
    public _id: string
    public _bid: string
    public _projection: any
    public _options: any
    public _position: any | []
    //TODO 要素的动画表现 可能每一种类型的要素支持的不一样
    public _animation: any = {}
    //TODO 保存元素的原始样式 用于设置动态样式
    public _dynamic: any = {}

    constructor(options?) {
        super()
        this._id = options?.id || Util.uuid()
        this._bid = Util.uuid() // Business id
        this._delegate = undefined
        this._options = options
        this._layer = undefined
        this._state = undefined
        this._show = true
        this._style = {}
        this._attr = {}
        this._allowDrillPicking = false
        this._contextMenu = []
        this._projection = CustomProjection.projection
        // @ts-ignore
        this.on(OverlayEventType.ADD, this._onAdd, this)
        // @ts-ignore
        this.on(OverlayEventType.REMOVE, this._onRemove, this)
    }

    get position() {
        return this._position
    }

    setCoordinates(coord: any) {
        this._position = coord;
        this._delegate.getGeometry().setCoordinates(coord)
    }

    appendCoordinate(coord: any) {
        this._delegate.getGeometry().appendCoordinate(coord)
        this._position = this._delegate.getGeometry().getCoordinates()
    }

    get dynamic() {
        return this._dynamic
    }

    set dynamic(obj) {
        this._dynamic = obj
    }

    get animation() {
        return this._animation
    }

    set animation(ani) {
        // 这里根据每一种的类型做一下判断
        this._animation = ani
        this._delegate.setProperties({animation: ani})
    }

    get center() {
        const extent = this.delegate.getGeometry().getExtent()
        const center = getCenter(extent)
        return center ?? []
    }

    get options() {
        return this._options
    }

    get projection() {
        return this._projection
    }

    get overlayId() {
        return this._id
    }

    get type() {
        return ''
    }

    get style() {
        return this._style
    }

    set id(id) {
        this._bid = id
        // return this
    }

    get id() {
        return this._bid
    }

    set show(show) {
        this._show = show
        if (show) {
            this.setStyle()
        } else {
            this._delegate.setStyle(new olStyle());
        } // @ts-ignore
        return this
    }

    get show() {
        return this._show
    }

    set attr(attr) {
        this._attr = attr
        // @ts-ignore
        return this
    }

    get attr() {
        return this._attr
    }

    set allowDrillPicking(allowDrillPicking) {
        this._allowDrillPicking = allowDrillPicking
        // @ts-ignore
        return this
    }

    get allowDrillPicking() {
        return this._allowDrillPicking
    }

    // get overlayEvent() {
    //     return this._overlayEvent
    // }

    get delegate() {
        return this._delegate
    }

    get state() {
        return this._state
    }

    set contextMenu(menus) {
        this._contextMenu = menus
        // @ts-ignore
        return this
    }

    get contextMenu() {
        return this._contextMenu
    }

    /**
     * @param options
     */
    setStyle(style = {}, options = {
        standard: false,
        zoom: null
    }): Overlay {
        //判断是否相等  若果相等则不必要更新样式
        let eq = JSON.stringify(this._style) == JSON.stringify(style)
        if (!style || Object.keys(style).length === 0) {
            return this
        }
        if (style instanceof olStyle) {
            this._delegate.setStyle(style)
        } else {
            this._style = merge({}, cloneDeep(this._style), cloneDeep(style))
            // console.log('//////////是否相等////////////',eq)
            style = Style.create(this._style, this.attr)
            // if (eq) return
            this._delegate.setStyle(style)
        }
        return this
    }

    /**
     * Removes from layer
     * @returns {Overlay}
     */
    remove() {
        if (this._layer) {
            this._layer.removeOverlay(this)
        }
        return this
    }

    /**
     * Subscribe event
     * @param type
     * @param callback
     * @param context
     * @returns {Overlay}
     */
    listen(type, callback, context = this) {
        // this._overlayEvent.on(type, callback, context || this)
        // @ts-ignore
        this.on(type, callback)
    }

    /**
     * Unsubscribe event
     * @param type
     * @param callback
     * @param context
     * @returns {Overlay}
     */
    off(type, callback, context) {
        this.un(type, callback)
        return this
    }

    /**
     * Trigger subscription event
     * @param type
     * @param params
     * @returns {Overlay}
     */
    fire(event) {
        // this._overlayEvent.fire(type, params)
        this.dispatchEvent(event)
        return this
    }

    /**
     * The hook for mount layer
     * Subclasses need to be overridden
     * @private
     */
    _mountedHook() {
    }

    /**
     * The hook for added
     * @returns {boolean}
     * @private
     */
    _addedHook() {
        if (!this._delegate) {
            return false
        }
        this._delegate.layerId = this._layer?.layerId
        this._delegate.overlayId = this._id

        if (this._layer.dynamic) return this

        //在这里设置图层的
        function getNestedPropertyValues(obj, property) {
            const values = []

            function traverse(obj) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key === property) {
                            values.push(obj[key])
                        } else if (typeof obj[key] === 'object') {
                            traverse(obj[key])
                        }
                    }
                }
            }

            traverse(obj)
            return values
        }

        const values = getNestedPropertyValues(this.dynamic, 'zooms')
        const dynamic = values.some((element) => element !== null && element?.length == 2)
        this._layer.dynamic = dynamic
        return this
    }

    /**
     * The hook for removed
     * Subclasses need to be overridden
     * @private
     */
    _removedHook() {
    }

    /**
     * Add handler
     * @param layer
     * @private
     */
    _onAdd(event) {
        if (!event?.layer) {
            return
        }
        this._layer = event.layer
        this._mountedHook && this._mountedHook()
        if (this._layer?.delegate && this._layer?.delegate?.getSource() && this._delegate) {
            this._layer?.delegate?.getSource()?.addFeature(this._delegate)
        }
        this._addedHook && this._addedHook()
        this._state = State.ADDED
    }

    /**
     * Remove handler
     * @private
     */
    _onRemove() {
        if (!this._layer || !this._delegate) {
            return
        }
        if (this._layer?.delegate && this._layer.delegate?.getSource() && this._delegate) {
            this._layer.delegate?.getSource().removeFeature(this._delegate)
        }
        this._removedHook && this._removedHook()
        this._state = State.REMOVED
    }

    set(val: string, key: any) {
        this._delegate.set(val, key)
        return this
    }

    /**
     *
     * @param type
     */
    static registerType(type) {
        if (type) {
            OverlayType[type.toLocaleUpperCase()] = type.toLocaleLowerCase()
        }
    }

    /**
     *
     * @param type
     * @returns {*|undefined}
     */
    static getOverlayType(type) {
        return OverlayType[type.toLocaleUpperCase()] || undefined
    }
}
