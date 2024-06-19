import {unifyPostHttp} from '/@/utils/http/axios';

enum Api {
    visualPlayableLoad = "/station-service/module/getLayerProvide",
    visualPlayableStatistic = "/station-service/module/getLayerByTime",
    visualPlayableWeather = "/station-service/weather/getForeWeatherByAdcdV1", //天气预报

    visualPlayableFeature = "/station-service/monitorObject/findObjectBySttype", //上图聚合（返回视窗可是数据）
    visualPlayableFindClusterObjects = "/station-service/monitorObject/findClusterObjects", //上图聚合（返回视窗范围聚合数量和单个点位   专题部分）

    gisResourcesStaticLayer = '/station-service/module/getLayerBaseInfo',//基础图层
    findObjectBySttypeSy = "/station-service/remoteAlarm/findObjectBySttype",
}

/**
 * @description: 获取普通的基础图层
 */
export function getGisResourcesStaticLayer(params: any,) {
    return unifyPostHttp(Api.gisResourcesStaticLayer, params);
}

/**
 * @description: 图层分析-获取时间轴信息
 */
export const visualPlayableStatistic = (params: any,) => unifyPostHttp(Api.visualPlayableStatistic, params);

/**
 * @description: 图层事件轴配置信息
 */
export const visualPlayableLoadApi = (params: any,) => unifyPostHttp(Api.visualPlayableLoad, params);

/**
 * @description: 天气上图加载
 */
export const visualPlayableWeatherApi = (params: any,) => unifyPostHttp(Api.visualPlayableWeather, params);

/**
 * @description: 普通上图（后台聚合1）
 */
export function visualPlayableFeatureApi(params: any,
                                         cancelKey: string = '',) {
    return unifyPostHttp(Api.visualPlayableFeature, params, {
        ignoreCancelToken: false,
        ignoreCancelKey: cancelKey
    });
}

/**四预暴雨上图
 */
export function rainvisualPlayableFeatureApi(params: any,
                                             cancelKey: string = '',) {
    return unifyPostHttp(Api.findObjectBySttypeSy, params, {
        ignoreCancelToken: false,
        ignoreCancelKey: cancelKey
    });
}

/**
 * @description: 普通上图（后台聚合2）
 */
export function visualPlayableFindClusterObjectsApi(params: any,
                                                    cancelKey: string = '',) {
    return unifyPostHttp(Api.visualPlayableFindClusterObjects, params, {
        ignoreCancelToken: false,
        ignoreCancelKey: cancelKey
    });
}
