import {GisSymbolKey} from "@/core/GisCache.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";

/**
 * 区分gis key和2,3平台
 */
export const platformBasicProps = {
    gisKey: { type: Symbol,  default: () => GisSymbolKey.default },//gis 实例key
    platform: { type: String,  default: () => GisPlatformEnum.OPENLAYERS },//2维还是3维
    options: { type: Object, default: () => ({}) },//初始化的东西，位置和图层
};
