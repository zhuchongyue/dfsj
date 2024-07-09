import GeometryHelper from '../../helpers/GeometryHelper';
import {GeometryFormatType} from '../../overlay/GeometryType';
import State from '../../state/State';
import Layer from '../Layer';
import olVectorLayer from 'ol/layer/Vector';
import {Vector as VectorSource} from 'ol/source';

import VectorLayer from './VectorLayer';

class WkbLayer extends Layer {
    constructor(
        id,
        url,
        options = {
            dataProjection: '',
            featureProjection: '',
        }
    ) {
        super(id);
        if (!url) {
            console.error('WkbLayer：the url invalid');
            return;
        }
        let geomFormat = GeometryHelper.getFormatType(GeometryFormatType.WKB);
        let fs = geomFormat.readFeatures(url, {
            dataProjection: options.dataProjection,
            featureProjection: options.featureProjection,
        });
        this._delegate = new olVectorLayer({
            //矢量图层
            source: new VectorSource({
                features: fs,
            }),
            zIndex: 10,
        });
        this._state = State.INITIALIZED;
    }

    get type() {
        return Layer.getLayerType('wkb');
    }

    _createBillboard(entity) {

    }

    _createPolyline(entity) {

    }

    _createPolygon(entity) {

    }

    eachOverlay(method, context?) {
        if (this._delegate) {
            let features = this._delegate.getSource().getFeatures();
            features.forEach((item) => {
                method.call(context, item);
            });
            return this;
        }
    }

    toVectorLayer() {

    }

}

Layer.registerType('wkb');

export default WkbLayer;
