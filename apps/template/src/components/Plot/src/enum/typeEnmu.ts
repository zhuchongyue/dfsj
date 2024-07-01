/** 主要的大类*/
export enum PlotPrimaryType {
    TEXT='text',//文本
    BILLBOARD='billboard',//符号(图片)
    GRAPHICS='graphics',//图案(包含点、线、面)
    ARROW='arrow', //箭头 (各类箭头)
}
/** 次要的大类*/
export enum PlotSecondaryType {
    POINT='point', //点
    POLYLINE='polyline', //线
    POLYGON='polygon',//面
}