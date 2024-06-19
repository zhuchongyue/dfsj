/** 获取不同地图的 影像  矢量 管理实例*/
import { getGis, GisSymbolKey } from '/@/core/GisCache';
import LayerManager from "@/core/adapter/class/LayerManager.ts";
import ResourceManage from "@/core/adapter/class/ResourceManage.ts";
let layerManages:any = {};
let resourceManages:any = {};
export function getLayerManage(key: symbol = GisSymbolKey.default): LayerManager {
  if (Reflect.has(layerManages, key) && layerManages?.[key]) {
    return layerManages?.[key];
  } else {
    let instance = new LayerManager(key);
    Reflect.set(layerManages, key, instance);
    return Reflect.get(layerManages, key);
  }
}
export function delLayerManage(key: symbol = GisSymbolKey.default) {
  if (getLayerManage(key)) {
    getLayerManage(key)?.dispose();
    delete layerManages[key];
  }
}

export function getResourceManage(key: symbol = GisSymbolKey.default): ResourceManage {
  if (Reflect.has(resourceManages, key) && resourceManages?.[key]) {
    return resourceManages?.[key];
  } else {
    let instance = new ResourceManage(getGis(key));
    Reflect.set(resourceManages, key, instance);
    return Reflect.get(resourceManages, key);
  }
}
export function delResourceManage(key: symbol = GisSymbolKey.default) {
  if (getResourceManage(key)) {
    getResourceManage(key)?.dispose();
    delete resourceManages[key];
  }
}

export function generateUniqueId(layerCfg: any) {
  return `${layerCfg?.id}${layerCfg?.name}${layerCfg?.layer ?? ''}`;
}
