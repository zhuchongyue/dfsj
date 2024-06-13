import type {ViewerConfig} from '@photo-sphere-viewer/core'
import {Viewer} from '@photo-sphere-viewer/core'
import {MarkersPlugin} from '@photo-sphere-viewer/markers-plugin'
import {GalleryItem, GalleryPlugin} from '@photo-sphere-viewer/gallery-plugin'
import {AutorotatePlugin} from '@photo-sphere-viewer/autorotate-plugin'
import {CompassPlugin} from '@photo-sphere-viewer/compass-plugin'
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/gallery-plugin/index.css'
import '@photo-sphere-viewer/compass-plugin/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
// import result from "../data/importImgs";
import './index.less'
import Mark from '../hooks/Mark.vue'
import {useVNode} from '../hooks/useVNode'
import {findParameter, parametersConfig, SPHERE_BASE_URL} from '../config/parameter'

// const SPHERE_BASE_PATH = '/public/sphere/icon/'

export interface IOtherOptions {
	galleries: Array<GalleryItem>
	showGallery: boolean
}

export type ViewerOption = IOtherOptions & ViewerConfig
const createMarks = (name: string) => {
	const markers = findParameter(name)?.linkPanoramas || []
	let marksCfg = markers.map((e) => {
		const { $el, vm } = useVNode(Mark, { text: e.tooltip?.content })
		return {
			id: e.id,
			// ...e,
			// id: getTarget(e.target).id,
			position: { ...e.position },
			// style: {
			//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
			//     cursor         : 'help'
			// },
			// position: {
			//     yaw,
			//     pitch,
			//     rotation,
			//     target: linkId
			// },
			// // html: 'Click here',
			// // image: 'assets/pin-red.png',
			// image: SPHERE_BASE_PATH + 'link.png',
			// size: {width: 32, height: 32},
			tooltip: { ...e.tooltip }, // tooltip with default position and style
			data: {
				...e,
				// compass: '#304ACC'
				compass: '#e4c52c'
			},
			// html: `<div>HTML <b>marker</b> &hearts;</div>`, // 显示内容
			html: $el?.outerHTML
			// scale: {
			//     // the marker is twice smaller on the minimum zoom level
			//     zoom: [0.5, 1]
			// }
		}
	})
	return marksCfg
}
const DEFAULT_OPTIONS = {
	panorama: '监测站点-鸟览'
}

export default class PhotoSphereViewer {
	public _markersPlugin: any //打点插件
	public _autorotatePlugin: any //自动旋转
	public _galleryPlugin: any //图册插件
	public _delegate: any //插件实例
	public options: any

