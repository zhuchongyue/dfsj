import {DescriptionsSchema} from "@dfsj/components";
import Define from "@/config/Define.ts";
import {
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElFormItem,
    ElInput,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElSelect
} from "element-plus";
import {shallowRef} from "vue";
import {floodTypeOptions, HaveOrNotOptions, required, valueOfOptions, YesOrNoOptions} from "../../../../utils";

export const useBasic = (form, disabled) => {
    const rules = reactive({
        stnm: [required()],
        stcd: [required()],
        lgtd: [required()],
        lttd: [required()],
    })

    const schema = shallowRef<DescriptionsSchema[]>([
        {
            field: 'stnm',
            span: 8,
            label: '水库名称',
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
            field: 'formerStnm',
            span: 8,
            label: '曾用名(别名)',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="formerStnm">
                            {disabled.value ? valueOfOptions(form.formerStnm ,[]) : <ElInput v-model={form.formerStnm}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'stcd',
            span: 8,
            label: '水库编码',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="stcd">
                            {disabled.value ? valueOfOptions(form.stcd ,[])  : <ElInput v-model={form.stcd}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'registrationNo',
            span: 8,
            label: '注册登记号',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="registrationNo">
                            {disabled.value ?  valueOfOptions(form.registrationNo ,[]) : <ElInput v-model={form.registrationNo}/>}
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
        //下拉选择框
        {
            field: 'engScal',
            span: 8,
            label: '水库规模',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="engScal">
                            {disabled.value ?  valueOfOptions(form.engScal ,Define.EngScalMapOptions) :
                                <ElSelect v-model={form.engScal}>
                                    {Define.EngScalMapOptions.map((item) => (
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
            field: 'engGrad',
            span: 8,
            label: '工程等级',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="engGrad">
                            {disabled.value ? valueOfOptions(form.engGrad ,Define.EngGradOptions) :
                                <ElSelect v-model={form.engGrad}>
                                    {Define.EngGradOptions.map((item) => (
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
            field: 'category',
            span: 8,
            label: '水库类别',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="category">
                            {disabled.value ? valueOfOptions(form.category ,Define.CategoryOptions) :
                                <ElSelect v-model={form.category}>
                                    {Define.CategoryOptions.map((item) => (
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
            field: 'resType',
            span: 8,
            label: '水库类型',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="resType">
                            {disabled.value ? valueOfOptions(form.resType ,Define.RsvrtypeOptions) :
                                <ElSelect v-model={form.resType}>
                                    {Define.RsvrtypeOptions.map((item) => (
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
        }, {
            field: 'riskRsvr',
            span: 8,
            label: '病险库',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="riskRsvr">
                            {disabled.value ?  valueOfOptions(form.riskRsvr ,YesOrNoOptions) :
                                <ElRadioGroup v-model={form.riskRsvr}>
                                    {YesOrNoOptions.map((item) => (
                                        <ElRadio
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElRadioGroup>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'topRsvr',
            span: 8,
            label: '头顶库',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="topRsvr">
                            {disabled.value ? valueOfOptions(form.topRsvr ,YesOrNoOptions) :
                                <ElRadioGroup v-model={form.topRsvr}>
                                    {YesOrNoOptions.map((item) => (
                                        <ElRadio
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElRadioGroup>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'waterLevelDevice',
            span: 8,
            label: '水位实时监测',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="waterLevelDevice">
                            {disabled.value ? valueOfOptions(form.waterLevelDevice ,HaveOrNotOptions) :
                                <ElRadioGroup v-model={form.waterLevelDevice}>
                                    {HaveOrNotOptions.map((item) => (
                                        <ElRadio
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElRadioGroup>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'videoDevice',
            span: 8,
            label: '视频监测',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="videoDevice">
                            {disabled.value ? valueOfOptions(form.videoDevice ,HaveOrNotOptions) :
                                <ElRadioGroup v-model={form.videoDevice}>
                                    {HaveOrNotOptions.map((item) => (
                                        <ElRadio
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElRadioGroup>
                            }
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'floodType',
            span: 8,
            label: '溢流设施',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="floodType">
                            {disabled.value ? valueOfOptions(form.floodType ,floodTypeOptions):
                                <ElSelect v-model={form.floodType}>
                                    {floodTypeOptions.map((item) => (
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
            field: 'bsnm',
            span: 8,
            label: '所在流域',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="bsnm">
                            {disabled.value ? form.bsnm ?? '--' : <ElInput v-model={form.bsnm}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'hnnm',
            span: 8,
            label: '所在水系',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="hnnm">
                            {disabled.value ? form.hnnm ?? '--' : <ElInput v-model={form.hnnm}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'rvnm',
            span: 8,
            label: '所在河流',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="rvnm">
                            {disabled.value ? form.rvnm ?? '--' : <ElInput v-model={form.rvnm}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'stlc',
            span: 16,
            label: '详细地址',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="stlc">
                            {disabled.value ? form.stlc ?? '--' : <ElInput v-model={form.stlc}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'county',
            span: 8,
            label: '行政区',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="county">
                            {form.county ?? '--'}
                        </ElFormItem>
                    )
                }
            }

        },

        {
            field: 'unitManage1',
            span: 16,
            label: '管理单位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="unitManage1">
                            {disabled.value ? form.unitManage1 ?? '--' : <ElInput v-model={form.unitManage1}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'admAuth',
            span: 8,
            label: '主管行业',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="admAuth">
                            {disabled.value ? valueOfOptions(form.admAuth ,Define.IndustryOptions):
                                <ElSelect v-model={form.admAuth}>
                                    {Define.IndustryOptions.map((item) => (
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
            field: 'unitManage2',
            span: 16,
            label: '主管单位',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="unitManage2">
                            {disabled.value ? form.unitManage2 ?? '--' : <ElInput v-model={form.unitManage2}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'engStat',
            span: 8,
            label: '工程建设情况',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="engStat">
                            {disabled.value ? valueOfOptions(form.engStat ,Define.EngStatTypeOptions):
                                <ElSelect v-model={form.engStat}>
                                    {Define.EngStatTypeOptions.map((item) => (
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
            field: 'rsvrTasks',
            span: 24,
            label: '水库任务',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="rsvrTasks">
                            {disabled.value ? valueOfOptions(form.rsvrTasks ,Define.TaskStrTypeOptions):
                                <ElCheckboxGroup v-model={form.rsvrTasks}>
                                    {Define.TaskStrTypeOptions.map((item) => (
                                        <ElCheckbox
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}/>))}
                                </ElCheckboxGroup>
                            }
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
                            {disabled.value ? form.comments ?? '--' : <ElInput v-model={form.comments}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'startDate',
            span: 8,
            label: '建设时间',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="startDate">
                            {disabled.value ? form.startDate ?? '--' : <ElDatePicker
                                v-model={form.startDate}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'storageDate',
            span: 8,
            label: '下闸蓄水时间',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="storageDate">
                            {disabled.value ? form.storageDate ?? '--' : <ElDatePicker
                                v-model={form.storageDate}/>}
                        </ElFormItem>
                    )
                }
            }

        },
        {
            field: 'compDate',
            span: 8,
            label: '竣工验收时间',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="compDate">
                            {disabled.value ? form.compDate ?? '--' : <ElDatePicker
                                v-model={form.compDate}/>}
                        </ElFormItem>
                    )
                }
            }
        },
        {
            field: 'projectOverview',
            span: 24,
            label: '工程概况',
            slots: {
                default: () => {
                    return (
                        <ElFormItem prop="projectOverview">
                            {disabled.value ? form.projectOverview ?? '--' : <ElInput
                                type="textarea"
                                v-model={form.projectOverview}/>}
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