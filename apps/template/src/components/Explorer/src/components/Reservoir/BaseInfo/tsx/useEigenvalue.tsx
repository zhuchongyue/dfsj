import {DescriptionsSchema} from "@dfsj/components";
import {ElFormItem, ElInput} from "element-plus";
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
            field: 'damel',
            span: 8,
            label: '坝顶高程',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="damel">
                            {disabled.value ? valueOfOptions(form.damel ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.damel}>
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
            field: 'watShedArea',
            span: 8,
            label: '坝址以上流域面积',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="watShedArea">
                            {disabled.value ? valueOfOptions(form.watShedArea ,[],{append:UnitEnum.AREA}):
                                <ElInput v-model={form.watShedArea}>
                                    {{
                                        append:()=>UnitEnum.AREA
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'ckflz',
            span: 8,
            label: '校核洪水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="ckflz">
                            {disabled.value ? valueOfOptions(form.ckflz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.ckflz}>
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
            field: 'fldcp',
            span: 8,
            label: '防洪库容',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="fldcp">
                            {disabled.value ? valueOfOptions(form.fldcp ,[],{append:UnitEnum.STORAGE}) :
                                <ElInput v-model={form.fldcp}>
                                    {{
                                        append:()=>UnitEnum.STORAGE
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'daadMulAverRuof',
            span: 8,
            label: '多年平均径流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="daadMulAverRuof">
                            {disabled.value ? valueOfOptions(form.daadMulAverRuof ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.daadMulAverRuof}>
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
            field: 'dsflz',
            span: 8,
            label: '设计洪水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="dsflz">
                            {disabled.value ? valueOfOptions(form.dsflz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.dsflz}>
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
            field: 'actcp',
            span: 8,
            label: '兴利库容',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="actcp">
                            {disabled.value ? valueOfOptions(form.actcp ,[],{append:UnitEnum.STORAGE}) :
                                <ElInput v-model={form.actcp}>
                                    {{
                                        append:()=>UnitEnum.STORAGE
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'dwchsfds',
            span: 8,
            label: '下游河道安全泄量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="dwchsfds">
                            {disabled.value ? valueOfOptions(form.dwchsfds ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.dwchsfds}>
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
            field: 'normz',
            span: 8,
            label: '正常蓄水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="normz">
                            {disabled.value ? valueOfOptions(form.normz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.normz}>
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
            field: 'normw',
            span: 8,
            label: '正常蓄水库容',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="normw">
                            {disabled.value ? valueOfOptions(form.normw ,[],{append:UnitEnum.LENGTH}):
                                <ElInput v-model={form.normw}>
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
            field: 'uppLevFlco',
            span: 8,
            label: '防洪高水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="uppLevFlco">
                            {disabled.value ? valueOfOptions(form.uppLevFlco ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.uppLevFlco}>
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
            field: 'ddz',
            span: 8,
            label: '死水位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="ddz">
                            {disabled.value ? valueOfOptions(form.ddz ,[],{append:UnitEnum.LENGTH}) :
                                <ElInput v-model={form.ddz}>
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
            field: 'ddcp',
            span: 8,
            label: '死库容',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="ddcp">
                            {disabled.value ? valueOfOptions(form.ddcp ,[],{append:UnitEnum.STORAGE}) :
                                <ElInput v-model={form.ddcp}>
                                    {{
                                        append:()=>UnitEnum.STORAGE
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'sdstcp',
            span: 8,
            label: '淤积库容',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="sdstcp">
                            {disabled.value ? valueOfOptions(form.sdstcp ,[],{append:UnitEnum.STORAGE}) :
                                <ElInput v-model={form.sdstcp}>
                                    {{
                                        append:()=>UnitEnum.STORAGE
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'dsflst',
            span: 8,
            label: '设计洪水标准',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="dsflst">
                            {disabled.value ? valueOfOptions(form.dsflst ,[],{append:UnitEnum.PERCENT}) :
                                <ElInput v-model={form.dsflst}>
                                    {{
                                        append:()=>UnitEnum.PERCENT
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'dflmd',
            span: 8,
            label: '设计洪水时最大下泄流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="dflmd">
                            {disabled.value ? valueOfOptions(form.dflmd ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.dflmd}>
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
            field: 'dsflfl',
            span: 8,
            label: '设计洪水流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="dsflfl">
                            {disabled.value ? valueOfOptions(form.dsflfl ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.dsflfl}>
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
            field: 'chflst',
            span: 8,
            label: '校核洪水标准',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="chflst">
                            {disabled.value ? valueOfOptions(form.chflst ,[],{append:UnitEnum.PERCENT}) :
                                <ElInput v-model={form.chflst}>
                                    {{
                                        append:()=>UnitEnum.PERCENT
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'chflfl',
            span: 8,
            label: '校核洪水流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="chflfl">
                            {disabled.value ? valueOfOptions(form.chflfl ,[],{append:UnitEnum.FLOW}) :
                                <ElInput v-model={form.chflfl}>
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
            field: 'cflmd',
            span: 8,
            label: '校核洪水时最大下泄流量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="cflmd">
                            {disabled.value ? valueOfOptions(form.cflmd ,[],{append:UnitEnum.AREA}) :
                                <ElInput v-model={form.cflmd}>
                                    {{
                                        append:()=>UnitEnum.AREA
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'normPoolStagArea',
            span: 24,
            label: '正常蓄水位相应水面面积',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="normPoolStagArea">
                            {disabled.value ? valueOfOptions(form.normPoolStagArea ,[],{append:UnitEnum.AREA}) :
                                <ElInput v-model={form.normPoolStagArea}>
                                    {{
                                        append:()=>UnitEnum.AREA
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