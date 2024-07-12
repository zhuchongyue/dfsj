/**
 * 要素点、线、面上图的逻辑配置
 *   1、单独图层的
 *   2、视窗聚合的(普通不含统计）
 *   3、视窗聚合的(含个数统计)
 *   4、视窗直接加载的（直接加载所有 原则上和2一样）
 */
import Define from "@/config/Define.ts";
import overlays from "./layer.feature.overlays.ts";
import configs from "./config";
import {defaultHighlight, defaultLoader, defaultStyle} from "@/core/adapter/config/default.ts";
import {buildUUID} from "@dfsj/utils";
/***
 获取一些必要的配置 */
export default function getLayerConfig({
                                           id =  buildUUID(),
                                           motype = 1,
                                           custom = {},
                                           normal = defaultStyle,
                                           highlight = defaultHighlight,
                                           loader = defaultLoader,
                                           listener = false
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
            id: (v:any) => v.mocd || v.stcd || v.code || v.id,
            coordinate: (v:any) => [v.lgtd, v.lttd],
            graphic: 'billboard',
            fields: '*',
            projection: { from: null, to: null },
        },
        identity: (v:any) => v.mocd || v.stcd || v.code || v.id,
        //@ts-ignore
        overlay: overlays?.[motype],
        styleRenderer: {
            type: 'unique',
            // @ts-ignore
            store: false,
            field: (v:any) => (v.count > 1 ? 'cluster' : undefined),
            loses: { type: 'billboard', normal, highlight },
            items: [
                {
                    type: 'point',
                    value: 'cluster',
                    normal: {
                        size: (v:any) => Math.max(12, Math.log2(v.count) * 2.31),
                        color: (v:any) => `${Define.RandomColor[v.motype % 16]}BB`,
                        outlineWidth: 1.5,
                        outlineColor: (v:any) => Define.RandomColor[v.motype % 16],
                        label: [
                            {
                                text: (v:any) => String(v.count),
                                font: '14px arial bold',
                                color: 'white',
                                // offset: [-1, 1],
                                offset: (v:any) => [
                                    0,
                                    Math.max(12, Math.log2(v.count) * 2.31) / 2,
                                ],
                            },
                            {
                                // @ts-ignore
                                text: (v:any) => v.monm || v.stnm || v.label || v.name,
                                font: '14px arial bold',
                                color: 'white',
                                offset: (v:any) => [
                                    0,
                                    Math.max(12, Math.log2(v.count) * 2.31) + 16,
                                ],
                                outlineWidth: 3,
                                outlineColor: (v:any) => Define.RandomColor[v.motype % 16],
                            },
                        ],
                    } as any,
                },
            ],
        },
        custom: { motype, ...custom },
        // @ts-ignore
        loader,
        listener,
    };
}
