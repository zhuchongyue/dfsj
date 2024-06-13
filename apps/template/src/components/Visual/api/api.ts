import {defHttp} from '/@/utils/http/axios';

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
 * @description: 图层事件轴配置信息
 */
export function visualPlayableLoadApi(params: any,) {
    return defHttp.post<any>(
        {
            url: Api.visualPlayableLoad,
            params,
        },
        {
            // errorMessageMode: mode,
            // joinParamsToUrl: true
        }
    );
}