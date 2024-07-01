/**
 * 编辑的级类
 * */
export default class Prop {
    /** 默认的配置项*/
    propDefs: Array<any> = [
        {name: 'name', title: '名称', type: 'string', editable: true},
        {name: 'shape', title: '类型', type: 'string', editable: false},
        // {name: 'description', title: '描述', type: 'string', editable: true},
        // {name: 'level', title: '层', type: 'number', editable: true, min: -10, max: 10, step: 1},
        {name: 'color', title: '颜色', type: 'color', editable: true},
        {name: 'alpha', title: '透明度', type: 'number', editable: true, step: 0.05, max: 1, min: 0},
    ]
    /** 默认的配置项（值）*/
    props:any = {
        name: '',
        description: '',
        level: 1,
        shape: 'graph',
        color: '#00ff00',
        alpha: 0.3,
        editPropType:undefined
    }
    constructor(props:any) {
        Object.assign(this.props, props)
    }
    getStyle(){

    }
}
