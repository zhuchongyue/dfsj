import {AbstractResource} from "@/core/adapter/impl/AbstractResource.ts";
import {
    Billboard,
    GeoJsonLayer,
    ImageryLayerFactory,
    LayerGroup,
    MapEventType,
    MouseEventType,
    OverlayEventType,
    Point,
    Polygon,
    VectorLayer,
    WkbLayer,
    WktLayer,
} from '@dfsj/ol';
import {diff, emitter} from '@dfsj/utils';
import {generateUniqueId} from "@/core/adapter/class";
export class OlResourceImpl extends AbstractResource {
    constructor(id: any, config: any, dataSource?: []) {
        super(id, config, dataSource);
        if (config?.type == 'feature') {
            this.vectorLayerGroup = new LayerGroup(id + '-group');
            this.vectorLayer = new VectorLayer(id, config);
            this.vectorLayerCluster = new VectorLayer(id + '-cluster', config); //聚合图层
            this.vectorLayerAdditional = new VectorLayer(id + '-additional', config); //附加图层
            this.vectorLayerGroup.addLayer(this.vectorLayer);
            this.vectorLayerGroup.addLayer(this.vectorLayerCluster);
            this.vectorLayerGroup.addLayer(this.vectorLayerAdditional);
        }
        //数组的情况
        config =  Array.isArray(config) ? config : config ? [config] : []
        if (config && Array.isArray(config) && config.length > 0) {
            console.log('config',config)
            config.forEach((cf: any) => {
                if (cf.type == 'wms') {
                    const cfg = {
                        ...cf,
                        layers: cf?.layer,
                        version: '1.0.0',
                        layerUrl: cf?.url,
                        srs: cf?.projection,
                        zIndex: 1,
                        ...cf?.custom
                    };
                    let layer = ImageryLayerFactory.createImageWMSLayer(generateUniqueId(cf), cfg);
                    if (Reflect.has(cf, '$opacity')) layer.$opacity = cf.$opacity;
                    if (Reflect.has(cf, 'opacity')) {
                        layer.opacity = cf.opacity;
                        layer.setOpacity(+cf.opacity);
                    };
                    this.imagery.set(generateUniqueId(cf), layer);
                } else if (cf.type == 'wmts') {
                    const cfg = {
                        ...cf,
                        layers: cf?.layer,
                        version: '1.0.0',
                        layerUrl: cf?.url,
                        projection: cf?.projection,
                        levels: 19,
                        zIndex: 1,
                        ...cf?.custom
                        // matrixIds: 'EPSG:3857:{z}',
                    };
                    let layer = ImageryLayerFactory.createWMTSLayer(generateUniqueId(cf), cfg);
                    if (Reflect.has(cf, '$opacity')) layer.$opacity = cf.$opacity;
                    if (Reflect.has(cf, 'opacity')) {
                        layer.opacity = cf.opacity;
                        layer.setOpacity(+cf.opacity);
                    }
                    this.imagery.set(generateUniqueId(cf), layer);
                }
            });
        }
        this.handleMoveend = this.handleMoveend.bind(this)
        this.clear();
    }
    public setMap(map) {
        if (!map) return;
        this.map = map;
        if (this.config.type == 'feature') {
            this.map?.addLayerGroup?.(this.vectorLayerGroup);
            console.log(this.config);
            if (this.config?.listener) {
                this.bindEvent();
            }
            this.load();
        } else {
            if (this.imagery.size > 0) {
                this.imagery.forEach((value, key, map) => {
                    console.log({ value });
                    this.map?.addImagery?.(value);
                });
            }
        }
    }
    public bindEvent() {
        if (!this.listener) {
            this.listener = this.map?.on?.(
                MouseEventType.WHEEL,
                this.handleMoveend
            );
        }
    }
    public setProperty(layerCfg:object , property: string, value: any) {
        const key  = generateUniqueId(layerCfg);
        const imagery = this.imagery.get(key);
        console.log('setProperty imagery',imagery)
        if (imagery) {
            imagery[property] = value;
            if (property == 'opacity'){
                imagery?.setOpacity(+value)
            }
            return
        }
        if (this.vectorLayerGroup) {
            if (property == 'opacity') this.vectorLayerGroup.show = !!property;
        }
    }
    public getProperty(layerCfg:object ,property: string) {
        const key  = generateUniqueId(layerCfg);
        const imagery = this.imagery.get(key);
        if (imagery) {
            return imagery?.[property];
        }
        if (Reflect.has(this.vectorLayerGroup?.attr ?? {}, property)) {
            return this.vectorLayerGroup.attr?.[property];
        }
    }
    public unBindEvent() {
        this.map?.un?.(MouseEventType.WHEEL, this.handleMoveend);
        this.listener = null;
    }
    //TODO 渲染

    public render(data: any = []) {
        super.render(data);
        console.log('开始渲染',data)
        if (!this.map) return;
        let map = this.map;
        let config = this.config;
        const {
            styleRenderer,
            loader,
            overlay,
            identity,
            billboard,
            format = {},
            animation = () => {},
        } = config;
        /** 普通样式 */
        const style = styleRenderer?.loses?.normal || billboard || {};
        /** 高亮样式 */
        const highlight = styleRenderer?.loses?.highlight ?? billboard?.highlight ?? {};
        const labelIsShow = style?.label?.isShow ?? false;
        const overlays = this.vectorLayer?.getOverlays?.()?.map((e) => ({ ...e?.attr }));
        console.log('已经有的覆盖物', overlays);
        const comparator = (older: any, newer: any) => {
            let t = identity(older) == identity(newer); //|| (older?.code == newer?.code)
            return t;
        };
        const { absent, additional, identical } = diff(overlays, data, comparator);
        console.log({ absent, additional, identical });
        //删除
        absent.length &&
        absent.forEach((ab) => {
            const ovId = identity(ab);
            const ov = this.vectorLayer.getOverlay?.(ovId);
            if (ov) {
                this.vectorLayer.removeOverlay?.(ov);
            }
        });
        //新增
        additional.length &&
        additional?.forEach((item: any) => {
            const billboard = new Billboard([item?.lgtd, item?.lttd], {
                id: identity(item),
            });
            //fixme 鼠标移入相关的展示视图动作
            billboard.listen(OverlayEventType.MOUSEOVER, async (e) => {
                const fixed = e?.argument?.fixed;
                if (!overlay?.content && !overlay?.title) return;
                let Transform = map.transform;
                const coordinate = Transform.transformToLonLat(
                    e?.argument?.coordinate ?? billboard.center
                );
                if (fixed) {
                    map.popup.setPosition(coordinate);
                } else {
                    map.popup.show(coordinate, '加载中...');
                    const loadResult = overlay.loader
                        ? await overlay.loader(item)
                        : {};
                    const result = { ...item, ...loadResult };
                    const strHtml = `<article>${overlay?.title?.(result) ?? ''}
                                ${overlay?.content?.(result) ?? ''}
                                </article>`;
                    map.popup.show(coordinate, strHtml);
                }
            });
            billboard.listen(OverlayEventType.MOUSEOUT, (e) => {
                map.popup.hide();
            });
            billboard.listen(OverlayEventType.CLICK, (e) => {
                // emitter.emit(EMapLink.OVERLAY_CLICK, e);
            });

            //todo 动画
            if (animation) billboard.animation = animation(item);
            billboard.attr = { ...item };
            billboard.setStyle(
                typeof style == 'function' ? style(billboard.attr) : style
            );
            this.vectorLayer.addOverlay(billboard);
        });
    }
}