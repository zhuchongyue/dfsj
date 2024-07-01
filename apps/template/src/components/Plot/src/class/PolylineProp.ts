import Prop from "./Prop";

export default class PolylineProp extends Prop {
    constructor(props?:any | object) {
        super({
            type: '折线',
            width: 2,
            fill: true,
            clamp: true,
            ...props
        });
        this.propDefs.push(
            { name: 'width', title: '线宽', type: 'number', editable: true, min: 1, max: 256 },
            { name: 'fill', title: '是否填充', type: 'boolean', editable: true },
            { name: 'clamp', title: '是否贴地', type: 'boolean', editable: true },
        )
    }
    /** 创建样式*/
    getStyle(){
        return {
            zIndex:this.props.zIndex,
            color:this.props.color,
            outlineWidth:this.props.outlineWidth,
            outlineColor:this.props.outlineColor,

        }
    }
}
