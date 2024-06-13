export interface Points {
	strong: string
	lng: number
	lat: number
	power: string
	pressure: string
	time: string
	speed: string
	wind?: any
}

export interface Forecast {
	sets: string
	points: Points[]
}

export interface Pointses {
	tfbh: string
	forecast: Forecast[]
	forecastvo?: any
	lat: number
	lng: number
	movedir: string
	movespeed: string
	power: number
	pressure: number
	radius7?: any
	radius7quad?: any
	radius10?: any
	radius10quad?: any
	radius12?: any
	radius12quad?: any
	remark?: any
	speed: number
	strong: string
	time: string
}

export interface TTyphoonResultV2 {
	tfbh: string
	ident: string
	begintime: string
	endtime: string
	cname: string
	ename: string
	iscurrent: number
	land: string
	year: number
	location?: any
	completion?: any
	polygon?: any
	citys?: any
	actualLogin?: any
	forecastLogin: string
	pointses: Pointses[]
	againLogin: string
	againForecastLogin: string
	loginDate?: any
	forecastLoginDate?: any
}
