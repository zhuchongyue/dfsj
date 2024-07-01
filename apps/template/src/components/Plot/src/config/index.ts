/**
 * @dfsj/cesium 提供11中可标绘图形
 * @dfsj/openlayers提供24种标绘图形
 * */
import {OverlayType} from "@dfsj/ol";
import {PlotPrimaryType} from "@/components/Plot/src/enum/typeEnmu.ts";
import {EventEnum} from "@/components/Plot/src/enum/eventEnum.ts";
export const PlotType  = OverlayType;
export const PlotTypeZH  = {
    [OverlayType.ARC]: '弧线',
    [OverlayType.FINE_ARROW]: '细箭头',
    [OverlayType.DOUBLE_ARROW]: '钳击箭头',
    [OverlayType.ASSAULT_DIRECTION]: '突击方向',
    [OverlayType.ATTACK_ARROW]: '进攻方向',
    [OverlayType.STRAIGHT_ARROW]: '直箭头',
    [OverlayType.TAILED_ATTACK_ARROW]: '进攻方向（尾）',
    [OverlayType.TAILED_SQUAD_COMBAT]: '分队战斗行动（尾）',
    [OverlayType.RECTANGLE]: '矩形',
    [OverlayType.ELLIPSE]: '椭圆',
    [OverlayType.SECTOR]: '扇形',
    [OverlayType.LUNE]: '弓形',
    [OverlayType.CURVE]: '曲线',
    [OverlayType.CLOSED_CURVE]: '曲线面',
    [OverlayType.GATHERING_PLACE]: '集结地',
    [OverlayType.FREEHAND_POLYLINE]: '自由线',
    [OverlayType.FREEHAND_POLYGON]: '自由面',
    [OverlayType.CIRCLE]: '圆形',
    [OverlayType.BILLBOARD]: '广告牌',
    [OverlayType.POLYLINE]: '折线',
    [OverlayType.POLYGON]: '多边形',
    [OverlayType.POINT]: '点',
    [OverlayType.TEXT]: '文本',
};
export interface IPlot {
    label: string,
    type?: PlotPrimaryType |  typeof PlotType | EventEnum,
    trigger?:'click' | '',
    width?:number,
    class?:string,
    children?:IPlot[]
}
export const PlotToolBoxConfig:IPlot[] = [
    {
        label: '文本',
        type: PlotPrimaryType.TEXT,
        trigger:'click',
        width:300
    },
    {
        label: '符号',
        type: PlotPrimaryType.BILLBOARD,
        trigger:'click',
        width:370
    },
    {
        label: '图案',
        type: PlotPrimaryType.GRAPHICS,
        children: [
            //点标
            {
                label: '点标',
                children: [
                    {
                        label: '点（符号）',
                        type: PlotType.POINT,
                    },
                ],
            },
            //线标
            {
                label: '线标',
                children: [
                    {
                        label: '弧线',
                        type: PlotType.ARC,
                    },
                    {
                        label: '曲线',
                        type: PlotType.CURVE,
                    },
                    {
                        label: '折线',
                        type: PlotType.POLYLINE,
                    },
                    {
                        label: '自由线',
                        type: PlotType.FREEHAND_POLYLINE,
                    }
                ],
            },
            //面
            {
                label: '面标',
                children: [
                    {
                        label: '圆',
                        type: PlotType.CIRCLE,
                    },
                    {
                        label: '椭圆',
                        type: PlotType.ELLIPSE,
                    },
                    {
                        label: '弓形',
                        type: PlotType.LUNE,
                    },
                    {
                        label: '扇形',
                        type: PlotType.SECTOR,
                    },
                    {
                        label: '曲线面',
                        type: PlotType.CLOSED_CURVE,
                    },
                    {
                        label: '多边形',
                        type: PlotType.POLYGON,
                    },
                    {
                        label: '矩形',
                        type: PlotType.RECTANGLE,
                    },
                    {
                        label: '自由面',
                        type: PlotType.FREEHAND_POLYGON,
                    },
                    {
                        label: '聚集地',
                        type: PlotType.GATHERING_PLACE,
                    }
                ],
            },
        ],
        trigger:'click',
    },
    {
        label: '箭头',
        type: PlotPrimaryType.ARROW,
        trigger:'click',
        children: [
            {
                label: '细箭头',
                type: PlotType.FINE_ARROW,
            },
            {
                label: '钳击箭头',
                type: PlotType.DOUBLE_ARROW,
            },
            {
                label: '进攻方向',
                type: PlotType.ATTACK_ARROW,
            },
            {
                label: '直箭头',
                type: PlotType.STRAIGHT_ARROW,
            }, {
                label: '进攻方向（尾）',
                type: PlotType.TAILED_ATTACK_ARROW,
            }, {
                label: '分队战斗行动（尾）',
                type: PlotType.TAILED_SQUAD_COMBAT,
            }, {
                label: '突击方向',
                type: PlotType.ASSAULT_DIRECTION,
            }
        ]
    },
];

export const PlotEventConfig:Pick<IPlot,'label'| 'type'|'class'>[] = [
    {
        label: '清除',
        type: EventEnum.CLEAN,
        class:'clean',
    },
    {
        label: '保存',
        type: EventEnum.SAVE,
        class: 'save',
    },
]