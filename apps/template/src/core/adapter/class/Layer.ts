/**
 * 单一图层管理
 * 2，3维 所有的要素和栅格服务图层都走的   addLayer / addLayerGroup方法了
 */
export default class Layer {
  protected collection: Map<any, any> = new Map();
  protected map: any;
  constructor(map: any) {
    this.collection = new Map();
    this.map = map;
  }
  get count() {
    return this.collection.size;
  }
  /**
   * 判断是否是图层或者图层组
   * @param layer
   */
  _remove(layer) {
    if (layer && layer?.type == 'layer_group') {
      this.map?.removeLayerGroup?.(layer);
    } else {
      this.map?.removeLayer?.(layer);
    }
  }
  _add(layer) {
    if (layer && layer?.type == 'layer_group') {
      this.map?.addLayerGroup?.(layer);
    } else {
      this.map?.addLayer?.(layer);
    }
  }
  clear(id) {
    let layer = this.collection.get(id);
    this._remove(layer);
    this.collection.delete(id);
  }
  dispose() {
    this.removeAll();
    this.map = null;
  }
  add(resource: any) {
    this.map?.addImagery?.(resource);
    const key = resource.get('layerName');
    this.collection.set(key, resource);
  }
  remove(id) {
    let layer = this.collection.get(id);
    this._remove(layer);
    this.collection.delete(id);
  }
  removeAll() {
    this.collection.forEach((value, key, map) => {
      this._remove(value);
    });
    this.collection.clear();
  }
}
