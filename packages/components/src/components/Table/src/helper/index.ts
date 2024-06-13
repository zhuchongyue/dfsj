export const setIndex = (reserveIndex: boolean, index: number, size: number, current: number) => {
	const newIndex = index + 1
	if (reserveIndex) {
		return size * (current - 1) + newIndex
	} else {
		return newIndex
	}
}

export const DEFAULT_FILTER_COLUMN = ['expand', 'selection']