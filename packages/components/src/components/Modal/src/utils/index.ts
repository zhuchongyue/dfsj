import {unref} from 'vue'

/**
 * 判断value是否为null。
 * 如果为null，则返回null；
 * 如果非null，且带有单位，则直接返回，否则加上px单位。
 * @param value
 */
function ensure(value: string | number): string {
	return value == null ? null : isNaN(value as number) ? (value as string) : `${value}px`
}

/**
 * 判断value是否为半分比值（以vh、vw或者%结尾）。
 * @param value 要测试的值
 */
function isp(value: string | number): boolean {
	return typeof value === 'string' && !!value.match(/^.+(%|vh|vw)$/)
}

/**
 * 根据参数计算最终的定位信息（包括位置和尺寸）。
 * @param offset
 * @param sizes
 * @param locator
 * @param offsetable
 * @param sizeable
 */
function doLocator(offset, sizes, locator, offsetable, sizeable) {
	const siz =
		sizes &&
		sizes.map(function (v) {
			return v == null || isNaN(v) ? v : `${v}px`
		})
	let top = offsetable && ensure(locator.top != null ? locator.top : offset && offset.top)
	let lft = offsetable && ensure(locator.left != null ? locator.left : offset && offset.left)
	const rgt = offsetable && ensure(offset && offset.right)
	const bom = offsetable && ensure(offset && offset.bottom)
	const wid = siz && siz[0]
	const hei = siz && siz[1]
	let transformX, transformY, transform
	if (!top && !bom && offsetable) {
		top = siz && siz[1] != null ? `calc(50% - ${siz[1]}/2)` : '50%'
		transformY = siz && siz[1] != null ? undefined : 'translateY(-50%)'
	}

	if (!lft && !rgt && offsetable) {
		lft = siz && siz[0] != null ? `calc(50% - ${siz[0]}/2)` : '50%'
		transformX = siz && siz[0] != null ? undefined : 'translateX(-50%)'
	}

	if (transformX || transformY) {
		transform = `${transformX || ''} ${transformY || ''}`
	}

	return {
		top,
		left: lft,
		right: rgt,
		bottom: bom,
		width: sizeable && wid,
		height: sizeable && hei,
		transform
	}
}

export function toMainStyle(props, locator, maximum):any {
	if (props.modally) {
		return { position: props.position, zIndex: props.zIndex }
	}

	const extent = doLocator(props.offset, props.sizes, locator, !unref(maximum), false)

	if (props.modally === false) {
		if (props.sizes && isp(props.sizes[0])) {
			extent.width = props.sizes[0]
		}

		if (props.sizes && isp(props.sizes[1])) {
			extent.height = props.sizes[1]
		}
	}

	return {
		position: props.position,
		overflow: props.overflow,
		zIndex: props.zIndex,
		...extent
	}
}

export function toBodyStyle(props, locator, maximum): any {
	const position = props.modally ? 'absolute' : null
	const extent = doLocator(
		props.offset,
		props.sizes,
		locator,
		props.modally && !unref(maximum),
		true
	)

	if (props.modally === false) {
		if (props.sizes && isp(props.sizes[0])) {
			extent.width = '100%'
		}

		if (props.sizes && isp(props.sizes[1])) {
			extent.height = '100%'
		}
	}

	return { position, overflow: props.overflow, ...extent }
}

export function clamp(value, min, max) {
	return value < min ? min : value > max ? max : value
}
