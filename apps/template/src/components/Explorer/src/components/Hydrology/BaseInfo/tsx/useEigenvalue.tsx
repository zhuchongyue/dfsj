import {DescriptionsSchema} from "@dfsj/components";
import {ElDatePicker, ElFormItem, ElInput} from "element-plus";
import {shallowRef} from "vue";
import {UnitEnum} from "@/enums/unitEnum.ts";
import {required, valueOfOptions} from "../../../../utils";

export const useEigenvalue = (form, disabled) => {
    const rules = reactive({
        stnm: [required()],
        stcd: [required()],
        lgtd: [required()],
        lttd: [required()],
    })
    const schema = shallowRef<DescriptionsSchema[]>([
        {
            field: 'ldkel',
            span:12,
            label: '左堤高程',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="ldkel">
                            {disabled.value ? valueOfOptions(form.ldkel ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.ldkel}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                                }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'rdkel',
            span:12,
            label: '右堤高程',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="rdkel">
                            {disabled.value ? valueOfOptions(form.rdkel ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.rdkel}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                                }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'wrz',
            span:12,
            label: '警戒水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="wrz">
                            {disabled.value ? valueOfOptions(form.wrz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.wrz}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'wrq',
            span:12,
            label: '警戒流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="wrq">
                            {disabled.value ? valueOfOptions(form.wrq ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.wrq}>
                                    {{
                                        append:()=>UnitEnum.FLOW
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'grz',
            span:12,
            label: '保证水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="grz">
                            {disabled.value ? valueOfOptions(form.grz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.grz}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'grq',
            span:12,
            label: '保证流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="grq">
                            {disabled.value ? valueOfOptions(form.grq ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.grq}>
                                    {{
                                        append:()=>UnitEnum.FLOW
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'obhtz',
            span:12,
            label: '实测最高水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="obhtz">
                            {disabled.value ? valueOfOptions(form.obhtz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.obhtz}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'obhtztm',
            span:12,
            label: '出现时间',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="obhtztm">
                            {disabled.value ? valueOfOptions(form.obhtztm ,[],) :
                                <ElDatePicker style="width: 100%"  v-model={form.obhtztm}>
                                </ElDatePicker>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'ivhz',
            span:12,
            label: '调查最高水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="ivhz">
                            {disabled.value ? valueOfOptions(form.ivhz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.ivhz}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'ivhztm',
            span:12,
            label: '出现时间',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="ivhztm">
                            {disabled.value ? valueOfOptions(form.ivhztm ,[], ):
                                <ElDatePicker  style="width: 100%"  v-model={form.ivhztm}>
                                </ElDatePicker>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'hlz',
            span:12,
            label: '历史最低水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="hlz">
                            {disabled.value ? valueOfOptions(form.hlz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.hlz}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'hlztm',
            span:12,
            label: '出现时间',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="hlztm">
                            {disabled.value ? valueOfOptions(form.hlztm ,[], ) :
                                <ElDatePicker  style="width: 100%"  v-model={form.hlztm}>
                                </ElDatePicker>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'hmnq',
            span:12,
            label: '历史最小流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="hmnq">
                            {disabled.value ? valueOfOptions(form.hmnq ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.hmnq}>
                                    {{
                                        append:()=>UnitEnum.FLOW
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'hmnqtm',
            span:12,
            label: '出现时间',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="hmnqtm">
                            {disabled.value ? valueOfOptions(form.hmnqtm ,[], ) :
                                <ElDatePicker style="width: 100%" v-model={form.hmnqtm}>
                                </ElDatePicker>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'laz',
            span:12,
            label: '旱警水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="laz">
                            {disabled.value ? valueOfOptions(form.laz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.laz}>
                                    {{
                                        append:()=>UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'laq',
            span:12,
            label: '旱警流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="laq">
                            {disabled.value ? valueOfOptions(form.laq ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.laq}>
                                    {{
                                        append:()=>UnitEnum.FLOW
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        }, 
    ])


    return {
        schema,
        rules,
    }
}