import {GisPlatformEnum} from "@/enums/appEnum.ts";
import {Map} from "@dfsj/ol";
import {Viewer} from "@dfsj/cesium";
import * as ECCesium from '@dfsj/cesium';

ECCesium.setResourcesUrl('/cesium/');

interface View {
    extent: Function | Array<number>,
    projection: any,
    zoom: any,
    minZoom: any,
    maxZoom: any,
    constrainResolution: boolean,
    smoothResolutionConstraint: boolean,
}

interface IOpenlayersConfig {
    view: View,
}

interface ICesiumConfig {
}


export default class GisPlatformAdapter {
    protected _instance: any;

    get instance() {
        return this._instance;
    }

    constructor(platform: GisPlatformEnum, config: any) {
        if (platform == GisPlatformEnum.CESIUM) {
            const {target, options, defaultView, baseLayers, terrain} = config;
            const viewer = new Viewer(target).setOptions(options);
            if (defaultView) viewer.flyToPosition(defaultView, () => {
            }, 0);
            if (baseLayers?.length){
                baseLayers.forEach((item:any) => {
                    let layer = ECCesium.ImageryLayerFactory[item.methods](item.options)
                    layer.name = item.name
                    viewer.addBaseLayer(layer, {name: item.name, iconUrl: item.icon})
                })
            }
            this._instance = viewer

        } else if (platform == GisPlatformEnum.OPENLAYERS) {
            this._instance = new Map(config.target, config);
        }
    }
}