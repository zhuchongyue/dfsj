import {Feature} from 'ol'
import * as Color from 'ol/color'
import * as easing from 'ol/easing'
import {Circle, Stroke, Style} from 'ol/style'
import GraphicAnimation from './GraphicAnimation'
import {Animate, Flow, Graphic, Ripple, Rotation, Scale, Twinkle} from './Animation'
import {GeometryType} from '../overlay/GeometryType'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 图形动画实现，详见types定义。
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

interface Effect {
	render(context, state, feature: Feature, options: Animate)
}

const effects = {
	ripple: class RippleEffect implements Effect {
		private style: Style

		render(context, state, feature, animation: Ripple) {
			let style = this.style
			if (style == null) {
				style = this.style = new Style({
					image: new Circle({
						stroke: new Stroke({ color: null }),
						radius: 0
					})
				})
			}

			let count = animation.count || 3
			let duration = animation.duration || 3000
			let radius = animation.radius || [10, 40]
			let circle = <Circle>style.getImage()
			let stroke = circle.getStroke()

			stroke.setColor(animation.color || 'red')
			stroke.setWidth(animation.width || 2)

			for (let i = 0; i < count; i++) {
				let time = (state.time - (duration / count) * i) % duration
				if (time < 0) break
				let ratio = time / duration
				circle.setRadius(radius[0] + ratio * (radius[1] - radius[0]))
				circle.setOpacity(easing.easeOut(1 - ratio))
				context.drawFeature(feature, style)
			}
		}
	},

	rotation: class RotateEffect implements Effect {
		render(context, state, feature, animation: Rotation) {
			let style: Style = feature.getStyle()
			if (style) {
				let duration = animation.duration || 1000
				let ratio = (state.time % duration) / duration
				let dir = animation.direction ?? -1
				let image = style.getImage()
				let rotation = (ratio * 360 * dir * Math.PI) / 180
				image.setRotation(rotation)
				let text = style.getText()
				if (text && animation.text) text.setRotation(rotation)
				feature.changed()
			}
		}
	},

	scale: class ScaleEffect implements Effect {
		render(context, state, feature: Feature, animation: Scale) {
			let style: Style = <Style>feature.getStyle()
			let duration = animation.duration || 1000
			let ratio = (state.time % duration) / duration
			let image = style.getImage()
			if (image) image.setScale(animation.scales[ratio > 0.5 ? 1 : 0])
			feature.changed()
		}
	},

	twinkle: class TwinkleEffect implements Effect {
		getOpacity(color, time, duration) {
			let ratio = (time % duration) / duration
			return easing.upAndDown(ratio)
		}

		twinkleBorder(feature, style, state, animation: Twinkle) {
			let stroke = style?.getStroke()
			let color = feature.get('$animation.color.border')
			if (color == null) {
				feature.set(
					'$animation.color.border',
					(color = Color.asArray(animation.color || stroke?.getColor()))
				)
			}
			color[3] = this.getOpacity(color, state.time, animation.duration || 700)
			stroke?.setColor(color)
		}

		twinkleContent(feature, style, state, animation) {
			let fill = style?.getFill()
			let color = feature.get('$animation.color.content')
			if (color == null) {
				feature.set(
					'$animation.color.content',
					(color = Color.asArray(animation.color || fill?.getColor()))
				)
			}
			color[3] = this.getOpacity(color, state.time, animation.duration || 700)
			fill.setColor(color)
		}

		render(context, state, feature, animation) {
			console.log('feature', feature)
			let style = feature.getStyle()
			let type = feature.getGeometry().getType()
			if (type === GeometryType.LINE_STRING || GeometryType.MULTI_LINE_STRING) {
				this.twinkleBorder(feature, style, state, animation)
			} else if (type === GeometryType.POLYGON || GeometryType.MULTI_POLYGON) {
				if (animation.geometry === 'border') {
					this.twinkleBorder(feature, style, state, animation)
				} else if (animation.geometry === 'content') {
					this.twinkleContent(feature, style, state, animation)
				} else {
					this.twinkleBorder(feature, style, state, animation)
					this.twinkleContent(feature, style, state, animation)
				}
			}
			context.drawFeature(feature, style)
		}
	},
	flow: class FlowEffect implements Effect {
		render(context, state, feature: Feature, options: Flow) {
			let styleLike = feature.getStyle()
			console.log('styleLike', styleLike)
			if (options.render === 'dosh') {
				let styles: Style[] = <Style[]>styleLike
				let stroke: Stroke = styles[1].getStroke()
				let offset: number = stroke?.getLineDashOffset?.() || 0
				let speed: number = options.speed || 0.5
				let dir: number = options.direction || 1
				let length: number = feature.get('animate.flow.length')
				if (length == null) {
					length = stroke.getLineDash().reduce((p, v) => p + v, 0) * 2
					feature.set('animate.flow.length', length, true)
				}
				stroke.setLineDashOffset((offset + speed * dir) % length)
				feature.changed()
			} else if (options.render === 'gradient') {
			}
		}
	}
}

export default class GraphicAnimationImp implements GraphicAnimation {
	protected readonly cache = {}
	protected context

	public setContext(context) {
		this.context = context
	}

	public render(graphic: Graphic, options: Animate, state?: any) {
		let effect = this.cache[options.type]
		if (effect == null) {
			effect = this.cache[options.type] = new effects[options.type]()
		}
		if (effect != null) {
			effect.render(this.context, state, graphic, options)
		}
	}
}
