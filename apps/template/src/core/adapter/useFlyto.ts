import {getGis, GisSymbolKey} from "@/core/GisCache.ts";
import {VectorLayer as OlVectorLayer} from "@dfsj/ol";
import {VectorLayer as CesiumVectorLayer} from "@dfsj/cesium";
import {deepMerge} from "@dfsj/utils";

/**
 * 用于2,3维飞行定位[飞行到固定的   点  线  面]  回调函数
 * 第一种：直接定位飞到   某一点不需要创建任何广告牌
 * 第二种：飞到指定位置无图标   聚焦框
 * 第三种：飞到指定位置要图标   聚焦框
 * 第四种：飞到指定位置要图标   无聚焦
 * */
export type Coordinate = [lon: number, lat: number];
export type Graphic = any;
export type Extent = [xMin: number, yMin: number, xMax: number, yMax: number];

let single: any = new Map<string, any>();
const layerName = `fly-layer-man`;
const def = {}

export function useFlyto(gisKey: symbol = GisSymbolKey.default, options = {enableDisposeOnUnmount: false}) {
    function fly(target: Graphic | Coordinate | Extent,
                 options?: any,
    ) {
        const optioned: any = deepMerge({}, def, options);
        console.log({target})
        //判断是不是有效的坐标
        if (Array.isArray(target) && target.filter(Boolean).length === 0) {
            // 通过坐标定位，坐标为空时，不定位
            return Promise.reject(new Error('经纬度不合法，请检查'))
        }
        ;
        const platform = getGis(gisKey);
        ///3维的情况
        if (platform?.camera) {

        } else {
            const z = platform.zoom;
            let zoomed = optioned.zoom ?? z;
            if (typeof zoomed === 'string') {
                // 如果zoom为一个增量，则最终zoom为当前zoom+增量
                if (zoomed.startsWith('+') || zoomed.startsWith('-')) {
                    zoomed = optioned.minZoom < z && z < optioned.maxZoom ? z + +zoomed : z;
                } else {
                    zoomed = +zoomed; // 转换为数字
                }
            }
            ;
            // 这里表示target一定为坐标（不是边界、也不是图形对象）
            if (Array.isArray(target) && !isNaN(target[0]) && target.length < 4) {
                platform?.flyToPosition?.(target, {
                    duration: optioned?.duration,
                    zoom: zoomed,
                });
                // 这里表示target一定是bbox 边界的形式
            } else if (Array.isArray(target) && !isNaN(target[0])) {
                platform?.flyToBounds(target, {
                    duration: 500,
                    padding: [20, 20, 20, 20],
                });
                //图形的形式
            } else {
                if (Array.isArray(target)) {
                    target = target[0];
                }
            }
        }
    }

    function flyHome() {

    }

    function dispose() {

    }

    function getSingle() {
        if (getGis(gisKey)?.getLayer?.(layerName)) {
            single = getGis(gisKey)?.getLayer?.(layerName);
        } else {
            single = getGis(gisKey)?.camera ? new CesiumVectorLayer(layerName) : new OlVectorLayer(layerName, {zIndex: 20});
            getGis(gisKey)?.addLayer?.(single);
        }
    }

    return {
        fly,
        flyHome,
        dispose
    }
}