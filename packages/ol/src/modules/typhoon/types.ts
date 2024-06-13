export type DateString = string
export type CSSColor = string

//==============================================================================================================
// Typhoon scene defines
//==============================================================================================================

/**
 * 台风配置信息，比如台风路径（经过点）颜色、大小，台风提示信息等。
 */
export type TyphoonOptions = {
	delay?: number // 台风渲染延迟时间（毫秒，默认为10）
	projection?: string // 台风坐标数据的投影（一般为EPSG:4326）
	forecastColors?: {
		[key: string]: CSSColor // 预报机构区分颜色
	}
	powerColors?: {
		[key: number]: CSSColor // 级别颜色映射
	}
	path?: any
	center?: any
	start: any
	radius7: any
	radius10: any
	radius12: any
	point: any
	land: any
	effect: any
}
export type TyphoonForecast = {
	organization: string // "预报机构|String(中国)",
	locations: TyphoonLocation[]
}
export type TyphoonLocation = {
	coordinates: [lon: number, lat: number]
	time: DateString
	pressure: string // "中心气压（百帕）|Number(985)|985百帕",
	wind: string // "风速（米/s）|Number(25)|25米/s",
	power: number // "台风级别|Number(10)|10级超强台风",
	move: number // "移动速度（公里/小时）|Number(22)|22公里/每小时",
	trend: number // "移动方向|String(西北西)",
	strong: string // "台风强度|String(强热带风暴)",
	radius7?: number[] // "7级半径（km）[东北, 东南, 西北, 西南]|Array([200,300,400,500])",
	radius10?: number[] // "10级半径",
	radius12?: number[] // "12级半径",
	forecast?: Array<TyphoonForecast>
	effect: string | Object // 台风影响范围 wkt或者geojson，可后期添加到路径中
}
export type TyphoonData = {
	code: string // 台风代号,eg:201901
	center: [lon: number, lat: number]
	chinese: string // 中文名称
	english: string // 英文名称
	alive: boolean // 是否存活
	start: DateString // 开始时间
	end: DateString // 结束时间
	locations: TyphoonLocation[] // 台风路径
	land:
		| [
				{
					coordinates: [lon: number, lat: number]
					time: string // "登录时间|String",
					address: string // "登录地址|String",
					strong: string // "台风强度|String",
					message: string // "登录提示信息|String"
				}
		  ]
		| null
		| []
}

export namespace Scene {
	/**     * 地图情景超类，提供一些通用方法。 */
	export interface Basic {
		/**
		 * 静默情景，暂停所有动画特效。
		 * @param value
		 */
		silents(value: boolean)

		/**
		 * 隐藏此情景的所有图形与动画。
		 * @param value
		 */
		visible(value: boolean)

		/**
		 * 释放情景资源（不再使用时）。
		 */
		dispose()
	}

	export interface TyphoonScene extends Basic {
		/**
		 * 根据数据与选项将台风添加到地图中。
		 * @param data 台风路径数据
		 * @param options 台风路径配置信息，如果不提供，则使用默认！
		 */
		update(data: TyphoonData, options?: TyphoonOptions): Promise<TyphoonScene>

		/**
		 * 使台风中心跳转到指定的index（data.locations[index]），并显示该节点的预报路径。
		 * @param index locations中的某个节点索引
		 */
		active(index: number): Promise<TyphoonScene>

		/**
		 * 添加受影响范围到当前节点（台风中心）
		 * @param data wkt或者geojson数据
		 */
		effect(data: string | object): Promise<TyphoonScene>
	}

	/**
	 * 台风平台接口，用于创建台风路径（和警戒线）。
	 */
	export interface TyphoonPlatform extends Basic {
		/**
		 * 初始化台风平台，因为台风要显示两条警戒线，所以需要此方法进行添加
		 * @param options 警戒线数据和样式，如果不提供，则使用默认
		 */
		initialize(options?): Promise<TyphoonPlatform>

		/**
		 * 创建一个新的台风管理对象，使用该对象的相关方法进行显示、删除台风路径。
		 */
		newScene(): TyphoonScene

		/**
		 * 释放台风所使用的所有资源，包括警戒线及显示的所有台风路径。
		 */
		dispose(): void
	}
}
