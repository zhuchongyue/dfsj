import { getGis, GisSymbolKey } from '@/core/GisCache.ts';
import ResourceFactory from "./ResourceFactory.ts";
import {generateUniqueId, getResourceManage} from "@/core/adapter/class/index.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
export default class LayerManager {
  protected collection: Map<any, any> = new Map();
  protected _gisKey: any = null;
  protected _platform: any = null;
  constructor(key: symbol = GisSymbolKey.default,platform:GisPlatformEnum = GisPlatformEnum.OPENLAYERS) {
    this._gisKey = key;
    this._platform = platform;
  }
  get gisKey(){
    return this._gisKey;
  }
  get platform(){
    return this._platform;
  }
  get count() {
    return this.collection.size;
  }
  get map() {
    return getGis(this._gisKey);
  }
  get resourceManager() {
    return getResourceManage(this._gisKey);
  }
  dispose() {
    this.resourceManager?.dispose?.()
    this.clear()
  }
  /**
   * 新增图层到地图
   * @param layer
   */
  addition(layer: any, dataSource?: []): any {
    console.log('////新增图层....', layer);
    const _layer = Array.isArray(layer) ? layer : layer ? [layer] : [];
    const promises = _layer.map(async (item) => {
      const Resource = ResourceFactory.createResource(this.platform);
      const resource = new Resource(generateUniqueId(item), item, dataSource);
      await resource.initialize();
      this.collection.set(generateUniqueId(item), resource);
      this.resourceManager.add(resource);
    });
    return Promise.all(promises).then(() => {
      console.log('所有异步操作都已完成');
    });
  }
  /**
   * 从地图移出删除图层
   * @param layer
   */
  remove(layer: any): void {
    const _layer = Array.isArray(layer) ? layer : layer ? [layer] : [];
    if (_layer.length) {
      return _layer.forEach((item) => {
        this.resourceManager.remove(generateUniqueId(item));
        this.collection.delete(generateUniqueId(item));
      });
    }
  }
  clear() {
    this.collection.forEach((value, key, map) => {
      this.resourceManager.remove(value?.id);
    });
    this.collection.clear();
  }
  modify(layer: any, property: string, value: any) {
    let resource = this.collection.get(generateUniqueId(layer));
    if (!resource) {
      layer[property] = value;
      return
    };
    resource.setProperty(layer ,property, value);
  }
  query(layer: any, property:string): any {
    let resource = this.collection.get(generateUniqueId(layer));
    if (!resource) {
      return layer[property];
    };
    return resource?.getProperty(layer , property);
  }
}
