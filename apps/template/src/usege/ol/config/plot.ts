// import { OverlayType } from '@dfsj/ol'
import OverlayType from "@dfsj/ol/src/modules/overlay/OverlayType.ts"

console.log('OverlayType',OverlayType)

const PlotType = [
	{
		label: '点',
		value: OverlayType.POINT
	},
	{
		label: '文字',
		value: OverlayType.TEXT
	},
	{
		label: '广告牌',
		value: OverlayType.BILLBOARD
	},
	{
		label: '折线',
		value: OverlayType.POLYLINE
	},
	{
		label: '多边形',
		value: OverlayType.POLYGON
	},
	{
		label: '弧线',
		value: OverlayType.ARC
	},
	{
		label: '细箭头',
		value: OverlayType.FINE_ARROW
	},
	{
		label: '钳击箭头',
		value: OverlayType.DOUBLE_ARROW
	},
	{
		label: '进攻方向',
		value: OverlayType.ATTACK_ARROW
	},
	{
		label: '突击方向',
		value: OverlayType.ASSAULT_DIRECTION
	},
	{
		label: '直箭头',
		value: OverlayType.STRAIGHT_ARROW
	},
	{
		label: '进攻方向（尾）',
		value: OverlayType.TAILED_ATTACK_ARROW
	},
	{
		label: '分队战斗行动（尾）',
		value: OverlayType.TAILED_SQUAD_COMBAT
	},
	{
		label: '集结地',
		value: OverlayType.GATHERING_PLACE
	},
	{
		label: '曲线',
		value: OverlayType.CURVE
	},
	{
		label: '曲线面',
		value: OverlayType.CLOSED_CURVE
	},
	{
		label: '自由线',
		value: OverlayType.FREEHAND_POLYLINE
	},
	{
		label: '自由面',
		value: OverlayType.FREEHAND_POLYGON
	},
	{
		label: '矩形',
		value: OverlayType.RECTANGLE
	},
	{
		label: '弓形',
		value: OverlayType.LUNE
	},
	{
		label: '椭圆',
		value: OverlayType.ELLIPSE
	},
	{
		label: '圆形',
		value: OverlayType.CIRCLE
	},
	{
		label: '扇形',
		value: OverlayType.SECTOR
	}
]
export default PlotType
