/**
 * 定义图形对象（由于各平台的图形对象不同，因此定义为any）
 */
export type Graphic = any
/**
 * 定义图形的动画配置
 */
// export namespace Animation {
export type Types = 'scale' | 'rotation' | 'twinkle' | 'ripple' | 'flow'

export interface Animate {
	type: Types // 动画类型，必须提供
	duration?: number // 动画持续时间（毫秒）
}

/**
 * 定义缩放动画配置（缩放动画为目标在两个缩放值直接循环切换，即一大一小，或者叫做闪烁）。
 *
 * ##注：此动画仅适用于点类图形。
 */
export interface Scale extends Animate {
	type: 'scale'
	scales: [min: number, max: number]
}

/**
 * 定义旋转动画配置（图形按某个方向持续旋转）。
 *
 * ##注：此动画仅适用于点类图形。
 */
export interface Rotation extends Animate {
	type: 'rotation'
	text?: boolean
	direction: -1 | 1
}

/**
 * 定义闪烁动画（图形的颜色从透明到不透明之间持续变化）
 *
 * ##注：此动画不适用billboard。
 */
export interface Twinkle extends Animate {
	type: 'twinkle'
	color?: string // 闪烁颜色
	geometry?: 'border' | 'content' // 闪烁部位（border仅闪烁边框，content仅闪烁内区域，不设置则都闪烁）
}

/**
 * 定义水波扩散动画
 *
 * ##注：此动画仅适用点类图形
 */
export interface Ripple extends Animate {
	type: 'ripple'
	width?: number // 波浪线宽度
	color?: string // 波浪线颜色
	count?: number // 波浪线数量
	radius?: [min: number, max: number] // 波浪半径（最小和最大）
}

/**
 * 定义线流动动画
 *
 * ##注：此动画仅适用线图形（{@link polyline}）
 */
export interface Flow extends Animate {
	render: 'dosh' | 'gradient' // 当render为dosh时，必须为polyline设置外边框
	colors: any[] // 仅适用于gradient
	speed?: number // 线条流动速度，推荐速度0.5
	direction: -1 | 1 // 线条流动方向
}

// }
