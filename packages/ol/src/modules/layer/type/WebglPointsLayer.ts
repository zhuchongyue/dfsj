import WebGLPointsLayer from 'ol/layer/WebGLPoints.js'
import {Vector as VectorSource} from 'ol/source'
import Layer from '../Layer'

export default class WebglPointsLayer extends Layer {
	constructor(id) {
		super(id)
		this._delegate = new WebGLPointsLayer({
			// @ts-ignore
			source: new VectorSource()
		})
	}
}
