/**
 * 返回最终的底图配置
 * 1、根据环境返回
 * 2、根据渲染平台返回
 */
import globalPlatformBaseMap from "@/layouts/map/config/global/global.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
const platform = GisPlatformEnum.CESIUM;
const basemap = globalPlatformBaseMap[platform];
export default basemap;




