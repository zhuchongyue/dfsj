export abstract class AbstractResource {
    public listener: any;
    public map: any;
    public config: any;
    protected _lastMouseSampleTime: any;
    protected key: any;
    public vectorLayer: any;
    public vectorLayerGroup: any;
    public vectorLayerCluster: any;
    public vectorLayerAdditional: any;
    public imagery: Map<string, any>;
    public id: any = null;
    public dataSource: [];
    constructor(id: any, config: any, dataSource?: [] ) {
        dataSource = dataSource?.length ? dataSource : [];
        this.id = id;
        this.key = id;
        this.config = config;
        this.imagery = new Map();
        this.dataSource = dataSource;
    }
    public setMap(map:any){};
    public remove() {
        this.vectorLayerGroup &&
        this.map?.removeLayerGroup?.(this.vectorLayerGroup);
        this.vectorLayerGroup = null;
        this.imagery.forEach((value, key, map) => {
            console.log('cccccccc删除',value)
            this.map?.removeImagery?.(value);
        });
        this.imagery.clear();
    }
    public clear() {
        this.vectorLayerCluster?.clear();
        this.vectorLayer?.clear();
    }
    public bindEvent(){}
    public unBindEvent(){}
    public async handleMoveend(ev){}
    public fetch() {
        const { styleRenderer, loader, overlay, identity } = this.config;
        if (!this.map) return;
        let map = this.map;
        console.log('map', map);
        const extent = map?.getExtent?.();
        if (!extent) Promise.resolve([]);
        return new Promise((resolve, reject) => {
            if (this.dataSource?.length) resolve(this.dataSource.slice(0));
            resolve(
                loader?.call(
                    null,
                    Object.assign({}, this.config?.custom, { extent: extent, zoom: map?.view?.getZoom?.() }),
                    this.key
                )
            );
        });
    }
    public async load() {
        let data = await this.fetch();
        this.render(data);
    }
    public setProperty(layerCfg :object, property: string, value: any){

    }
    public getProperty(layerCfg :object,property: string){

    }
    public initialize(){
        return Promise.resolve();
    }
    public render(data: any = []){
        let now = new Date().valueOf();
        if (now < this._lastMouseSampleTime + 500) {
            console.log('取消');
            return;
        }
        this._lastMouseSampleTime = now;
    }
}