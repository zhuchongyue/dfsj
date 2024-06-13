const MeasureType = {
	ANGLE: 'angle',
	AREA: 'area',
	DISTANCE: 'distance'
}

/**
 * 定义绘图的计算规格，即绘图中或者结束后需要提供的规格。
 */
export const enum MeasureSpecs {
	NONE = 0, // 不需要规格0
	RADIUS = 1, // 计算半径1
	LENGTH = 2, // 计算长度10
	AREA = 4, // 计算面积11
	SPLIT = 8, // 分段计算长度（多用于polyline）100
	VOLUME = 32, // 计算体积
	ALL = -1 // 计算所有规格
}

/**
 * 一种通用的带计算规格的图形绘制配置信息。
 */
export interface SpecsDrawConfig {
	measurement?: MeasureSpecs // 要计算的规格
	buffer?: number // 缓冲区大小（米单位）
	onStop?: Function
}

export default MeasureType
