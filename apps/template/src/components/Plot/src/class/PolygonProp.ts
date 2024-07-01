import Prop from "./Prop";
import {hexToRGB} from "@dfsj/utils";

export default class PolygonProp extends Prop {
    constructor(props?:any | object) {
        super({
            rotation: 0,
            material: '',
            fill: true,
            outline: true,
            outlineColor: 'rgba(255,0,0,0.62)',
            outlineWidth: 2,
            clamp: true,
            ...props
        });
        this.propDefs.push(
            // { name: 'rotation', title: '旋转', type: 'number', editable: true, min: -360, max: 360, step: 1 },
            // { name: 'material', title: '贴图', type: 'string', editable: false },
            { name: 'fill', title: '填充', type: 'boolean', editable: true },
            { name: 'outline', title: '边框', type: 'boolean', editable: true },
            { name: 'outlineColor', title: '边框颜色', type: 'color', editable: true },
            { name: 'outlineWidth', title: '边框宽度', type: 'number', editable: true, step: 1, min: 1, max: 100 },
        )
    }
    /** 创建样式*/
    getStyle(){
        return {
            zIndex:this.props.zIndex,
            color: hexToRGB(this.props.color ,this.props.alpha),
            outlineWidth:this.props.outlineWidth,
            outlineColor:this.props.outlineColor,
            // outlineLineCap:this.props.zIndex,
            // outlineDash:this.props.zIndex

        }
    }
}
