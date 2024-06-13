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
		// if (entity.position && entity.billboard) {
		//   return Billboard.fromEntity(entity)
		// }
	}

	/**
	 * Returns polyline Entity
	 * @param entity
	 * @returns {any}
	 * @private
	 */
	_createPolyline(entity) {
		// if (entity.polyline) {
		//   return Polyline.fromEntity(entity)
		// }
	}

	/**
	 * Returns polygon Entity
	 * @param entity
	 * @returns {any}
	 * @private
	 */
	_createPolygon(entity) {
		// if (entity.polygon) {
		//   return Polygon.fromEntity(entity)
		// }
	}

	/**
	 * Returns model Entity
	 * @param entity
	 * @param modelUrl
	 * @returns {Model}
	 * @private
	 */
	_createModel(entity, modelUrl) {
		// if (entity) {
		//   return Model.fromEntity(entity, modelUrl)
		// }
	}

	/**
	 *
	 * @param method
	 * @param context
	 * @returns {GeoJsonLayer}
	 */
	eachOverlay(method, context?) {
		if (this._delegate) {
			let features = this._delegate.getSource().getFeatures()
			features.forEach((item) => {
				method.call(context, item)
			})
			// this._delegate.then(dataSource => {
			//   let entities = dataSource.entities.values
			//   entities.forEach(item => {
			//     method.call(context, item)
			//   })
			// })
			return this
		}
	}

	/**
	 * Converts to VectorLayer
	 * @returns {VectorLayer}
	 */
	toVectorLayer() {
		let layer = new VectorLayer(this.id)
		this.eachOverlay((item) => {
			if (item.billboard) {
				layer.addOverlay(this._createBillboard(item))
			} else if (item.polyline) {
				layer.addOverlay(this._createPolyline(item))
			} else if (item.polygon) {
				layer.addOverlay(this._createPolygon(item))
			}
		}, this)
		return layer
	}

	/**
	 * Converts to VectorLayer
	 * @param modelUrl
	 * @returns {VectorLayer}
	 */
	toModelLayer(modelUrl) {
		let layer = new VectorLayer(this.id)
		this.eachOverlay((item) => {
			layer.addOverlay(this._createModel(item, modelUrl))
		}, this)
		return layer
	}
}

Layer.registerType('wkt')

export default WktLayer
