/**
 * 要素点、线、面上图的逻辑配置
 *   1、单独图层的
 *   2、视窗聚合的(普通不含统计）
 *   3、视窗聚合的(含个数统计)
 *   4、视窗直接加载的（直接加载所有 原则上和2一样）
 */


import Define from "@/config/Define.ts";
import overlays from "./layer.feature.overlays.ts";
import { buildUUID} from "@dfsj/utils";
import {getGis, GisSymbolKey} from "@/core/GisCache.ts";
import {visualPlayableWeatherApi} from "@/api/layer.ts";
import {defaultHighlight, defaultLoader, defaultStyle} from "@/core/adapter/config/default.ts";
const configs: any = {
    // 天气预报
    [Define.Resource.WEATHER_POINT_PLAY]: {
        type: 'feature',
        format: {
            type: 'list', // 返回的格式
            id: (v) => v.wrcd, // id
            coordinate: (v) => [v.lgtd, v.lttd], // 坐标字段
            graphic: 'billboard', // 类型
            fields: '*', // 字段
            projection: { from: null, to: null }, // 转换投影
        },
        identity: (v) => v.wrcd, // 唯一标识
        overlay: overlays['427'], // 鼠标的移入效果
        animation: () => {},
        loader: (options: any) => {
            console.log('options', options);
            const params = {
                adcd: options?.user?.adcd,
                newBox: options?.extent,
                offest: options?.weather,
                zoom: getGis(GisSymbolKey.default).zoom,
            };
            console.log(
                'getGis(GisSymbolKey.default)',
                getGis(GisSymbolKey.default),
                getGis(GisSymbolKey.default).zoom
            );
            return visualPlayableWeatherApi(params);
        },
        styleRenderer: {
            type: 'unique',
            field: undefined,
            store: false,
            loses: {
                type: 'billboard',
                normal: {
                    image: (v) => `/images/meteorological/weather/${v?.phenomena}/0.png`,
                    label: {
                        font: '14px arial',
                        outlineWidth: 3,
                        outlineColor: 'white',
                        zooms: null,
                        offset: [0, 30],
                        color: '#00abdf',
                        text: (v) => `${v.wrnm}（${v.phenomena}）`,
                    },
                    scale: 0.5,
                },
                highlight: {
                    scale: 0.6,
                    image: (v) => `/images/meteorological/weather/${v?.phenomena}/0.png`,
                    label: {
                        offset: [0, 35],
                        font: '14px arial',
                        outlineWidth: 3,
                        outlineColor: 'white',
                        color: '#ff00ff',
                        text: (v) => `${v.wrnm}（${v.phenomena}）`,
                    },
                },
            },
        },
    },
};
/***
 获取一些必要的配置 */
export default function getLayerConfig({
                                           id =  buildUUID(),
                                           motype = 1,
                                           custom = {},
                                           normal = defaultStyle,
                                           highlight = defaultHighlight,
                                           loader = defaultLoader,
                                       }) {
    const config = configs[motype];
    if (config) {
        // @ts-ignore
        return Object.assign({}, config, { custom });
    }
    return {
        id:id,
        type: 'feature',
        format: {
            type: 'list',
            id: (v) => v.mocd || v.stcd || v.code || v.id,
            coordinate: (v) => [v.lgtd, v.lttd],
            graphic: 'billboard',
            fields: '*',
            projection: { from: null, to: null },
        },
        identity: (v) => v.mocd || v.stcd || v.code || v.id,
        overlay: overlays[motype],
        styleRenderer: {
            type: 'unique',
            // @ts-ignore
            store: false,
            field: (v) => (v.count > 1 ? 'cluster' : undefined),
            loses: { type: 'billboard', normal, highlight },
            items: [
                {
                    type: 'point',
                    value: 'cluster',
                    style: {
                        size: (v) => Math.max(12, Math.log2(v.count) * 2.31),
                        color: (v) => `${Define.RandomColor[v.motype % 16]}BB`,
                        outlineWidth: 1.5,
                        outlineColor: (v) => Define.RandomColor[v.motype % 16],
                        label: [
                            {
                                text: (v) => String(v.count),
                                font: '14px arial bold',
                                color: 'white',
                                offset: [-1, 1],
                            },
                            {
                                // @ts-ignore
                                text: (v) => v.monm || v.stnm || v.label || v.name,
                                font: '14px arial bold',
                                color: 'white',
                                offset: (v) => [
                                    0,
                                    Math.max(12, Math.log2(v.count) * 2.31) + 12,
                                ],
                                outlineWidth: 3,
                                outlineColor: (v) => Define.RandomColor[v.motype % 16],
                            },
                        ],
                    } as any,
                },
            ],
        },
        custom: { motype, ...custom },
        // @ts-ignore
        loader,
    };
}
