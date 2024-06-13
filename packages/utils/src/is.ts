const toString = Object.prototype.toString;
import isArguments from 'lodash-es/isArguments';
import isArrayBuffer from 'lodash-es/isArrayBuffer';
import isArrayLike from 'lodash-es/isArrayLike';
import isArrayLikeObject from 'lodash-es/isArrayLikeObject';
import isBuffer from 'lodash-es/isBuffer';
import isBoolean from 'lodash-es/isBoolean';
import isDate from 'lodash-es/isDate';
import isElement from 'lodash-es/isElement';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import isEqualWith from 'lodash-es/isEqualWith';
import isError from 'lodash-es/isError';
import isFunction from 'lodash-es/isFunction';
import isFinite from 'lodash-es/isFinite';
import isLength from 'lodash-es/isLength';
import isMap from 'lodash-es/isMap';
import isMatch from 'lodash-es/isMatch';
import isMatchWith from 'lodash-es/isMatchWith';
import isNative from 'lodash-es/isNative';
import isNil from 'lodash-es/isNil';
import isNumber from 'lodash-es/isNumber';
import isNull from 'lodash-es/isNull';
import isObjectLike from 'lodash-es/isObjectLike';
import isPlainObject from 'lodash-es/isPlainObject';
import isRegExp from 'lodash-es/isRegExp';
import isSafeInteger from 'lodash-es/isSafeInteger';
import isSet from 'lodash-es/isSet';
import isString from 'lodash-es/isString';
import isSymbol from 'lodash-es/isSymbol';
import isTypedArray from 'lodash-es/isTypedArray';
import isUndefined from 'lodash-es/isUndefined';
import isWeakMap from 'lodash-es/isWeakMap';
import isWeakSet from 'lodash-es/isWeakSet';
/**
 * 判断给定的目标对象是否为给的的类型
 * @param {unknown} val - 目标
 * @param {string} type - 类型
 * @returns {boolean} - 返回真假
 */
function is(val: unknown, type: string) {
	return toString.call(val) === `[object ${type}]`
}
/**
 * 不是undefined类型
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isDef<T = unknown>(val?: T): val is T {
	return typeof val !== 'undefined'
}
/**
 * 是undefined类型
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isUnDef<T = unknown>(val?: T): val is T {
	return !isDef(val)
}
/**
 * 是否Object类型
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isObject(val: any): val is Record<any, any> {
	return val !== null && is(val, 'Object')
}
function isNullAndUnDef(val: unknown): val is null | undefined {
	return isUnDef(val) && isNull(val)
}
/**
 * 是否null | undefined
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isNullOrUnDef(val: unknown): val is null | undefined {
	return isUnDef(val) || isNull(val)
}
/**
 * 是否Promise类型
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isPromise<T = any>(val: any): val is Promise<T> {
	return is(val, 'Promise') && isFunction(val.then) && isFunction(val.catch)
}
/**
 * 是否JsonObjectString
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isJsonObjectString(val: string): val is string {
	if (!val || !isString(val)) {
		return false
	}
	return val.startsWith('{') && val.endsWith('}')
}
/**
 * 是否Array类型
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isArray(val: any): val is Array<any> {
	return val && Array.isArray(val)
}
/**
 * 是否Window
 * @param {unknown} val - 目标
 * @returns {boolean} - 返回真假
 */
function isWindow(val: any): val is Window {
	return typeof window !== 'undefined' && is(val, 'Window')
}
/**
 * 是否Server端
 * @returns {boolean} - 返回真假
 */
const isServer = typeof window === 'undefined'
/**
 * 是否Client端
 * @returns {boolean} - 返回真假
 */
const isClient = !isServer
/**
 * 是否有效的URL地址
 * @returns {boolean} - 返回真假
 */
function isUrl(path: string): boolean {
	const reg =
		/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
	return reg.test(path)
}
function isPascalCase(str: string): boolean {
	const regex = /^[A-Z][A-Za-z]*$/;
	return regex.test(str);
}


export {
	isArguments,
	isArrayBuffer,
	isArrayLike,
	isArrayLikeObject,
	isBuffer,
	isBoolean,
	isDate,
	isElement,
	isEmpty,
	isEqual,
	isEqualWith,
	isError,
	isFunction,
	isFinite,
	isLength,
	isMap,
	isMatch,
	isMatchWith,
	isNative,
	isNil,
	isNumber,
	isNull,
	isObjectLike,
	isPlainObject,
	isRegExp,
	isSafeInteger,
	isSet,
	isString,
	isSymbol,
	isTypedArray,
	isUndefined,
	isWeakMap,
	isWeakSet,
	is,
	isDef,
	isUnDef,
	isObject,
	isNullAndUnDef,
	isNullOrUnDef,
	isPromise,
	isJsonObjectString,
	isArray,
	isWindow,
	isServer,
	isUrl,
	isPascalCase,
}