import {DescriptionsSchema} from "@dfsj/components";
import Define from "@/config/Define.ts";
import {ElFormItem, ElInput, ElOption, ElSelect} from "element-plus";
import {shallowRef} from "vue";
import {required, valueOfOptions} from "../../../../utils";

export const useBasic = (form, disabled) => {
    const rules = reactive({
        stnm: [required()],
        stcd: [required()],
        lgtd: [required()],
        lttd: [required()],
    })

    const schema = shallowRef<DescriptionsSchema[]>([
        {
            field: 'stcd',
            span: 8,
            label: '测站编码',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="stcd">
                            {disabled.value ?  valueOfOptions(form.stcd ,[]) : <ElInput v-model={form.stcd}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'stnm',
            span: 8,
            label: '测站名称',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="stnm">
                            {disabled.value ?  valueOfOptions(form.stnm ,[]) : <ElInput v-model={form.stnm}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'sttp',
            span: 8,
            label: '测站类型',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="sttp">
                            {disabled.value ?  valueOfOptions(form.sttp ,Define.StationTypeOptions) :
                                <ElSelect v-model={form.sttp}>
                                    {Define.StationTypeOptions.map((item) => (
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
            field: 'sendtype',
            span: 8,
            label: '报汛等级',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="sendtype">
                            {disabled.value ?  valueOfOptions(form.sendtype ,[]) : <ElInput v-model={form.sendtype}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'lgtd',
            span: 8,
            label: '经度',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="lgtd">
                            {disabled.value ?  valueOfOptions(form.lgtd ,[]) : <ElInput v-model={form.lgtd}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'lttd',
            span: 8,
            label: '纬度',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="lttd">
                            {disabled.value ?  valueOfOptions(form.lttd ,[]) : <ElInput v-model={form.lttd}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'dtmnm',
            span: 8,
            label: '基面名称',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="dtmnm">
                            {disabled.value ?  valueOfOptions(form.dtmnm ,[]) : <ElInput v-model={form.dtmnm}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'locality',
            span: 8,
            label: '交换管理单位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="locality">
                            {disabled.value ?  valueOfOptions(form.locality ,[]) : <ElInput v-model={form.locality}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'bsnm',
            span: 8,
            label: '流域名称',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="bsnm">
                            {disabled.value ?  valueOfOptions(form.bsnm ,[]) : <ElInput v-model={form.bsnm}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'hnnm',
            span: 8,
            label: '水系名称',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="hnnm">
                            {disabled.value ?  valueOfOptions(form.hnnm ,[]) : <ElInput v-model={form.hnnm}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'rvnm',
            span: 8,
            label: '河流名称',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="rvnm">
                            {disabled.value ?  valueOfOptions(form.rvnm ,[]) : <ElInput v-model={form.rvnm}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'drna',
            span: 8,
            label: '集水面积',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="drna">
                            {disabled.value ?  valueOfOptions(form.drna ,[]) : <ElInput v-model={form.drna}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'esstym',
            span: 8,
            label: '建站年月',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="esstym">
                            {disabled.value ?  valueOfOptions(form.esstym ,[]) : <ElInput v-model={form.esstym}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'bgfrym',
            span: 8,
            label: '始报年月',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="bgfrym">
                            {disabled.value ?  valueOfOptions(form.bgfrym ,[]) : <ElInput v-model={form.bgfrym}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'eacid',
            span: 8,
            label: '预报模型编码',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="eacid">
                            {disabled.value ?  valueOfOptions(form.eacid ,[]) : <ElInput v-model={form.eacid}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'stlc',
            span: 24,
            label: '站址',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="stlc">
                            {disabled.value ?  valueOfOptions(form.stlc ,[]) : <ElInput v-model={form.stlc}/>}
                        </ElFormItem>
                    )
                }
            }
        },

        {
            field: 'comments',
            span: 24,
            label: '备注',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="comments">
                            {disabled.value ?  valueOfOptions(form.comments ,[]) :
                                <ElInput 
                                    type="textarea"
                                    v-model={form.comments}/>}
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