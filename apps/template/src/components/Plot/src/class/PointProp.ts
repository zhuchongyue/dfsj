import Prop from "./Prop.ts";
import {hexToRGB} from "@dfsj/utils";
export default class PointProp extends Prop {
    constructor(props?:any | object) {
        super({
            shape: '点',
            pixelSize: 12,
            outlineColor: '#ffffff',
            outlineWidth: 2,
            ...props
        });
        this.propDefs.push(
            { name: 'pixelSize', title: '大小', type: 'number', editable: true, min: 1, max: 256, step: 1 },
            { name: 'outlineColor', title: '边框颜色', type: 'color', editable: true },
            { name: 'outlineWidth', title: '边框宽度', type: 'number', editable: true, step: 1, min: 0, max: 100 },
        )
    }
    /** 创建样式*/
    getStyle(){
        return {
            size:this.props.pixelSize,
            zIndex:this.props.zIndex,
            color: this.props.color,
            outlineWidth:this.props.outlineWidth,
            outlineColor:this.props.outlineColor,
        }
    }
}
