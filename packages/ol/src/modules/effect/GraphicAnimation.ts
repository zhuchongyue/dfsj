import {Animate, Graphic} from './Animation'

/**
 * 图形动画接口。
 */
export default interface GraphicAnimation {
	/**
	 * 渲染动画。
	 * @param graphic 图形对象
	 * @param options 动画配置
	 * @param state 额外的参数（ol需要，其他平台未必）
	 */
	render(graphic: Graphic, options: Animate, state?: any)
}
