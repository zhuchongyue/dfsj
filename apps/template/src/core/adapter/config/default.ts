// TODO 默认的样式
import Define from "@/config/Define.ts";
import { merge } from 'lodash-es';
import {visualPlayableFeatureApi} from "@/api/layer.ts";
import {ListFormatGraphicConfig, StyleConfig} from "@/core/type";
const ModeMap: any = { daily: 2, interval: 1 };
/**
 * 默认的format
 */
const defaultType = 'feature';
const defaultFormat: ListFormatGraphicConfig = {
    type: 'list',
    id: (v:any) => v.mocd || v.stcd || v.code || v.id,
    coordinate: (v:any) => [v.lgtd, v.lttd],
    graphic:'billboard',
    fields: '*',
    projection: { from: null, to: null },
} as ListFormatGraphicConfig;
const defaultIdentity = (v:any) => v.mocd || v.stcd || v.code || v.id;
//TODO 空间数据类型  使用deepMerge 合并相同的配置
export enum collectSpatialDateEnum {
    HABITATION_POLYGON = 'ENTERPRISES_BILLBOARD',//居民驻地
    ENTERPRISES_BILLBOARD = 'ENTERPRISES_BILLBOARD',//企业
    DANGER_AREA_POLYGON = 'DANGER_AREA_POLYGON',//危险区域
    PLACEMENT_BILLBOARD = 'PLACEMENT_BILLBOARD', //安置点
    TRANSFER_POLYLINE = 'TRANSFER_POLYLINE',//转移路线图层
    DAM_BILLBOARD = 'DAM_BILLBOARD',//塘（堰）坝工程图层
    ROAD_BILLBOARD = 'ROAD_BILLBOARD',//路涵工程图层
    BRIDGE_BILLBOARD = 'BRIDGE_BILLBOARD',//桥梁工程图层
    RESIDENTIAL_BILLBOARD = 'RESIDENTIAL_BILLBOARD',//重要城（集）镇居民图层
    RIVER_VERTICAL_BILLBOARD = 'RIVER_VERTICAL_BILLBOARD',//沟道纵断面图层
    RIVER_CROSS_BILLBOARD = 'RIVER_CROSS_BILLBOARD',//沟道横断面图层
    HIS_DISASTER_BILLBOARD = 'HIS_DISASTER_BILLBOARD',//历史山洪灾害图层
}
const defaultStyle = {
    rotation: (v:any) => v.rotate,
    image: (v:any) => {
        let image = `/images/layer/${v.motype}/${v.wlevel || 0}.png`;
        if (v.motype === Define.Resource.HYDROLOGY_STATION) {
            // 河道水文站 sttp -- ZQ 水文站 ZZ 水位站
            image = `/images/layer/15/${v.wlevel || v.sttp}.png`;
        }
        return image;
    },
    scale: 0.5,
    label: {
        font: '14px arial',
        offset: [0, 25],
        outlineWidth: 3,
        outlineColor: 'white',
        color: '#00abdf',
        text: (v:any) => {
            // return 'test-text';
            // if (v.motype == 4) {
            //     return v.monm || v.stnm || v.label || v.name;
            // } else {
            //     // return v.monm;
            //     return '';
            // }
            return v.monm || v.stnm || v.label || v.name;
        },
        zooms: [0, 100],
    },
};
// TODO 默认的高亮颜色
const defaultHighlight = merge({}, defaultStyle, {
    scale: 0.9,
    label: {
        offset: [0, 30],
        color: '#ff00ff',
        text: (v:any) => {
            return v.monm || v.stnm || v.label || v.name;
        },
    },
});
const defaultLoader =(options: any = {}, cancelKey = '')=> {
    const params = {
        motype: options.motype,
        type: { motype: options.motype, sttypes: options.filter?.sttypes },
        area: options?.user?.adcd,
        box: options.extent,
        scale: -1,
        wlevel: options.filter.legend ?? -1,
        start: options.start,
        sumtype: ModeMap[options.mode],
        end: options.end,
    };
    return visualPlayableFeatureApi(params, cancelKey);
}
export {
    defaultHighlight,
    defaultStyle,
    defaultLoader,
    defaultType,
    defaultFormat,
    defaultIdentity,
    ModeMap
}