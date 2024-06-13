import { Viewer } from '@dfsj/cesium';

const store = {},
  cache = {};

/***
 * key
 */
export const GisSymbolKey = {
  default: Symbol('gis.key.default'),
  viewEdit: Symbol('gis.key.view-edit'),
  deriveDemo: Symbol('gis.key.derive-demo'),
};
/**
 * 存放gis引用。
 * @param key 唯一key
 * @param gis gis引用
 */
export function setGis(key: symbol, gis: any) {
  return (store[key] = gis);
}
/**
 * 根据key获取gis引用。
 * >
 * 由于地图api采用组合式设计，而项目存在多个地图，因此用key进行区分。
 * @param key
 */
export function getGis(key: symbol = GisSymbolKey.default): any | Viewer {
  return store[key];
}
/**
 * 删除gis引用，仅从映射中删除，不会释放里面的资源。
 * @param key
 */
export function delGis(key: symbol) {
  delete store[key];
}
/**
 * 获取缓存对象（或者其他什么东西），缓存是针对各平台通用的，或者某平台通用的（比如wkt parser）。
 *
 * @param name 缓存名称
 */
export function getCache<T extends any>(name: string): T {
  return cache[name];
}
/**
 * 设置缓存对象（或者其他什么东西）。
 * @param name 缓存名称
 * @param value 缓存值
 */
export function setCache<T extends any>(name: string, value: T): T {
  return (cache[name] = value);
}
/**
 * 清除所有缓存信息。
 */
export function clearCache() {
  Object.keys(cache).forEach((name) => delete cache[name]);
}
