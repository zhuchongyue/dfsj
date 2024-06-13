export type PropertyGetter<T extends any = any> = (properties: any) => T
/**
 * 一个获取属性值的函数，某些配置信息可能是属性值，也有可能是获取属性值的函数，为方便获取，特使用此函数。
 *
 * @param property 属性值或者函数
 * @param target 如果property为函数，调用函数时传入此参数
 * @param def
 * @param args 其他参数（仅property为函数时使用）
 * @return 属性值
 */
export default function getter<T extends any>(
	property: any | PropertyGetter,
	target?: any,
	def: any = undefined,
	...args
): T {
	if (property == undefined) return def
	return property instanceof Function ? property(target, ...args) : property
}

/**
 * 从目标数据（target）中获取由property指定的属性值。
 * 如果property为一个函数，则调用此函数并传入target，否则使用`target[property]`得到属性值！
 * >>
 * {@link valueOf}与{@link getter}的区别为：当property不是函数时，
 * {@link getter}直接返回property，而{@link valueOf}则返回target的property值。
 *
 * @param property 属性名称
 * @param target 提供属性的对象
 * @param args 其他额外参数（仅property为函数时使用）
 * @return target的property值
 */
export function valueOf<T extends any>(property: any | PropertyGetter, target: any, ...args): T {
	return property instanceof Function ? property(target, ...args) : target?.[property]
}
