import ResourceFactory from './ResourceFactory.ts';

export default class ResourceManage {
  protected collection: Map<any, any> = new Map();
  protected map: any;
  constructor(map: any) {
    this.collection = new Map();
    this.map = map;
  }

  get count() {
    return this.collection.size;
  }
  clear(id) {
    let co = this.collection.get(id);
    if (co) co.clear?.();
    this.collection.delete(id);
  }
  dispose() {
    this.collection.forEach((value, key, map) => {
      value?.remove?.();
    });
    this.collection.clear();
    this.map = null;
  }
  add(resource: ResourceFactory) {
    resource.setMap(this.map);
    this.collection.set(resource.id, resource);
  }
  remove(id) {
    let co = this.collection.get(id);
    if (co) co.remove?.();
    this.collection.delete(id);
  }
}
