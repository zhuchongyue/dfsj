import {DescriptionsSchema} from "@dfsj/components";
import Define from "@/config/Define.ts";
import {ElFormItem, ElInput, ElOption, ElSelect} from "element-plus";
import {shallowRef} from "vue";
import {UnitEnum} from "@/enums/unitEnum.ts";
import {required, valueOfOptions} from "../../../../utils";

export const useDamPower = (form, disabled) => {
    const rules = reactive({
        stnm: [required()],
        stcd: [required()],
        lgtd: [required()],
        lttd: [required()],
    })

    const schema = shallowRef<DescriptionsSchema[]>([
        {
            field: 'mwrtbdtp',
            span: 8,
            label: '主要挡水建筑物',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="mwrtbdtp">
                            {disabled.value ? valueOfOptions(form.mwrtbdtp, Define.MwrtbdtpTypeOptions) :
                                <ElSelect v-model={form.mwrtbdtp}>
                                    {Define.MwrtbdtpTypeOptions.map((item) => (
                                        <ElOption
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElSelect>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'damTypeMat',
            span: 8,
            label: '挡水主坝材料类型',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="damTypeMat">
                            {disabled.value ? valueOfOptions(form.damTypeMat, Define.DamTypeMatTypeOptions) :
                                <ElSelect v-model={form.damTypeMat}>
                                    {Define.DamTypeMatTypeOptions.map((item) => (
                                        <ElOption
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElSelect>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'damTypeStr',
            span: 8,
            label: '挡水主坝结构类型',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="damTypeStr">
                            {disabled.value ? valueOfOptions(form.damTypeStr, Define.DamTypeStrTypeOptions) :
                                <ElSelect v-model={form.damTypeStr}>
                                    {Define.DamTypeStrTypeOptions.map((item) => (
                                        <ElOption
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElSelect>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'damel',
            span: 8,
            label: '坝顶高程',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="damel">
                            {disabled.value ? valueOfOptions(form.damel, [], {append: UnitEnum.LENGTH}) :
                                <ElInput v-model={form.damel}>
                                    {{
                                        append: () => UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'damMaxHeig',
            span: 8,
            label: '主坝尺寸高度',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="damMaxHeig">
                            {disabled.value ? valueOfOptions(form.damMaxHeig, [], {append: UnitEnum.LENGTH}) :
                                <ElInput v-model={form.damMaxHeig}>
                                    {{
                                        append: () => UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'damTopWid',
            span: 8,
            label: '主坝坝顶宽度',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="damTopWid">
                            {disabled.value ? valueOfOptions(form.damTopWid, [], {append: UnitEnum.LENGTH}) :
                                <ElInput v-model={form.damTopWid}>
                                    {{
                                        append: () => UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        }, {
            field: 'damTopLen',
            span: 8,
            label: '主坝尺寸长度',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="damTopLen">
                            {disabled.value ? valueOfOptions(form.damTopLen, [], {append: UnitEnum.LENGTH}) :
                                <ElInput v-model={form.damTopLen}>
                                    {{
                                        append: () => UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        }, {
            field: 'dmbsspms',
            span: 16,
            label: '坝基防渗体型式',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="dmbsspms">
                            {disabled.value ? valueOfOptions(form.dmbsspms, [], ) :
                                <ElInput v-model={form.dmbsspms}>  </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        }, {
            field: 'auxiliaryDamNum',
            span: 8,
            label: '副坝座数',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="auxiliaryDamNum">
                            {disabled.value ? valueOfOptions(form.auxiliaryDamNum, [], ) :
                                <ElInput v-model={form.auxiliaryDamNum}>
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'auxiliaryDamLen',
            span: 8,
            label: '副坝总长度',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="auxiliaryDamLen">
                            {disabled.value ? valueOfOptions(form.auxiliaryDamLen, [], {append: UnitEnum.LENGTH}) :
                                <ElInput v-model={form.auxiliaryDamLen}>
                                    {{
                                        append: () => UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'auxiliaryDamMaxHeight',
            span: 8,
            label: '副坝最大坝高',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="auxiliaryDamMaxHeight">
                            {disabled.value ? valueOfOptions(form.auxiliaryDamMaxHeight, [], {append: UnitEnum.LENGTH}) :
                                <ElInput v-model={form.auxiliaryDamMaxHeight}>
                                    {{
                                        append: () => UnitEnum.LENGTH
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'inqa',
            span: 8,
            label: '装机台数',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="inqa">
                            {disabled.value ? valueOfOptions(form.inqa, [], ) :
                                <ElInput v-model={form.inqa}>
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'incp',
            span: 8,
            label: '装机容量',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="incp">
                            {disabled.value ? valueOfOptions(form.incp, [], {append: 'MW'}) :
                                <ElInput v-model={form.incp}>
                                    {{
                                        append: () => 'MW'
                                    }}
                                </ElInput>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'factoryForm',
            span: 8,
            label: '厂房布置型式',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="factoryForm">
                            {disabled.value ? valueOfOptions(form.factoryForm, []) :
                                <ElInput v-model={form.factoryForm}>
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