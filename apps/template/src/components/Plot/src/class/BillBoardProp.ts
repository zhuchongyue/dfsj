import Prop from "./Prop.ts";

export default class BillBoardProp extends Prop {
    constructor(props?:any | object) {
        super({
            type: 'BillBoard',
            shape: 'BillBoard',
            image: '/src/assets/plot-png/CHAR_HONG.png',
            color: '#ff0',
            rotation: 0,
            alpha: 0.8,
            width: 30,
            height: 30,
            label:'',
            scale: 1,
            ...props
        });
        this.propDefs.push(
            {name: 'label', title: '描述', type: 'string', editable: true},
            { name: 'rotation', title: '旋转', type: 'number', editable: true, step: 1, max: 360, min: -360 },
            { name: 'scale', title: '缩放', type: 'number', editable: true, min: 0.5, step: 0.1, max: 100 },
            { name: 'width', title: '宽度', type: 'number', editable: true, step: 1, min: 0 , max: 10000},
            { name: 'height', title: '高度', type: 'number', editable: true, step: 1, min: 0, max: 10000 },
            { name: 'image', title: '图片', type: 'string', editable: false },
        )
    }
    /** 创建样式*/
    getStyle(){
        return {
            scale:this.props.scale,
            rotation:this.props.rotation,
            image: this.props.image,
            label:{
                text:this.props.label,
                offset:[0,30]
            }
        }
    }
}
