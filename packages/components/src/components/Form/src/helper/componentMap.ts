import type {Component} from 'vue';
import {
    ElAutocomplete,
    ElCascader,
    ElCheckboxGroup,
    ElColorPicker,
    ElDatePicker,
    ElDivider,
    ElInput,
    ElInputNumber,
    ElRadioGroup,
    ElRate,
    ElSelect,
    ElSelectV2,
    ElSlider,
    ElSwitch,
    ElTimePicker,
    ElTimeSelect,
    ElTransfer,
    ElTreeSelect,
    ElUpload,
} from 'element-plus';
import {InputPassword} from '../../../InputPassword'
import {Editor} from '../../../Editor';
// import { JsonEditor } from '../../../JsonEditor' //json 数据编辑表单
// import { IconPicker } from '../../../IconPicker' //图表选择
import {ComponentName} from '../types';
import {Recordable} from '../../../../types';
import {DatePicker as CustomDatePicker} from "../../../DatePicker"

const componentMap: Recordable<Component, ComponentName> = {
    RadioGroup: ElRadioGroup,
    RadioButton: ElRadioGroup,
    CheckboxGroup: ElCheckboxGroup,
    CheckboxButton: ElCheckboxGroup,
    Input: ElInput,
    Autocomplete: ElAutocomplete,
    InputNumber: ElInputNumber,
    Select: ElSelect,
    Cascader: ElCascader,
    Switch: ElSwitch,
    Slider: ElSlider,
    TimePicker: ElTimePicker,
    DatePicker: ElDatePicker,
    //自定义的时间范围选择器
    CustomDatePicker: CustomDatePicker,
    Rate: ElRate,
    ColorPicker: ElColorPicker,
    Transfer: ElTransfer,
    Divider: ElDivider,
    TimeSelect: ElTimeSelect,
    SelectV2: ElSelectV2,
    InputPassword: InputPassword,
    Editor: Editor,
    TreeSelect: ElTreeSelect,
    Upload: ElUpload,
    // JsonEditor: JsonEditor,
    // IconPicker: IconPicker
} as any;

export {componentMap};
