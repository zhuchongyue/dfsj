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
import {GraphicFactory} from "@/core/adapter/graphic/GraphicFactory.ts";
import {EMapLink} from "@/enums/mittTypeEnum.ts";

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
        config = Array.isArray(config) ? config : config ? [config] : []
        if (config && Array.isArray(config) && config.length > 0) {
            console.log('config', config)
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
                    }
                    ;
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


    async handleMoveend(ev) {
        await this.debounceLoaderFn();
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
            this.debounceLoaderFn();
        } else {
            if (this.imagery.size > 0) {
                this.imagery.forEach((value, key, map) => {
                    console.log({value});
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

    public setProperty(layerCfg: object, property: string, value: any) {
        const key = generateUniqueId(layerCfg);
        const imagery = this.imagery.get(key);
        if (imagery) {
            imagery[property] = value;
            if (property == 'opacity') {
                imagery?.setOpacity(+value)
            }
            return
        }
        if (this.vectorLayerGroup) {
            if (property == 'opacity') this.vectorLayerGroup.show = !!property;
        }
    }

    public getProperty(layerCfg: object, property: string) {
        const key = generateUniqueId(layerCfg);
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
            animation = () => {
            },
        } = config;
        /** 普通样式 */
        const style = styleRenderer?.loses?.normal || billboard || {};
        /** 高亮样式 */
        const highlight = styleRenderer?.loses?.highlight ?? billboard?.highlight ?? {};
        const labelIsShow = style?.label?.isShow ?? false;
        const overlays = this.vectorLayer?.getOverlays?.()?.map((e) => ({...e?.attr}));
        const comparator = (older: any, newer: any) => {
            let t = identity(older) == identity(newer); //|| (older?.code == newer?.code)
            return t;
        };
        const {absent, additional, identical} = diff(overlays, data, comparator);



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
            /**
             * 需要判断是什么图形
             * 1、格式解析器
             * 2、图形
             * 3、直接加载  聚合加载
             */
            let formatType =
                typeof format?.type == 'function' ? format?.type(item) : format?.type;
            let reader: any = null; //1、查看是否存在聚合的count字段
            let renderType: any = null;
            let graphicType: any = null;
            let graphic: any = null;
            //1、查看是否存在聚合的count字段
            renderType = styleRenderer?.field?.(item);
            const {
                normal = {},
                highlight = {},
                type,
            } = styleRenderer?.items?.find((e) => e.value === renderType) ??
            styleRenderer.loses ?? {};
            //需要解析数据
            if (formatType == 'wkt') reader = WktLayer;
            if (formatType == 'wkb') reader = WkbLayer;
            graphic = GraphicFactory.create(type);
            //TODO 带数字的聚合点
            if (renderType == 'cluster') {
                console.log('聚合的样式', normal)
                const point = new Point([item?.lgtd, item?.lttd], {
                    id: identity(item),
                });
                point.attr = {...item};
                point.setStyle(
                    typeof normal == 'function' ? normal(point.attr) : normal
                );
                point.listen(OverlayEventType.MOUSEOVER, async (e) => {
                    map.popup.hide();
                });
                point.listen(OverlayEventType.MOUSEOUT, (e) => {
                    map.popup.hide();
                });
                point.listen(OverlayEventType.CLICK, (e) => {
                    const zoomed = map?.zoom + 2;
                    map.flyToPosition?.([item?.lgtd, item?.lttd], {
                        zoom: zoomed,
                    });
                    emitter.emit(EMapLink.OVERLAY_CLICK, e);
                });
                this.vectorLayerCluster.addOverlay(point);
            } else {
                //TODO 矢量图层解析
                if (reader && reader?.constructor) {
                    new reader(
                        identity(item),
                        item?.geom ?? format?.coordinate?.(item)
                    ).eachOverlay((ovs: any) => {
                        const rgh = graphic.fromEntity(ovs);
                        const {geom, ...others} = item;
                        rgh.attr = others;
                        //todo 动画
                        if (animation) rgh.animation = animation(item);
                        rgh.setStyle(
                            typeof normal == 'function' ? normal(rgh.attr) : normal
                        );
                        console.log({normal,rgh})
                        rgh.listen(OverlayEventType.MOUSEOVER, async (e) => {
                            //在feature上跟随移动
                            const fixed = e?.argument?.fixed;
                            // map.popup.hide();
                            if (!overlay?.content && !overlay?.title) return;
                            let Transform = map.transform;
                            const coordinate = Transform.transformToLonLat(
                                e?.argument?.coordinate ?? rgh.center
                            );
                            console.log({highlight})
                            rgh.setStyle(
                                typeof highlight == 'function' ? highlight(rgh.attr) : highlight
                            );
                            if (fixed) {
                                map.popup.setPosition(coordinate);
                            } else {
                                map.popup.show(coordinate, '加载中...');
                                const strHtml = `
                                <article>${overlay?.title?.(item) ?? ''}
                                ${overlay?.content?.(item) ?? ''}
                                </article>
                                `;
                                map.popup.show(coordinate, strHtml);
                            }
                        });
                        rgh.listen(OverlayEventType.MOUSEOUT, (e) => {
                            map.popup.hide();
                        });
                        rgh.listen(OverlayEventType.CLICK, (e) => {
                            emitter.emit(EMapLink.OVERLAY_CLICK, e);
                        });
                        this.vectorLayer.addOverlay(rgh);
                    });
                } else {
                    if (!graphic || !graphic?.constructor) throw Error('图形构造器错误！');
                    const gh = new graphic([item?.lgtd, item?.lttd], {
                        id: identity(item),
                    });
                    gh.attr = {...item};
                    gh.setStyle(
                        typeof normal == 'function' ? normal(gh.attr) : normal
                    );

                    //fixme 鼠标移入相关的展示视图动作
                    gh.listen(OverlayEventType.MOUSEOVER, async (e) => {

                        // console.log('MOUSEOVER',e.target?.attr?.monm)
                        gh.setStyle(
                            typeof highlight == 'function' ? highlight(gh.attr) : highlight,
                            {highlight:true}
                        );
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
                            const result = {...item, ...loadResult};
                            const strHtml = `<article>${overlay?.title?.(result) ?? ''}
                                ${overlay?.content?.(result) ?? ''}
                                </article>`;
                            map.popup.show(coordinate, strHtml);
                        }
                    });
                    gh.listen(OverlayEventType.MOUSEOUT, (e) => {
                        // console.log('MOUSEOUT',e.target?.attr?.monm)
                        map.popup.hide();
                        gh.setStyle(
                            typeof normal == 'function' ? normal(gh.attr) : normal
                        );
                    });
                    gh.listen(OverlayEventType.CLICK, (e) => {
                        emitter.emit(EMapLink.OVERLAY_CLICK, e);
                    });

                    //todo 动画
                    if (animation) gh.animation = animation(item);
                    this.vectorLayer.addOverlay(gh);


                }

            }
        });
    }
}