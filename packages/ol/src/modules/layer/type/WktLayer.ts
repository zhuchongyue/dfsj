import Layer from '../Layer'
import VectorLayer from './VectorLayer'
import State from '../../state/State'
import olVectorLayer from 'ol/layer/Vector'
import {Vector as VectorSource} from 'ol/source'
import GeometryHelper from '../../helpers/GeometryHelper'
import {GeometryFormatType} from '../../overlay/GeometryType'

class WktLayer extends Layer {
    constructor(
        id,
        url,
        options = {
            dataProjection: '',
            featureProjection: ''
        }
    ) {
        if (!url) {
            console.error('WktLayer：the url invalid')
            return
        }
        super(id)
        let geomFormat = GeometryHelper.getFormatType(GeometryFormatType.WKT)
        let fs = geomFormat.readFeatures(url, {
            dataProjection: options.dataProjection,
            featureProjection: options.featureProjection
        })
        // console.log('fs',fs)
        this._delegate = new olVectorLayer({
            //矢量图层
            source: new VectorSource({
                features: fs
            }),
            zIndex: 10
        })
        this._state = State.INITIALIZED
    }

    get type() {
        return Layer.getLayerType('wkt')
    }

    _createBillboard(entity) {

    }

    _createPolyline(entity) {

    }

    _createPolygon(entity) {

    }

    _createModel(entity, modelUrl) {

    }

    eachOverlay(method, context?) {
        if (this._delegate) {
            let features = this._delegate.getSource().getFeatures()
            features.forEach((item) => {
                method.call(context, item)
            })
            return this
        }
    }
}

Layer.registerType('wkt')

export default WktLayer
