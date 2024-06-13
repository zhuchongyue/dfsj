/**
 * 根据百分比计算实际数值。
 * @param percent 百分比
 * @param max 最大值
 * @return {number} 实际数值
 */
export function parsePercent(percent: string, max: number): number {
	switch (percent) {
		case 'center':
		case 'middle':
			percent = '50%'
			break

		case 'left':
		case 'top':
			percent = '0%'
			break

		case 'right':
		case 'bottom':
			percent = '100%'
			break
	}

	if (typeof percent === 'string') {
		if (percent.replace(/^\s+|\s+$/g, '').match(/%$/)) {
			return (parseFloat(percent) / 100) * max
		}

		return parseFloat(percent)
	}

	return percent == null ? NaN : +percent
}
