import {isFunction} from '../utils/common'
import {Style as olStyle} from 'ol/style'
import {Feature as olFeature} from 'ol'
import Style from '../style/Style'
// import LayerUtils from "../map/LayerUtils";
import {Mixin} from 'ts-mixer'
// import ViewUtils from "../map/ViewUtils";
import VectorLayer from 'ol/layer/Vector'
// import Layer from "../map/Layer";
// import GeometryUtils from "../geom/GeometryUtils";
import Global from '../helpers/Global'

export default class FeatureHelper extends Mixin(
	// LayerUtils,
	// ViewUtils,
	Global
	// Layer,
	// GeometryUtils,
) {
	/**
	 * 调整视图
	 * @param geometry
	 * @param params
	 */
	fixView(geometry, params) {
		if (params['zoomToExtent']) {
			let extent = geometry.getExtent()
			// if (params['view'] && params['view']['adjustExtent']) {
			//     extent = this.adjustExtent(extent, params['view']);
			// }
			// this.zoomToExtent(extent, true);
		}
	}

	/**
	 * 添加样式
	 * @param data_
	 * @param params
	 * @param feature
	 * @returns {*}
	 */
	static fixStyle(data_, params, feature) {
		if (!data_['attributes']) data_['attributes'] = {}
		let [style, selectStyle] = [null, null]
		const _style = data_['attributes']['style'] || params['style']
		const _selectStyle = data_['attributes']['selectStyle'] || params['selectStyle']
		if (_style && _style instanceof olStyle) {
			style = _style
		} else if (isFunction(_style)) {
			style = _style
		} else if (typeof _style === 'object') {
			// style = new OlStyleFactory.create(_style);
			//TODO 该条数据传进去 提供眼样式的判断
			const attributes = data_['attributes'] || data_
			style = Style.create(_style, attributes)
		}
		if (_selectStyle && _selectStyle instanceof olStyle) {
			selectStyle = _selectStyle
		} else if (isFunction(_selectStyle)) {
			selectStyle = _selectStyle
		} else if (typeof _selectStyle === 'object') {
			//TODO 该条数据传进去 提供眼样式的判断
			const attributes = data_['attributes'] || data_
			selectStyle = Style.create(_selectStyle, attributes)
			// selectStyle = new OlStyleFactory.create(_selectStyle);
			// selectStyle = OlStyleFactory.create(_selectStyle);
		}
		if (style && feature) {
			feature.setStyle(style)
			feature.set('style', style)
			if (selectStyle) {
				feature.set('selectStyle', selectStyle)
			}
		}
		return feature
	}

	/**
	 * 添加相关属性信息
	 * @param data_
	 * @param params
	 * @param feature
	 * @returns {*}
	 */
	static fixProperties(data_, params, feature) {
		if (data_['attributes'] && (data_['attributes']['id'] || data_['attributes']['ID'])) {
			let id = data_.attributes['id'] || data_.attributes['ID'] || params['id']
			feature.setId(id)
			feature.setProperties(data_['attributes'])
		}
		return feature
	}

	/**
	 * 向图层添加要素
	 * @param params
	 * @param feature
	 */
	appendFeature(params, feature) {
		params['create'] = true
		// let layer = LayerUtils.createVectorLayer(this._delegate, params['layerName'], params);
		// layer.getSource().addFeature(feature);
		// this.orderLayerZindex();
	}

	/**
	 * 在某个图层查找id匹配的要素
	 * @param layer
	 * @param id
	 * @returns {*}
	 */
	getFeatureFromLayer(layer, id) {
		let feature
		if (layer && layer instanceof VectorLayer && id) {
			const source = layer.getSource()
			if (source && source.getFeatureById) {
				feature = source.getFeatureById(id)
			}
		}
		return feature
	}

	/**
	 * 通过id获取Feature
	 * @param id
	 * @returns {*}
	 */
	getFeatureById(id) {
		// let layers = this.getVectorLayers();
		// let feature;
		// layers.every(layer => {
		//     feature = this.getFeatureFromLayer(layer, id);
		//     if (feature && feature instanceof olFeature) {
		//         return false;
		//     } else {
		//         return true;
		//     }
		// });
		// return feature;
	}

	/**
	 * 通过id和layerName获取Feature
	 * （若在当前layerName查不到，则查询全部图层）
	 * @param id
	 * @param layerName
	 * @returns {*}
	 */
	getFeatureById2LayerName(id, layerName) {
		// let feature;
		// if (layerName) {
		//     let layer = this.getLayerByLayerName(layerName);
		//     feature = this.getFeatureFromLayer(layer, id);
		// }
		// if (!feature || !(feature instanceof olFeature)) {
		//     feature = this.getFeatureById(id);
		// }
		// return feature;
	}

	/**
	 * 设置点的空间信息
	 * @param point
	 * @param geometry
	 * @param params
	 */
	setPointGeometry(point, geometry, params) {
		// if (point && geometry && point instanceof olFeature) {
		//     let _geometry = GeometryUtils.getGeomFromGeomData(
		//         {
		//             geometry: geometry
		//         },
		//         params
		//     );
		//     point.setGeometry(_geometry);
		// } else {
		//     console.info('传入数据有误！');
		// }
	}

	/**
	 * 通过图层名移除要素
	 * @param layerName
	 * @param fast
	 * @returns {Array}
	 */
	removeFeatureByLayerName(layerName, fast?) {
		// try {
		//     this._removeSelectFeature(null, true);
		//     let layer = this.getLayerByLayerName(layerName);
		//     let features = [];
		//     if (layer && layer instanceof VectorLayer) {
		//         const source = layer.getSource();
		//         if (source && source.clear) {
		//             if (source.getFeatures) {
		//                 features = source.getFeatures();
		//             }
		//             source.clear(fast || false);
		//         }
		//     }
		//     return features;
		// } catch (e) {
		//     console.log(e);
		// }
	}

	/**
	 * 移除多个图层的要素
	 * @param layerNames
	 * @returns {Array}
	 */
	removeFeatureByLayerNames(layerNames) {
		let features = []
		this._removeSelectFeature(null, true)
		if (layerNames && Array.isArray(layerNames) && layerNames.length > 0) {
			layerNames.forEach((item) => {
				features = features.concat(this.removeFeatureByLayerName(item))
			})
			return features
		} else {
			console.info('传入的不是数组！')
		}
	}

	/**
	 * 移除当前要素
	 * @param feature
	 */
	removeFeature(feature) {
		// this._removeSelectFeature(feature, false);
		// if (feature && feature instanceof olFeature) {
		//     let targetLayer = this.getLayerByFeature(feature);
		//     if (targetLayer) {
		//         let source = targetLayer.getSource();
		//         if (source && source.removeFeature) {
		//             source.removeFeature(feature);
		//         }
		//     }
		// } else {
		//     throw new Error('传入的不是要素!');
		// }
	}

	/**
	 * 通过id移除要素
	 * @param id
	 * @param layerName
	 */
	removeFeatureById(id, layerName) {
		// let feature;
		// if (this._delegate && id) {
		//     if (layerName) {
		//         let layer = this.getLayerByLayerName(layerName);
		//         if (layer && layer.getSource) {
		//             let source = layer.getSource();
		//             if (source && source.getFeatureById) {
		//                 feature = source.getFeatureById(id);
		//                 if (feature && feature instanceof olFeature) {
		//                     source.removeFeature(feature);
		//                     this._removeSelectFeature(feature, false);
		//                 }
		//             }
		//         }
		//     } else {
		//         let layers = this.getAllLayers();
		//         layers.every(layer => {
		//             feature = this.getFeatureFromLayer(layer, id);
		//             if (feature && feature instanceof olFeature) {
		//                 layer.getSource().removeFeature(feature);
		//                 this._removeSelectFeature(feature, false);
		//                 return false;
		//             } else {
		//                 return true;
		//             }
		//         });
		//     }
		// }
		// return feature;
	}

	/**
	 * 移除多个要素
	 * @param ids
	 * @param layerName
	 */
	removeFeatureByIds(ids, layerName) {
		let features = []
		if (ids && Array.isArray(ids) && ids.length > 0) {
			ids.forEach((item) => {
				features.push(this.removeFeatureById(item, layerName))
			})
		} else {
			console.info('id为空或者不是数组！')
		}
		return features
	}

	/**
	 * 高亮要素
	 * @param key (若传feat时其他参数可不传)
	 * @param style
	 * @param keep
	 * @returns {*}
	 */
	highLightFeature(key, style?, keep?) {
		if (!this._delegate) return
		if (key && key instanceof olFeature) {
			if (style && style instanceof olStyle) {
				key.setStyle(style)
			} else if (isFunction(style)) {
				key.setStyle(style)
			} else if (typeof style === 'object') {
				// let st = new olStyleFactory(style);
				let st = Style.create(style)
				key.setStyle(st)
			} else {
				let selectStyle = key.get('selectStyle')
				if (selectStyle && selectStyle instanceof olStyle) {
					key.setStyle(selectStyle)
				} else if (isFunction(selectStyle)) {
					key.setStyle(style)
				} else if (typeof selectStyle === 'object') {
					// let st = new olStyleFactory(selectStyle);
					let st = Style.create(selectStyle)
					key.setStyle(st)
				}
			}
			return key
		} else if (key && typeof key === 'string' && key.trim() !== "''") {
			// let feature = this.getFeatureById(key);
			// if (feature && feature instanceof olFeature) {
			//     if (style && style instanceof olStyle) {
			//         feature.setStyle(style);
			//     } else if (isFunction(style)) {
			//         feature.setStyle(style);
			//     } else if (typeof style === 'object') {
			//         // let st = new olStyleFactory(style);
			//         let st = Style.create(style);
			//         feature.setStyle(st);
			//     } else {
			//         let selectStyle = feature.get('selectStyle');
			//         if (selectStyle && selectStyle instanceof olStyle) {
			//             feature.setStyle(selectStyle);
			//         } else if (isFunction(style)) {
			//             feature.setStyle(selectStyle);
			//         } else if (typeof selectStyle === 'object') {
			//             // let st = new olStyleFactory(selectStyle);
			//             let st = Style.create(selectStyle);
			//             feature.setStyle(st);
			//         }
			//     }
			//     feature.set('keepStyle', keep);
			// }
			// return feature;
		}
	}

	/**
	 * 取消高亮状态
	 * @param key (若传feat时其他参数可不传)
	 * @param style
	 * @param unKeep
	 * @returns {*}
	 */
	unHighLightFeature(key, style?, unKeep?) {
		if (!this._delegate) return
		if (key && key instanceof olFeature) {
			if (!unKeep && key.get('keepStyle')) return key
			key.set('keepStyle', false)
			if (style && style instanceof olStyle) {
				key.setStyle(style)
			} else if (isFunction(style)) {
				key.setStyle(style)
			} else if (typeof style === 'object') {
				// let st = new olStyleFactory(style);
				let st = Style.create(style)
				key.setStyle(st)
			} else {
				let normalStyle = key.get('style')
				if (normalStyle && normalStyle instanceof olStyle) {
					key.setStyle(normalStyle)
				} else if (isFunction(normalStyle)) {
					key.setStyle(normalStyle)
				} else if (typeof normalStyle === 'object') {
					// let st = new olStyleFactory(normalStyle);
					let st = Style.create(normalStyle)
					key.setStyle(st)
				}
			}
			return key
		} else if (key && typeof key === 'string' && key.trim() !== "''") {
			let feature = this.getFeatureById(key)
			// if (feature && feature instanceof olFeature) {
			//     if (!unKeep && feature.get('keepStyle')) return feature;
			//     feature.set('keepStyle', false);
			//     if (style && style instanceof olStyle) {
			//         feature.setStyle(style);
			//     } else if (isFunction(style)) {
			//         feature.setStyle(style);
			//     } else if (typeof style === 'object') {
			//         let st =  Style.create(style);
			//         feature.setStyle(st);
			//     } else {
			//         let normalStyle = feature.get('style');
			//         if (normalStyle && normalStyle instanceof olStyle) {
			//             feature.setStyle(normalStyle);
			//         } else if (isFunction(normalStyle)) {
			//             feature.setStyle(style);
			//         } else if (typeof normalStyle === 'object') {
			//             let st =Style.create(normalStyle);
			//             feature.setStyle(st);
			//         }
			//     }
			// }
			// return feature;
		}
	}
}
