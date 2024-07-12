import {Billboard, Point, Polygon, Polyline} from "@dfsj/ol";

export class GraphicFactory {
    static GraphicMap = {
        'billboard':Billboard ,
        'polygon':Polygon ,
        'point':Point ,
        'polyline':Polyline ,
    }
    /** */
    static create(typeStr:string | null){
        if (!typeStr) throw Error('类型标识错误！')
        const lowercaseStr = typeStr.toLowerCase();
        if (!Object.keys(GraphicFactory.GraphicMap).includes(lowercaseStr))throw Error('未配置的图形类型！');
        //@ts-ignore
        return GraphicFactory.GraphicMap[lowercaseStr];
    }
}