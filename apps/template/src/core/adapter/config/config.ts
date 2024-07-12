import Define from "@/config/Define.ts";
import overlays from "@/core/adapter/config/layer.feature.overlays.ts";
import {getGis, GisSymbolKey} from "@/core/GisCache.ts";
import {visualPlayableWeatherApi} from "@/api/layer.ts";
import {deepMerge} from "@dfsj/utils";
import {collectSpatialDateEnum} from "@/core/adapter/config/default.ts";

export const BasicPolygonConfig = {
    type: "feature",
    format: {
        type: "wkt",
        id: v => v.mocd || v.stcd || v.code || v.id,
        coordinate: v => v?.cgeom || v?.geom || v?.wkt,
        graphic: "polygon",
        fields: "*",
        projection: {from: null, to: null},
    },
    identity: v => v.mocd || v.stcd || v.code || v.id,
    overlay: null,
    styleRenderer: {
        type: "unique",
        store: false,
        field: v => "polygon",
        loses: {
            type: "polygon",
            normal: {
                outlineWidth: 1,
                outlineColor: "#F09",
                outlineLineCap: 'round',       // 设置线的两端为圆头
                color: 'rgba(0,255,0,1)'
            },
            highlight: {
                outlineWidth: 1,
                outlineColor: "#F09",
                outlineLineCap: 'round',       // 设置线的两端为圆头
                color: 'rgba(0,255,0,1)'
            }
        },
    },
}
const configs: any = {
    [collectSpatialDateEnum.HABITATION_POLYGON]: deepMerge({
        ...BasicPolygonConfig
    }, {
        overlay:overlays[collectSpatialDateEnum.HABITATION_POLYGON],
        styleRenderer: {
            loses: {
                type: "polygon",
                normal: {
                    color: 'rgba(0,255,0,0.5)'
                },
                highlight: {
                    color: 'rgba(0,255,0,8)'
                }
            }
        }
    }),
    [640]:{
        id:'640',
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
        overlay:overlays['640'],
        styleRenderer: {
            type: 'unique',
            // @ts-ignore
            store: false,
            field: (v:any) => (v.count > 1 ? 'cluster' : undefined),
            loses: { type: 'billboard',
                normal:{
                    scale: 0.4,
                    label: [
                        {
                            font: "24px",
                            offset: [0, 45],
                            color: "white",
                            outlineColor: "#00ABDF",
                            outlineWidth: 3,
                            text: e => e.adnm,
                            rotation: 0,
                        },
                        {
                            font: "20px",
                            offset: [0, 10],
                            color: "white",
                            outlineColor: "#00ABDF",
                            outlineWidth: 3,
                            text: e => `${e?.disavg ? e.disavg : 0.0}%`,
                            rotation: 0,
                        },
                    ],
                    image: ({disavg}) => {
                        let image = 4;
                        if (disavg > 80) {
                            image = 4
                        } else if (disavg > 60) {
                            image = 3
                        } else if (disavg > 30) {
                            image = 2
                        } else {
                            image = 1
                        }
                        return `/images/layer/640/${image}.png`
                    },
                }, highlight:{} },
        },
    }
};

export default configs;