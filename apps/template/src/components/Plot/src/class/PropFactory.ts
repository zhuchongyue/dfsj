import PointProp from "./PointProp";
import BillBoardProp from "./BillBoardProp.ts";
import PolylineProp from "./PolylineProp.ts";
import PolygonProp from "./PolygonProp.ts";
import Prop from "./Prop";
import {PlotType, PlotTypeZH} from "@/components/Plot/src/config";

export default class PropFactory {
    static create(type: typeof PlotType, props: any = {}) {
        let instance: Prop | any = undefined;
        const shape = PlotTypeZH?.[type];
        console.log('shape',{shape,type})
        props = {...props, type: type,shape};
        switch (type) {
            case PlotType.POINT:
                instance = new PointProp(props)
                break;
            case PlotType.BILLBOARD:
                instance = new BillBoardProp(props)
                break;
            case PlotType.ARC:
            case PlotType.CURVE:
            case PlotType.POLYLINE:
            case PlotType.FREEHAND_POLYLINE:
                instance = new PolylineProp(props)
                break;
            case PlotType.CIRCLE:
            case PlotType.ELLIPSE:
            case PlotType.LUNE:
            case PlotType.SECTOR:
            case PlotType.CLOSED_CURVE:
            case PlotType.POLYGON:
            case PlotType.RECTANGLE:
            case PlotType.FREEHAND_POLYGON:
            case PlotType.GATHERING_PLACE:

            case PlotType.FINE_ARROW:
            case PlotType.DOUBLE_ARROW:
            case PlotType.ATTACK_ARROW:
            case PlotType.STRAIGHT_ARROW:
            case PlotType.TAILED_ATTACK_ARROW:
            case PlotType.TAILED_SQUAD_COMBAT:
            case PlotType.ASSAULT_DIRECTION:

                instance = new PolygonProp(props)
                break;
        }
        console.log({instance})
        return instance;
    }
}
