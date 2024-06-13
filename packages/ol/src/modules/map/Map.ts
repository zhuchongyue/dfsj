/**
 * 地图
 */
import DomUtil from '../utils/DomUtil'
import {Mixin} from 'ts-mixer'
import View from './View'
import {Map as olMap, Observable} from 'ol'
import MouseEvent from '../event/type/MouseEvent'
import BaseLayers from './BaseLayers'
import createWidgets from '../widget'
import createTools from '../tools'
import Transform from '../proj/Transform'
import ViewHelper from '../helpers/ViewHelper'
import {defaults as defaultControls} from 'ol/control'

export default class Map extends Mixin(BaseLayers, ViewHelper, Observable) {
	constructor(id, options) {
		super(options)
		//1、创建dom容器
		this._targetEl = DomUtil.create(
			'div',
			'ecol-container',
			typeof id === 'string' ? document.getElementById(id) : id
		)
		this._use(
			new Transform(this, {
				destination: this.projection.getCode()
			})
		)
		//2、view
		this._view = new View(this)
		//3、controls
		let baseLayers = []
		baseLayers = this.addBaseLayer(this._options?.baseLayers)
		console.log('baseLayers', baseLayers)
		//4、interactions
		//5、baseLayer
		this._delegate = new olMap({
			target: this._targetEl,
			// loadTilesWhileAnimating:
			//   typeof this.options_['loadTilesWhileAnimating'] === 'boolean'
			//     ? this.options_['loadTilesWhileAnimating']
			//     : false,
			// loadTilesWhileInteracting:
			//   typeof this.options_['loadTilesWhileInteracting'] === 'boolean'
			//     ? this.options_['loadTilesWhileInteracting']
			//     : false,
			// logo: logo,
			layers: baseLayers,
			view: this._view,
			// renderer: this._options['renderer']?? undefined,
			// interactions: interactions,
			// controls: controls
			controls: defaultControls(options?.controls)
		})
		//6、event
		/** 加载事件*/
		new MouseEvent(this)
		/**
		 * 安装全局单例插件
		 */
		let widgets = createWidgets()
		Object.keys(widgets).forEach((key) => {
			this._use(widgets[key])
		})
		let tools = createTools()
		Object.keys(tools).forEach((key) => {
			this._use(tools[key])
		})
	}
}
