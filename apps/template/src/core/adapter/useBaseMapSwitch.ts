import {getGis, GisSymbolKey} from "@/core/GisCache.ts";

/**
 * 用于2,3维切换底图。
 */
export function useBaseMapSwitch(key: symbol = GisSymbolKey.deriveDemo) {
    /** 开始切换*/
    function onSwitch(config:any, {index}: any) {
        const map = getGis(key);
        console.log('map', map)
        const _key = 'layerName';
        const value = config.layerName;
        if (map?.camera) {
            map?.changeBaseLayer(index)
        } else {
            map?.changeBaseLayer?.(_key, value);
        }
        loadAdditional()
        removeAdditional()
    }

    //附加的  例如不同的底图图层需要额外加载或者删除图层
    function loadAdditional() {

    }

    function removeAdditional() {

    }

    return {
        onSwitch
    }
}