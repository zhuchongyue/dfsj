import {GisPlatformEnum} from "@/enums/appEnum.ts";
import {useUserStoreWithOut} from "@/store/modules/user.ts";
import Website from "@/config/Website.ts";
import {GisSymbolKey} from "@/core/GisCache.ts";
import globalPlatformBaseMap from "@/layouts/map/config/global/global.ts";
const platformViewConfig = {
    [GisPlatformEnum.CESIUM]: {
        target: GisSymbolKey.deriveDemo.toString(),
        options: {
            timeline: false, // 显示时间轴刻度
            animation: false, // 显示时间轴动画按钮
            shouldAnimate: false, // 开启或关闭时间轴
            contextOptions: {
                webgl: {
                    alpha: false, // 背景
                },
            },
            shadows: true, // 是否开启阴影
            showAtmosphere: true, // 大气设置
            showMoon: true, // 是否显示月亮
            showSun: true, // 是否显示太阳
            skyBox: { // 天空盒子
                show: true,
            },
            globe: {
                // baseColor: Cesium.Color.fromCssColorString('#2c5e7f'), // 地球默认底色
                enableLighting: true, // 是否开启灯光，开启后地球会根据当前时间启用灯光
            },
        },
        widget:{

        },
        //初始的定位信息
        defaultView: {
            alt: 704208.9648567601,
            heading: 351.1051896382928,
            lat: 21.1951713435045,
            lng: 107.84051080848603,
            pitch: -50.98279899695291,
            roll: 0.0030214874823045203,
        },
        //初始的图层信息
        baseLayers: globalPlatformBaseMap[GisPlatformEnum.CESIUM],
        //初始的地形信息
        terrain: {
            type: 'terrain',
            methods: 'createUrlTerrain',
            options: {
                requestVertexNormals: true,
                url: `http://dxdm.dfsjcloud.com/sw/guizhou_Natural/gz_dem_Tile_new`
            }
        }
    },
    [GisPlatformEnum.OPENLAYERS]: {
        target: GisSymbolKey.default.toString(),
        labelAliasKey: 'alias',
        isDefaultKey: 'isDefault',
        controls: {
            zoom: false,
            scaleLine: false,
            rotate: false,
        },
        interactions: {
            shiftDragZoom: false,
        },
        view: {
            // center: [106.712251,26.040609],
            extent: (function () {
                return (
                    //@ts-ignore
                    useUserStoreWithOut().getUserInfo.bbox ?? [
                        103.59942612, 23.3343, 109.59386004, 29.2243792,
                    ]
                );
            })(),
            projection: Website.DEFAULT_PROJECTION,
            zoom: 8,
            minZoom: 7,
            maxZoom: 20,
            constrainResolution: false,
            smoothResolutionConstraint: true,
        },
        baseLayers: globalPlatformBaseMap[GisPlatformEnum.OPENLAYERS],
    }
}

export {
    platformViewConfig
}