// @ts-ignore
import {isFunction, isNumber} from '../utils/common'
import {Circle, Fill, Icon, RegularShape, Stroke, Text} from 'ol/style'
import getter from '../utils/getter'

export default class StyleFactory {
	/**
	 * 获取规则样式图形
	 * @param options
	 * @returns {*}
	 * @private
	 */
	static getRegularShape(options, attributes) {
		try {
			let regularShape = new RegularShape({
				fill: StyleFactory.getFill(options['fill'], attributes),
				points: getter(options['points'], attributes, 1),
				radius: getter(options['radius'], attributes, 10),
				radius1: getter(options['radius1'], attributes, undefined),
				radius2: getter(options['radius2'], attributes, undefined),
				angle: getter(options['angle'], attributes, 0),
				// snapToPixel:getter(options['snapToPixel'], attributes, true),
				stroke: this.getStroke(options['stroke'], attributes),
				rotation: getter(options['rotation'], attributes, 0),
				rotateWithView: getter(options['rotateWithView'], attributes, false)
				// atlasManager:getter(options['atlasManager'], attributes, undefined),
			})
			return regularShape
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
		}
	}

	/**
	 * 获取圆形
	 * @param options
	 * @returns {*}
	 * @private
	 */
	static getCircle(options, attributes) {
		try {
			let circle = new Circle({
				fill: this.getFill(options['fill'], attributes),
				radius: getter(options['radius'], attributes, 10),
				stroke: this.getStroke(options['stroke'], attributes)
			})
			return circle
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
		}
	}

	/**
	 * 获取图标样式
	 * @param options
	 * @param attributes 该条数据的业务字段
	 * @returns {*}
	 * @private
	 */
	static getImage(options, attributes) {
		try {
			let image
			options = options || {}
			if (options['type'] === 'icon') {
				image = this.getIcon(options, attributes)
			} else if (options['type'] === 'circle') {
				image = this.getCircle(options, attributes)
			} else {
				image = this.getRegularShape(options, attributes)
			}
			return image
		} catch (e) {
			console.log(e)
		}
	}

	/**
	 * 获取icon
	 * @param options
	 * @param attributes 该条数据的业务字段
	 * @returns {Icon}
	 * @private
	 */
	static getIcon(options, attributes) {
		try {
			options = options || {}
			// @ts-ignore
			let icon = new Icon({
				anchor: getter(options['anchor'], attributes, [0.5, 0.5]),
				anchorXUnits: getter(options['anchorXUnits'], attributes, 'fraction'),
				anchorYUnits: getter(options['anchorYUnits'], attributes, 'fraction'),
				anchorOrigin: getter(options['anchorOrigin'], attributes, 'top-left'),
				color: getter(options['color'], attributes, 'transparent'),
				crossOrigin: getter(options['crossOrigin'], attributes, undefined),
				// img: options['img'] ? options['img'] : undefined,
				offset: getter(options['offset'], attributes, [0, 0]),
				offsetOrigin: getter(options['offsetOrigin'], attributes, 'top-left'),
				scale: getter(options['scale'], attributes, 1),
				// snapToPixel: getter(options['snapToPixel'], attributes, undefined),
				rotateWithView: getter(options['rotateWithView'], attributes, false),
				opacity: getter(options['opacity'], attributes, 1),
				rotation: getter(options['rotation'], attributes, 0),
				size: getter(options['size'], attributes, undefined),
				imgSize: getter(options['imgSize'], attributes, undefined),
				src: getter(options['src'], attributes, undefined),
				declutterMode: 'declutter'
			})
			return icon
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * 获取线条样式
	 * @param options
	 * @param attributes 该条数据的业务字段
	 * @returns {Stroke}
	 * @private
	 */
	static getStroke(options, attributes?: any) {
		try {
			options = options || {}
			let stroke = new Stroke({
				color: options['color'] ? getter(options['color'], attributes, '#fff') : undefined,
				//@ts-ignore
				lineCap: getter(options['lineCap'], attributes, 'round'),
				//@ts-ignore
				lineJoin: getter(options['lineJoin'], attributes, 'round'),
				lineDash: getter(options['lineDash'], attributes),
				//@ts-ignore
				lineDashOffset: getter(options['lineDashOffset'], attributes, 0),
				miterLimit: getter(options['miterLimit'], attributes, 10),
				width: getter(options['width'], attributes, 0)
			})
			return stroke
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * 获取样式文本
	 * @param options
	 * @param attributes 该条数据的业务字段
	 * @returns {Text}
	 * @private
	 */
	static getText(options, attributes) {
		try {
			let text = new Text({
				placement: getter(options['placement'], attributes, null),
				overflow: getter(options['overflow'], attributes, null),
				font: getter(options['font'], attributes, '10px sans-serif'),
				offsetX: getter(options['offsetX'], attributes, 0),
				offsetY: getter(options['offsetY'], attributes, 0),
				scale: getter(options['scale'], attributes, undefined),
				text: getter(options['text'], attributes, null),
				textAlign: getter(options['textAlign'], attributes, 'center'),
				textBaseline: getter(options['textBaseline'], attributes, 'alphabetic'),
				rotateWithView: getter(options['rotateWithView'], attributes, false),
				fill: this.getFill(options['fill'], attributes),
				backgroundFill: this.getFill(options['backgroundFill'], attributes),
				stroke: this.getStroke(options['stroke'], attributes),
				backgroundStroke:
					options['backgroundStroke'] &&
					this.getStroke(options['textBackgroundStroke'], attributes),
				maxAngle: getter(options['maxAngle'], attributes, undefined),
				rotation: getter(options['rotation'], attributes, 0),
				padding: getter(options['padding'], attributes, undefined)
			})
			return text
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * 获取填充颜色
	 * @param options
	 * @param attributes 该条数据的业务字段
	 * @returns {ol.style.Fill}
	 * @private
	 */
	static getFill(options, attributes?: any) {
		try {
			options = options || {}
			let fill = new Fill({
				color: getter(options['color'], attributes, 'transparent')
			})
			return fill
		} catch (error) {
			console.log(error)
		}
	}
}
