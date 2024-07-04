/**
 * @desc 工具类
 */
/**
 * merge
 * @param target
 * @returns {*}
 */
function merge(...target: any) {
	for (let i = 1, j = arguments.length; i < j; i++) {
		let source = arguments[i] || {}
		for (let prop in source) {
			if (source.hasOwnProperty(prop)) {
				let value = source[prop]
				if (value !== undefined) {
					target[prop] = value
				}
			}
		}
	}
	return target
}

function toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i]
		}
		return arr2
	} else {
		return Array.from(arr)
	}
}
export {
	merge,
	toConsumableArray,
}
