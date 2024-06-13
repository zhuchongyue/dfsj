/**
 * 判断一个对象是否是普通对象。普通对象是指JSON对象，而由new创建的对象则不是（class对象）。
 *
 * @param object {Object} 测试对象
 * @returns {boolean} 如果是普通对象则返回true，否则返回false。
 */
function ordinary(object) {
	if (typeof object !== 'object' || object === null) {
		return false
	}
	if (Object.getPrototypeOf(object) === null) {
		return true
	}
	let proto = object
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto)
	}
	return Object.getPrototypeOf(object) === proto
}

/**
 * 深度克隆单个对象（或者数组）
 * @param target {Object|Array}
 * @param source {Object|Array}
 * @return {Object|Array}
 */
function clone(target, source) {
	for (let key in source) {
		let older = target[key],
			newer = source[key]
		if (older === newer && newer != null) continue
		if (newer && ordinary(newer)) {
			target[key] = clone(ordinary(older) ? older : {}, newer)
		} else if (newer && Array.isArray(newer)) {
			target[key] = clone(Array.isArray(older) ? older : [], newer)
		} else {
			target[key] = newer
		}
	}
	return target
}

/**
 * 与{@link Object.assign}相同，但是本函数为深度复制。
 *
 * @param target {Object|Array} 目标对象（或者数组）.
 * @param sources {Array<Object|Array>|Object} 要合并的对象（或者数组）
 * @returns {Object|Array} 合并后的对象（或数组）.
 */
export default function assign(target: any | any[], ...sources: any): any | any[] {
	if (target == null) {
		return target
	}
	return sources.reduce((last, source) => clone(last, source), target)
}