	constructor(options: ViewerOption | object = {}) {
		console.log('parametersConfig', parametersConfig)
		this.options = { ...options, ...DEFAULT_OPTIONS }
		const galleries = parametersConfig?.map((e) => {
			const { name, fullPath } = e
			return {
				// Unique identifier of the item
				id: name,
				/**
				 * 项目的全景图
				 */
				panorama: fullPath,
				/**
				 * 缩略图的网址
				 */
				// thumbnail?: string;
				/**
				 * Text visible over the thumbnail
				 */
				name: name,
				/**
				 * Any option supported by the `setPanorama()` method
				 */
				// options?: PanoramaOptions;
				options: {
					caption: name
				}
			}
		})
		console.log('galleries', galleries)
		this.options.galleries = galleries
		this.options.showGallery = true
		this._delegate = new Viewer({
			container: document.querySelector('#vr-wrapper') as HTMLElement,
			// panorama: baseUrl + 'sphere.jpg',
			// panorama: galleries[0].panorama,
			maxFov: 100, // 最大缩放值
			minFov: 10, // 最小缩放值
			defaultZoomLvl: 10,
			panorama: findParameter(this.options?.panorama)?.fullPath,
			caption: DEFAULT_OPTIONS.panorama,
			loadingTxt: '加载中...',
			loadingImg: SPHERE_BASE_URL + 'icon/loader.gif',
			touchmoveTwoFingers: true,
			mousewheelCtrlKey: false,
			defaultPitch: -0.4650299278673722,
			defaultYaw: 0.19944241883863922,
			navbar: [
				'autorotate',
				'zoom',
				'markers',
				'move',
				'download',
				'gallery',
				'caption',
				'fullscreen'
			],
			plugins: [
				//FIXME 有点报错

				[
					CompassPlugin,
					{
						size: '100px',
						position: 'top left'
						// hotspots: [
						//     {yaw: '0deg', color: 'red'},
						//     {yaw: '90deg', color: 'red'},
						//     {yaw: '180deg', color: 'red'},
						//     {yaw: '270deg', color: 'red'},
						// ],
					}
				],
				// [
				//     GalleryPlugin,
				//     {
				//         visibleOnLoad: true,
				//         hideOnClick: false,
				//     },
				// ],
				[
					AutorotatePlugin,
					{
						// autostartDelay: null,
						/*   autorotatePitch: _this.animatedValues.pitch.end,
                        autostartOnIdle: false, */
						autorotateSpeed: '1rpm',
						autostartDelay: 1500
						// autorotatePitch: '5deg',
					}
				],
				[
					MarkersPlugin,
					{
						visibleRange: {
							min: 0,
							max: 100
						},
						markers: [...createMarks(this.options.panorama)]
					}
				]
			]
		})
		this._markersPlugin = this.getPlugin(MarkersPlugin)
		this._autorotatePlugin = this.getPlugin(AutorotatePlugin)
		this._galleryPlugin = this.getPlugin(GalleryPlugin)
		// this.loadGallery()
		console.log({ markersPlugin: this._markersPlugin })
		// createMarks().forEach(e => this._markersPlugin.addMarker(e))
		// this._markersPlugin.addMarker({
		//     // polygon marker
		//     id: 'polygon',
		//     polyline: [
		//         [6.2208, 0.0906], [0.0443, 0.1028], [0.2322, 0.0849], [0.4531, 0.0387],
		//         [0.5022, -0.0056], [0.4587, -0.0396], [0.252, -0.0453], [0.0434, -0.0575],
		//         [6.1302, -0.0623], [6.0094, -0.0169], [6.0471, 0.032], [6.2208, 0.0906],
		//     ],
		//     svgStyle: {
		//         fill: 'rgba(200, 0, 0, 0.2)',
		//         stroke: 'rgba(200, 0, 50, 0.8)',
		//         strokeWidth: '2px',
		//     },
		//     tooltip: {
		//         content: 'A dynamic polygon marker',
		//         position: 'bottom right',
		//     },
		// })
		this._markersPlugin.addEventListener('select-marker', ({ marker, doubleClick, rightClick }) => {
			console.log('点击了', marker)
			console.log(' this._autorotatePlugin', this._autorotatePlugin)
			// this._autorotatePlugin?.stop?.()
			if (marker?.data) {
				const label = marker.data.tooltip.content
				console.log(this._markersPlugin)
				this._markersPlugin.clearMarkers?.()
				const path = (parametersConfig as Array<any>).find((e) => e.name == label)
				const initialViewParameters = findParameter(label)?.initialViewParameters
				this._delegate
					.setPanorama(path?.fullPath, {
						caption: label,
						...initialViewParameters
					})
					.then(() => {
						console.log('this.', this._delegate, this._autorotatePlugin)
						this._autorotatePlugin?.start?.()
					})
			}
			// if (marker.data?.generated) {
			//     if (doubleClick) {
			//         this._markersPlugin.removeMarker(marker);
			//     } else if (rightClick) {
			//         this._markersPlugin.updateMarker({
			//             id: marker.id,
			//             image: SPHERE_BASE_PATH + 'pictos/pin-blue.png',
			//         });
			//     }
			// }
		})

		console.log('this._delegate', this._delegate)
		this._delegate.addEventListener('before-render', () => {
			// const markers = this._delegate.getPlugin(MarkersPlugin).getMarkers();
			// const cameraPose = this._delegate.getCameraPose();
			// console.log({cameraPose})
			// return
			// markers.forEach((marker) => {
			//     const distance = cameraPosition.distanceTo(marker.position);
			//     if (distance <= 1000) {
			//         marker.visible = true;
			//     } else {
			//         marker.visible = false;
			//     }
			// });
		})
		this._delegate.addEventListener('position-updated', () => {
			// this._delegate.render();
		})
	}

	get camera() {
		return this._delegate.getPosition()
	}

	/***
	 * 加载图册
	 */
	loadGallery() {
		console.log('this.options', this.options)
		if (!this.galleryPlugin) return
		if (this.options?.showGallery && this.options.galleries?.length) {
			this.galleryPlugin.setItems(this.options.galleries) //设置图库
		}
	}

	/**
	 * 获取插件
	 * @param plugin
	 */
	getPlugin(plugin: any) {
		return this.delegate?.getPlugin?.(plugin)
	}

	/**
	 * Viewer实例
	 */
	get delegate() {
		return this._delegate
	}

	/**
	 * markersPlugin
	 */
	get markersPlugin() {
		return this._markersPlugin
	}

	/**
	 * autorotatePlugin
	 */
	get autorotatePlugin() {
		return this._autorotatePlugin
	}

	/**
	 * galleryPlugin
	 */
	get galleryPlugin() {
		return this._galleryPlugin
	}

	/**
	 * 点
	 */
	addMark() {}

	/**
	 * 线
	 */
	addLine() {}

	/**
	 * 面
	 */
	addPolygon() {}

	/***
	 * 销毁
	 */
	destroy() {}
}
