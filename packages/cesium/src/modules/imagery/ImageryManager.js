import ImageryLayerFactory from "./ImageryLayerFactory";

export default class ImageryManager {
    constructor(viewer) {
        this._viewer = viewer;
        this._imageryLayers = viewer.imageryLayers;
    }

    /**
     * 添加影像图层
     * */
    addImagery(type, options, index = null) {
        const {show = true, layerName = '图层', alpha = 0.5, brightness = 1} = options;
        let imageryLayerProvider = ImageryLayerFactory.createImageryLayer(type, options)
        let imageryLayer = this._imageryLayers.addImageryProvider(imageryLayerProvider, index)
        // createImageryLayer(type, options)
        imageryLayer.show = show
        imageryLayer.name = layerName
        imageryLayer.alpha = alpha
        imageryLayer.brightness = brightness
        return imageryLayer;
    }

    /**
     * 设置显隐
     * */
    setVisible(layerName, show) {
        let target = this._checkLayer(layerName);
        if (target) {
            target.show = show
        } else {
            throw Error('图层不存在！')
        }
    }


    /**
     * 按名称查找
     * */
    getLayerByLayerName(layerName) {
        if (!layerName) throw Error('请传入layerName或者layer！');
        let [target] = [void 0];
        if (typeof layerName == 'string') {
            target = this._imageryLayers._layers.find((e) => {
                return e.name == layerName;
            })
        } else {

        }
        console.log({target})
        return target;
    }

    /**
     * 删除图层
     * */
    removeImagery(layerOrName) {
        let target = this._checkLayer(layerOrName)
        this._imageryLayers.remove(target, true)
    }

    /**
     * 是否包含该图层
     * */
    isContains(layerOrName) {
        let target = this._checkLayer(layerOrName);
        if (!target) return false;
        return this._imageryLayers.contains(target);
    }

    /**
     * 查找
     * */
    _checkLayer(layerOrName) {
        if (!layerOrName) throw Error('请传入layerName或者layer！');
        let [target] = [void 0];
        if (typeof layerOrName == 'string') {
            target = this._imageryLayers._layers.find((e) => {
                return e.name == layerOrName;
            })
        } else {
            target = layerOrName
        }
        return target
    }

    /** 下移一层*/
    lower(layerOrName) {
        let layer = this._checkLayer(layerOrName);
        this._imageryLayers.lower(layer)
    }


    /** 上移一层*/
    raise(layerOrName) {
        let layer = this._checkLayer(layerOrName);
        this._imageryLayers.lower(layer)
    }

    /** 最下层*/
    lowerToBottom(layerOrName) {
        let layer = this._checkLayer(layerOrName);
        this._imageryLayers.lowerToBottom(layer)
    }

    /** 最上层*/
    raiseToTop(layerOrName) {
        let layer = this._checkLayer(layerOrName);
        this._imageryLayers.raiseToTop(layer)
    }

    /**移除所有*/
    removeAll(destroy = true) {
        this._imageryLayers.removeAll(destroy)
    }

    /** 销毁*/
    destroy() {
        this._imageryLayers.destroy()
    }


}
