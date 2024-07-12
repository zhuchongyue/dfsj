import {FormItemRule} from "element-plus";

const floodTypeOptions = [
    {
        value: 1,
        label: '闸门控制',
    },
    {
        value: 2,
        label: '自由溢流',
    },
    {
        value: 9,
        label: '其他',
    },
]
const YesOrNoOptions = [
    {
        label: '是',
        value: 1,
    },
    {
        label: '否',
        value: null,
    },
]
const HaveOrNotOptions = [
    {
        label: '有',
        value: 1,
    },
    {
        label: '无',
        value: 0,
    },
]
const defaultData = '--'
const valueOfOptions = (value:any,options:Array<any>,config?)=>{
    let copy = value;
    if (!copy || copy?.length == 0) return defaultData;
    if(!Array.isArray(copy)){
        copy = [copy];
    }
    let str = '';
    copy.forEach((item:any,i)=>{
        const target = options.find(e=>e.value === item) ?? {};
        if (target?.label){
            if (i < copy.length-1) str += `${target.label}、`;
            else str += `${target.label}`
        }
    })
    if (!str) str = value;
    return config?.append ? `${str} ${config?.append}` :  str
}

const required = (message?: string): FormItemRule => {
    return {
        required: true,
        message: message || '必填项!'
    }
}

export {
    required,
    valueOfOptions,
    defaultData,
    HaveOrNotOptions,
    YesOrNoOptions,
    floodTypeOptions
}
