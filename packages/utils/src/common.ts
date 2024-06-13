import {isObject,isArray} from './is'
import {Fn, TargetContext} from '../typings'
import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es';
/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
	let parameters = ''
	for (const key in obj) {
		parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
	}
	parameters = parameters.replace(/&$/, '')
	return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}
/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<
	T extends object | null | undefined,
	U extends object | null | undefined,
>(
	source: T,
	target: U,
	mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace'
): T & U {
	if (!target) {
		return source as T & U;
	}
	if (!source) {
		return target as T & U;
	}
	return mergeWith({}, source, target, (sourceValue, targetValue) => {
		if (isArray(targetValue) && isArray(sourceValue)) {
			switch (mergeArrays) {
				case 'union':
					return unionWith(sourceValue, targetValue, isEqual);
				case 'intersection':
					return intersectionWith(sourceValue, targetValue, isEqual);
				case 'concat':
					return sourceValue.concat(targetValue);
				case 'replace':
					return targetValue;
				default:
					throw new Error(
						`Unknown merge array strategy: ${mergeArrays as string}`
					);
			}
		}
		if (isObject(targetValue) && isObject(sourceValue)) {
			return deepMerge(sourceValue, targetValue, mergeArrays);
		}
		return undefined;
	});
}

export function openWindow(
	url: string,
	opt?: {
		target?: TargetContext | string
		noopener?: boolean
		noreferrer?: boolean
	}
) {
	const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
	const feature: string[] = []
	noopener && feature.push('noopener=yes')
	noreferrer && feature.push('noreferrer=yes')
	window.open(url, target, feature.join(','))
}


/**
 * 获取URL上参数
 * @param url
 */
export function getObjFormUrlParams(url) {
	if (!url) return;
	let t,
		n,
		r,
		i = url.split('?')[1],
		s = {};
	(t = i.split('&')), (r = null), (n = null);
	for (let o in t) {
		let u = t[o].indexOf('=');
		u !== -1 && ((r = t[o].substr(0, u)), (n = t[o].substr(u + 1)), (s[r] = n));
	}
	return s;
}

/**
 * 获取url地址参数
 * @param paraName
 */
export function getUrlParam(paraName) {
	let url = document.location.toString()
	let arrObj = url.split('?')
	if (arrObj.length > 1) {
		let arrPara = arrObj[1].split('&')
		let arr

		for (let i = 0; i < arrPara.length; i++) {
			arr = arrPara[i].split('=')

			if (arr != null && arr[0] == paraName) {
				return arr[1]
			}
		}
		return ''
	} else {
		return ''
	}
}
