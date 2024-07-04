/**
 * 通过自定义的格式进来转换成ol需要的格式
 */
import {getter} from '@dfsj/utils';
import {Style} from 'ol/style'

const Z_INDEX = 2
export default class StyleHelper {
	static EMPTY_STYLE = new Style()

	static judgment(style, execute) {
		if (style instanceof Style) {
			return style
		} else if (Object.keys(style).length == 0) {
			return {}
		} else {
			return execute?.call(this)
		}
	}

	static Billboard(style: any = {}, attr = {}, zoom) {
		const execute = () => {
			const { label, scale, image, rotation } = style
			const zooms = style?.zooms ?? undefined
			let lzs = label?.zooms ?? null
			const noLabel = zoom != null && lzs != null && (zoom < lzs[0] || zoom > lzs[1])
			return {
				text: {
					placement: null,
					overflow: null,
					font: label?.font,
					// offsetX: label?.offset?.[0] ,
					// offsetY: label?.offset?.[1] ,
					offsetX: getter(label?.offset, attr, [0, 0])?.[0],
					offsetY: getter(label?.offset, attr, [0, 0])?.[1],
					scale: undefined,
					// text: label?.text ,
					text: !noLabel ? getter(label?.text, attr, '') : '',
					textAlign: getter(label?.align, attr, 'center'),
					textBaseline: 'alphabetic',
					rotateWithView: false,
					fill: {
						color: label?.color
					},
					backgroundFill: '',
					stroke: {
						color: label?.outlineColor,
						lineCap: '',
						lineJoin: '',
						lineDash: '',
						lineDashOffset: '',
						miterLimit: '',
						width: label?.outlineWidth
					},
					backgroundStroke: '',
					maxAngle: undefined,
					rotation: 0,
					padding: undefined
				},
				image: {
					type: 'icon',
					scale: getter(scale, attr, 1),
					// scale:scale,
					src: getter(image, attr, ''),
					// src:image,
					rotation: getter(rotation, attr, 0)
				}
			}
		}
		return StyleHelper.judgment(style, execute)
	}

	static Point(style: any = {}, attr: any = {}) {
		const execute = () => {
			const { label, color, size, outlineWidth, outlineColor } = style
			const image = style?.image
			return {
				text: {
					placement: null,
					overflow: null,
					font: label?.font,
					offsetX: label?.offset?.[0],
					offsetY: label?.offset?.[1],
					scale: undefined,
					text: label?.text,
					textAlign: label?.textAlign ?? label?.align,
					textBaseline: 'alphabetic',
					rotateWithView: false,
					fill: {
						color: label?.color
					},
					backgroundFill: '',
					stroke: {
						color: label?.outlineColor,
						lineCap: '',
						lineJoin: '',
						lineDash: '',
						lineDashOffset: '',
						miterLimit: '',
						width: label?.outlineWidth
					},
					backgroundStroke: '',
					maxAngle: undefined,
					rotation: 0,
					padding: undefined
				},
				image: {
					type: getter(image?.type, attr, 'circle'),
					fill: {
						color: getter(color, attr, '#fff')
					},
					radius: getter(size, attr, 5),
					stroke: {
						color: getter(outlineColor, attr, null),
						lineCap: '',
						lineJoin: '',
						lineDash: '',
						lineDashOffset: '',
						miterLimit: '',
						width: getter(outlineWidth, attr, 1)
					}
				}
			}
		}

		return StyleHelper.judgment(style, execute)
	}

	static Polygon(style: any = {}, attr = {}) {
		/**
		 *   outlineWidth: 3,
		 *   outlineColor: "red",
		 *   outlineLineCap: 'round',       // 设置线的两端为圆头
		 *   color: '#0F0'
		 */
		const execute = () => {
			const { zIndex, color, outlineWidth, outlineColor, outlineLineCap, outlineDash = [] } = style
			let label = style?.label ?? {}
			return {
				zIndex: getter(zIndex, attr, Z_INDEX),
				text: {
					placement: null,
					overflow: null,
					font: label?.font,
					offsetX: label?.offset?.[0],
					offsetY: label?.offset?.[1],
					scale: undefined,
					text: label?.text,
					textAlign: '',
					textBaseline: 'alphabetic',
					rotateWithView: false,
					fill: {
						color: label?.color
					},
					backgroundFill: '',
					stroke: {
						color: label?.outlineColor,
						lineCap: '',
						lineJoin: '',
						lineDash: '',
						lineDashOffset: '',
						miterLimit: '',
						width: label?.outlineWidth
					},
					backgroundStroke: '',
					maxAngle: undefined,
					rotation: 0,
					padding: undefined
				},
				fill: {
					color: getter(color, attr, null)
				},
				stroke: {
					color: outlineColor,
					lineCap: outlineLineCap,
					lineJoin: '',
					lineDash: outlineDash,
					lineDashOffset: '',
					miterLimit: '',
					width: outlineWidth
				}
			}
		}

		return StyleHelper.judgment(style, execute)
	}

