/**
 * 实时数据左右结构的描述
 */
import {UnitEnum} from "@/enums/unitEnum.ts";
import {FormSchema} from "@dfsj/components";
import pick from "lodash-es/pick";

export interface AttacheFiled {
    label: string,
    field: string,
    unit: UnitEnum,
    span?: number
}

const rsvrFields = [
    {
        label: '汛限水位',
        field: 'flxz',
        unit: UnitEnum.LENGTH
    },
    {
        label: '设计洪水位',
        field: 'dsflz',
        unit: UnitEnum.LENGTH
    },
    {
        label: '校核洪水位',
        field: 'ckflz',
        unit: UnitEnum.LENGTH
    },
    {
        label: '防洪高水位',
        field: 'flgz',
        unit: UnitEnum.LENGTH
    }, {
        label: '坝顶高程',
        field: 'damel',
        unit: UnitEnum.LENGTH
    }, {
        label: '死水位',
        field: 'ddz',
        unit: UnitEnum.LENGTH
    }
]
const riverFields = [
    {
        label: '警戒水位',
        field: 'wrz',
        unit: UnitEnum.LENGTH
    },
    {
        label: '警戒流量',
        field: 'wrq',
        unit: UnitEnum.FLOW
    },
    {
        label: '保证水位',
        field: 'grz',
        unit: UnitEnum.LENGTH
    },
    {
        label: '保证流量',
        field: 'grq',
        unit: UnitEnum.FLOW
    }
]


function getFormPickModel(fields: Array<AttacheFiled>, target: Object) {
    const props = fields.map((e) => e.field);
    return pick(target, props);
}

function getFormSchema(fields: Array<AttacheFiled>): Array<FormSchema> {
    if (!Array.isArray(fields) || !fields.length) return [];
    return fields.map(item => {
        //@ts-ignore
        return {
            field: item.field,
            label: item.label,
            slots: {
                append: (value, data) => item.unit && value ? `（${item.unit}）` : null
            }
        };
    })
}

export {
    rsvrFields,
    riverFields,
    getFormSchema,
    getFormPickModel
}