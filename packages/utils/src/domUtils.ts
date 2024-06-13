import {Fn, FunctionArgs} from '../typings'

function upperFirst(str) {
	if (typeof str !== 'string') {
		return '';
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
}
export interface ViewportOffsetResult {
	left: number
	top: number
	right: number
	bottom: number
	rightIncludeBody: number
	bottomIncludeBody: number
}
/**
 * 获取边距距离
 * @param element
 */
export function getBoundingClientRect(element: Element): DOMRect | number {
	if (!element || !element.getBoundingClientRect) {
		return 0
	}
	return element.getBoundingClientRect()
}

/**
 * 去掉空格  幽灵字符
 * @param string
 */
function trim(string: string) {
	return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/**
 * 判断包含类
 * @param el
 * @param cls
 */
export function hasClass(el: Element, cls: string) {
	if (!el || !cls) return false
	if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
	if (el.classList) {
		return el.classList.contains(cls)
	} else {
		return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
	}
}

/**
 * 添加类
 * @param el
 * @param cls
 */
export function addClass(el: Element, cls: string) {
	if (!el) return
	let curClass = el.className
	const classes = (cls || '').split(' ')

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i]
		if (!clsName) continue

		if (el.classList) {
			el.classList.add(clsName)
		} else if (!hasClass(el, clsName)) {
			curClass += ' ' + clsName
		}
	}
	if (!el.classList) {
		el.className = curClass
	}
}

/**
 * 删除类
 * @param el
 * @param cls
 */
export function removeClass(el: Element, cls: string) {
	if (!el || !cls) return
	const classes = cls.split(' ')
	let curClass = ' ' + el.className + ' '

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i]
		if (!clsName) continue

		if (el.classList) {
			el.classList.remove(clsName)
		} else if (hasClass(el, clsName)) {
			curClass = curClass.replace(' ' + clsName + ' ', ' ')
		}
	}
	if (!el.classList) {
		el.className = trim(curClass)
	}
}

/**
 * Get the left and top offset of the current element
 * left: the distance between the leftmost element and the left side of the document
 * top: the distance from the top of the element to the top of the document
 * right: the distance from the far right of the element to the right of the document
 * bottom: the distance from the bottom of the element to the bottom of the document
 * rightIncludeBody: the distance between the leftmost element and the right side of the document
 * bottomIncludeBody: the distance from the bottom of the element to the bottom of the document
 *
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
	const doc = document.documentElement

	const docScrollLeft = doc.scrollLeft
	const docScrollTop = doc.scrollTop
	const docClientLeft = doc.clientLeft
	const docClientTop = doc.clientTop

	const pageXOffset = window.pageXOffset
	const pageYOffset = window.pageYOffset

	const box = getBoundingClientRect(element)

	const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect

	const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
	const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
	const offsetLeft = retLeft + pageXOffset
	const offsetTop = rectTop + pageYOffset

	const left = offsetLeft - scrollLeft
	const top = offsetTop - scrollTop

	const clientWidth = window.document.documentElement.clientWidth
	const clientHeight = window.document.documentElement.clientHeight
	return {
		left: left,
		top: top,
		right: clientWidth - rectWidth - left,
		bottom: clientHeight - rectHeight - top,
		rightIncludeBody: clientWidth - left,
		bottomIncludeBody: clientHeight - top
	}
}

export function hackCss(attr: string, value: string) {
	const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT']

	const styleObj: any = {}
	prefix.forEach((item) => {
		styleObj[`${item}${upperFirst(attr)}`] = value
	})
	return {
		...styleObj,
		[attr]: value
	}
}

/* istanbul ignore next */
export function on(
	element: Element | HTMLElement | Document | Window,
	event: string,
	handler: EventListenerOrEventListenerObject
): void {
	if (element && event && handler) {
		element.addEventListener(event, handler, false)
	}
}

/* istanbul ignore next */

export function off(
	element: Element | HTMLElement | Document | Window,
	event: string,
	handler: Fn
): void {
	if (element && event && handler) {
		element.removeEventListener(event, handler, false)
	}
}

/* istanbul ignore next */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
	const listener = function (this: any, ...args: unknown[]) {
		if (fn) {
			fn.apply(this, args)
		}
		off(el, event, listener)
	}
	on(el, event, listener)
}

export function useRafThrottle<T extends FunctionArgs>(fn: T): T {
	let locked = false
	// @ts-ignore
	return function (...args: any[]) {
		if (locked) return
		locked = true
		window.requestAnimationFrame(() => {
			// @ts-ignore
			fn.apply(this, args)
			locked = false
		})
	}
}
export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
	dom.style.setProperty(prop, val)
}

export const getCssVar = (prop: string, dom = document.documentElement) => {
	return getComputedStyle(dom).getPropertyValue(prop)
}