	static Polyline(style: any = {}, attr = {}) {
		/**
		 *   outlineWidth: 3,
		 *   outlineColor: "red",
		 *   outlineLineCap: 'round',       // 设置线的两端为圆头
		 *   color: '#0F0'
		 */
		const execute = () => {
			console.log('....execute', style)
			const {
				zIndex,
				label = {},
				color,
				outlineWidth,
				outlineColor,
				outlineLineCap,
				outlineDash = []
			} = style
			return {
				zIndex: getter(zIndex, attr, Z_INDEX),
				text: {
					placement: null,
					overflow: null,
					font: label.font,
					offsetX: label.offset?.[0],
					offsetY: label.offset?.[1],
					scale: undefined,
					text: label?.text,
					textAlign: '',
					textBaseline: 'alphabetic',
					rotateWithView: false,
					fill: {
						color: label.color
					},
					backgroundFill: '',
					stroke: {
						color: label.outlineColor,
						lineCap: '',
						lineJoin: '',
						lineDash: '',
						lineDashOffset: '',
						miterLimit: '',
						width: label.outlineWidth
					},
					backgroundStroke: '',
					maxAngle: undefined,
					rotation: 0,
					padding: undefined
				},
				fill: {
					color: getter(color, attr, 'red')
				},
				stroke: {
					color: getter(outlineColor, attr, 'red'),
					lineCap: getter(outlineLineCap, attr, null),
					lineJoin: '',
					lineDash: getter(outlineDash, attr, null),
					lineDashOffset: '',
					miterLimit: '',
					width: getter(outlineWidth, attr, 10)
				}
			}
		}
		return StyleHelper.judgment(style, execute)
	}

	static Standard() {
		return {
			geometry: {},
			zIndex: 0,
			fill: {
				color: 'red'
			},
			stroke: {
				color: '',
				lineCap: '',
				lineJoin: '',
				lineDash: '',
				lineDashOffset: '',
				miterLimit: '',
				width: ''
			},
			image: {
				type: 'icon circle shape',
				//icon
				anchor: [0.5, 0.5],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				anchorOrigin: 'top-left',
				color: 'transparent',
				crossOrigin: undefined,
				img: undefined,
				offset: [0, 0],
				offsetOrigin: 'top-left',
				scale: 1,
				snapToPixel: undefined,
				rotateWithView: false,
				opacity: 1,
				rotation: 0,
				size: undefined,
				imgSize: undefined,
				src: undefined,
				declutterMode: 'declutter',
				//circle
				fill: {
					color: 'red'
				},
				radius: 10,
				stroke: {
					color: '',
					lineCap: '',
					lineJoin: '',
					lineDash: '',
					lineDashOffset: '',
					miterLimit: '',
					width: ''
				},
				//自定义形状
				// fill:{
				//     color:'red',
				// },
				// stroke:{
				//     color:'',
				//     lineCap:'',
				//     lineJoin:'',
				//     lineDash:'',
				//     lineDashOffset:'',
				//     miterLimit:'',
				//     width:''
				// },
				points: 1,
				// radius:10,
				radius1: undefined,
				radius2: undefined,
				angle: 0,
				// snapToPixel:true,
				// rotation:0,
				// rotateWithView:false,
				atlasManager: undefined
			},

			text: {
				placement: null,
				overflow: null,
				font: '10px sans-serif',
				offsetX: 0,
				offsetY: 0,
				scale: undefined,
				text: null,
				textAlign: 'start',
				textBaseline: 'alphabetic',
				rotateWithView: false,
				fill: '',
				backgroundFill: '',
				stroke: '',
				backgroundStroke: '',
				maxAngle: undefined,
				rotation: 0,
				padding: undefined
			}
		}
	}
}
