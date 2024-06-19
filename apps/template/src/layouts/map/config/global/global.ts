/**
 * 全局的配置
 * 还有其它的配置：比如弹窗里面的地图，对比的地图
 */

import {NetEnum} from '/@/enums/netEnum';
import {GisPlatformEnum} from "@/enums/appEnum.ts";
//@ts-ignore
import Website from "@/config/Website.ts";
import * as ECCesium from '@dfsj/cesium'; 
const Cesium = ECCesium.getLib('Cesium');
const NetUrls = {
    [NetEnum.INTERNET]: `https://58.42.237.172:8188`,
    [NetEnum.PRIVATE]: `http://10.52.3.206:8188`,
};
export const getNetUrl = () => {
    let net: 0 | 1 = Website.NET;
    return NetUrls?.[net] ?? null;
};
export const Urls = {
    vec: `${getNetUrl()}/terrain3/egis/vec/wmts`, //2、天地图矢量
    cva: `${getNetUrl()}/terrain3/egis/cva/wmts`, //2、天地图矢量【标注】
    img: `${getNetUrl()}/terrain4/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=5fe3eb4fdcabe2837a926e9ffeb8df75`, //3、天地图影像
    cia: `${getNetUrl()}/terrain3/egis/cia/wmts`, //3、天地图影像【标注】
    ter: `${getNetUrl()}/terrain3/egis/ter/wmts`, //4、天地图地形
    cta: `${getNetUrl()}/terrain3/egis/cta/wmts`, //4、天地图地形【标注】
    custom_wmts_url: `${getNetUrl()}/geoserver/gwc/service/wmts`,
    new_img: `${getNetUrl()}/imgService/rest/services/GZS2022DOM3/MapServer/WMTS?&key=636a4efd37d24a0cad0beb93a3afd3ab`,
};
const globalPlatformBaseMap = {
    [GisPlatformEnum.OPENLAYERS]: [
        {
            name: '水系图',
            zIndex: 10,
            opacity: 100,
            isBase: true,
            crossOrigin: 'anonymous',
            thumbnail: '/images/map/thumb.vector.png',
            layerName: 'china_jctc_gz_shzhsx',
            isDefault: false,
            layerType: 'TileWMTS',
            projection: 'EPSG:3857',
            levels: 22,
            layer: 'china_jctc_gz_shzhsx',
            format: 'image/png',
            style: '',
            matrixIds: 'EPSG:3857:{z}',
            layerUrl: Urls.custom_wmts_url,
            label: {},
        },
        //矢量
        {
            name: '矢量',
            zIndex: 0,
            opacity: 1,
            isBase: true,
            thumbnail: '/images/map/thumb.vector.w.png',
            layerName: 'vec',
            isDefault: false,
            crossOrigin: 'anonymous', // 跨域增加这个选项即可
            layerType: 'TileWMTS',
            projection: 'EPSG:4326',
            levels: 22,
            layer: 'vec',
            format: 'tiles',
            style: 'default',
            matrixSet: 'c',
            layerUrl: Urls.vec,
            label: [
                {
                    alias: 'vec',
                    opacity: 1,
                    isBaseLabel: true,
                    layerName: 'cva',
                    isDefault: false,
                    layerType: 'TileWMTS',
                    projection: 'EPSG:4326',
                    levels: 22,
                    layer: 'cva',
                    format: 'tiles',
                    style: 'default',
                    matrixSet: 'c',
                    layerUrl: Urls.cva,
                },
            ],
        },
        {
            name: '影像',
            isBase: true,
            opacity: 1,
            thumbnail: '/images/map/thumb.image.png',
            layerName: 'img',
            isDefault: true,
            crossOrigin: 'anonymous', // 跨域增加这个选项即可
            layerType: 'TileXYZ',
            projection: 'EPSG:3857',
            levels: 22,
            layer: 'img',
            format: 'tiles',
            style: 'default',
            matrixSet: 'c',
            layerUrl: Urls.img,
            label: [
                {
                    alias: 'img',
                    opacity: 1,
                    isBaseLabel: true,
                    layerName: 'cia',
                    isDefault: true,
                    layerType: 'TileWMTS',
                    projection: 'EPSG:4326',
                    levels: 22,
                    layer: 'cva',
                    format: 'tiles',
                    style: 'default',
                    matrixSet: 'c',
                    layerUrl: Urls.cia,
                },
            ],
        },
        {
            name: '影像（2023）',
            isBase: true,
            opacity: 1,
            thumbnail: '/images/map/thumb.image.png',
            layerName: 'new.img',
            isDefault: false,
            crossOrigin: 'anonymous', // 跨域增加这个选项即可
            layerType: 'TileWMTS',
            projection: 'EPSG:4326',
            levels: 22,
            layer: '2023年亚米级影像',
            format: 'image/png',
            style: 'default',
            matrixSet: 'default',
            layerUrl: Urls.new_img,
            label: [
                {
                    alias: 'new.img',
                    opacity: 1,
                    isBaseLabel: true,
                    layerName: 'new.img.cia',
                    isDefault: false,
                    layerType: 'TileWMTS',
                    projection: 'EPSG:4326',
                    levels: 22,
                    layer: 'cva',
                    format: 'tiles',
                    style: 'default',
                    matrixSet: 'c',
                    layerUrl: Urls.cia,
                },
            ],
        },
        //地形
        {
            name: '地形',
            opacity: 1,
            isBase: true,
            thumbnail: '/images/map/thumb.terrain.png',
            layerName: 'ter',
            isDefault: false,
            crossOrigin: 'anonymous', // 跨域增加这个选项即可
            layerType: 'TileWMTS',
            projection: 'EPSG:4326',
            levels: 22,
            layer: 'ter',
            format: 'tiles',
            style: 'default',
            matrixSet: 'c',
            layerUrl: Urls.ter,
            label: [
                {
                    alias: 'ter',
                    opacity: 1,
                    isBaseLabel: true,
                    layerName: 'cta',
                    isDefault: false,
                    layerType: 'TileWMTS',
                    projection: 'EPSG:4326',
                    levels: 22,
                    layer: 'cta',
                    format: 'tiles',
                    style: 'default',
                    matrixSet: 'c',
                    layerUrl: Urls.cta,
                },
            ],
        },
    ],
    [GisPlatformEnum.CESIUM]: [
        {
            methods: 'createXYZImageryLayer',
            thumbnail: '/images/map/thumb.c.img.png',
            name: '影像',
            isDefault: true,
            options: {
                url: `http://dxdm.dfsjcloud.com/terrain1/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=5fe3eb4fdcabe2837a926e9ffeb8df75`,
                layer: 'img',
                format: 'tiles',
                srs: "EPSG:3857",
                maximumLevel: 22,
                style: 'default',
                tileMatrixSetID: 'c',
            },
            label: [
                {
                    methods: 'createWMTSImageryLayer',
                    name: '影像标注',
                    options: {
                        alpha: 1,
                        url: `http://dxdm.dfsjcloud.com/terrain3/egis/cia/wmts?tk=5fe3eb4fdcabe2837a926e9ffeb8df75`,
                        layer: 'cia',
                        format: 'tiles',
                        srs: "EPSG:4326",
                        maximumLevel: 22,
                        style: 'default',
                        tileMatrixSetID: 'c',
                    }
                }
            ]
        },
        {

            name: '高清影像',
            methods: 'createWMTSImageryLayer',
            thumbnail: '/images/map/thumb.c.img.png',
            options: {
                url: `https://58.42.237.172:8188/terrain3/egis/mask/wmts?range=egis_gz`,
                subdomains: [0, 1, 2, 3, 4, 5],
                tilingScheme: new Cesium.GeographicTilingScheme(),
                layer: 'img',
                format: 'tiles',
                srs: 'EPSG:4490',
                maximumLevel: 18,
                style: 'default',
                tileMatrixSetID: 'c',
                tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
            }
        },
        {
            name: '最新影像2023',
            methods: 'createWMTSImageryLayer',
            thumbnail: '/images/map/thumb.c.img.png',
            options: {
                url: `https://guizhou.tianditu.gov.cn/imgService/rest/services/GZS2023YMJDOM1/MapServer/WMTS?key=c42891d226b64298ab1b539d4ae3deed`,
                // 天地图切片方案
                subdomains: [0, 1, 2, 3, 4, 5],
                tilingScheme: new Cesium.GeographicTilingScheme(),
                layer: 'GZS2022DOM1',
                format: 'image/png',
                srs: 'EPSG:4326',
                maximumLevel: 18,
                style: 'default',
                tileMatrixSetID: 'default',
                tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
            }
        },
        {
            name: '矢量图',
            thumbnail: '/images/map/thumb.c.vector.png',
            methods: 'createSingleTileImageryLayer',
            options: {
                url: '/images/map/single.gz.png',
                rectangle: Cesium.Rectangle.fromDegrees(
                    103.598018,
                    24.61145,
                    109.58872,
                    29.23133,
                ),
            }

        }
    ]
}
export default globalPlatformBaseMap;
