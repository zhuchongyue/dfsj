<template>
  <div
      :class="[
      ppNs.b(),
      drpNs.b(),
      {
        'has-sidebar': Boolean($slots.sidebar) || hasShortcuts,
        'custom-month-range':true,
      },
    ]"
  >
    <div :class="ppNs.e('body-wrapper')">
      <slot name="sidebar" :class="ppNs.e('sidebar')" />
      <div v-if="hasShortcuts" :class="ppNs.e('sidebar')">
        <button
            v-for="(shortcut, key) in shortcuts"
            :key="key"
            type="button"
            :class="ppNs.e('shortcut')"
            @click="handleShortcutClick(shortcut)"
        >
          {{ shortcut.text }}
        </button>
      </div>
      <div :class="ppNs.e('body')">
        <div :class="[ppNs.e('content'), drpNs.e('content')]" class="is-left">
          <div :class="drpNs.e('header')">
            <button
                type="button"
                :class="ppNs.e('icon-btn')"
                class="d-arrow-left"
                @click="leftPrevYear"
            >
              <el-icon><d-arrow-left /></el-icon>
            </button>
            <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableYearArrow"
                :class="[
                ppNs.e('icon-btn'),
                { [ppNs.is('disabled')]: !enableYearArrow },
              ]"
                class="d-arrow-right"
                @click="leftNextYear"
            >
              <el-icon><d-arrow-right /></el-icon>
            </button>
            <div>{{ leftLabel }}</div>
          </div>
          <month-table
              :date="leftDate"
              :disabled-date="leftDisableDate"
              :parsed-value = "parsedValue[0]"
              @pick="handleRangePick($event, 1)"
          />
        </div>
        <div :class="[ppNs.e('content'), drpNs.e('content')]" class="is-right">
          <div :class="drpNs.e('header')">
            <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableYearArrow"
                :class="[ppNs.e('icon-btn'), { 'is-disabled': !enableYearArrow }]"
                class="d-arrow-left"
                @click="rightPrevYear"
            >
              <el-icon><d-arrow-left /></el-icon>
            </button>
            <button
                type="button"
                :class="ppNs.e('icon-btn')"
                class="d-arrow-right"
                @click="rightNextYear"
            >
              <el-icon><d-arrow-right /></el-icon>
            </button>
            <div>{{ rightLabel }}</div>
          </div>
          <month-table
              :date="rightDate"
              :disabled-date="rightDisableDate"
              :parsed-value = "parsedValue[1]"
              @pick="handleRangePick($event,2)"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-end my-2 mr-5">
      <!--      <el-button @click="closePanel" size="small">{{ t('el.datepicker.clear') }}</el-button>-->
      <el-button type="primary" @click="handleRangeConfirm()" size="small">{{ t('el.datepicker.confirm') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, ref, toRef,} from 'vue'
import type {Dayjs} from 'dayjs'
import dayjs from 'dayjs'
import {useLocale} from "element-plus"
//@ts-ignore
import {DArrowLeft, DArrowRight} from '@element-plus/icons-vue'
import {panelMonthRangeEmits,} from 'element-plus/es/components/date-picker/src/props/panel-month-range'
import MonthTable from 'element-plus/es/components/date-picker/src/date-picker-com/basic-month-table.mjs'
import {useMonthRangeHeader} from "../composables/use-month-range-header"
import {useRangePicker} from "../composables/use-range-picker"
import {definePropType} from "element-plus/es/utils/index.mjs"
import {cloneDeep} from "lodash-es";

defineOptions({
  name: 'DatePickerMonthRange',
})

const props = defineProps({
  unlinkPanels: Boolean,
  visible: Boolean,
  parsedValue: definePropType<Dayjs[]>(Array)
})
const emit = defineEmits([...panelMonthRangeEmits,"hide"])
const unit = 'year'

const { lang } = useLocale()
const pickerBase = inject('EP_PICKER_BASE') as any
const { shortcuts, disabledDate, format } = pickerBase.props
const leftDate = ref(props.parsedValue?.[0] || dayjs().locale(lang.value))
const rightDate = ref(props.parsedValue?.[1] || dayjs().locale(lang.value).add(1, unit))
const parsedValue = ref([cloneDeep(leftDate.value), cloneDeep(rightDate.value)])

const {
  ppNs,
  drpNs,

  handleRangeConfirm,
  leftDisableDate,
  rightDisableDate,
  t,
  handleShortcutClick,
    //@ts-ignore
} = useRangePicker(props, {
  leftDate,
  rightDate,
  unit,
  parsedValue,
  disabledDate,
})
const hasShortcuts = computed(() => !!shortcuts.length)

const {
  leftPrevYear,
  rightNextYear,
  leftNextYear,
  rightPrevYear,
  leftLabel,
  rightLabel,
  leftYear,
  rightYear,
} = useMonthRangeHeader({
  //@ts-ignore
  unlinkPanels: toRef(props, 'unlinkPanels'),
  leftDate,
  rightDate,
})



const enableYearArrow = computed(() => {
  return props.unlinkPanels && rightYear.value > leftYear.value
})
const handleRangePick = (month, type) => {
  // todo
  if(type==1){
    leftDate.value = leftDate.value.startOf('month').month(month)
    parsedValue.value[0] = cloneDeep(leftDate.value)
  }else{
    rightDate.value = rightDate.value.startOf("month").month(month)
    parsedValue.value[1] = cloneDeep(rightDate.value)
  }
}

const formatToString = (days: Dayjs[]) => {
  return days.map((day) => day.format(format))
}

emit('set-picker-option', ['formatToString', formatToString])
</script>
<!--<style lang="scss">-->
<!--.custom-month-range{-->
<!--  .el-month-table .current .cell{-->
<!--    background-color: var(&#45;&#45;el-color-primary);-->
<!--    color: #fff!important;-->
<!--  }-->
<!--}-->
<!--</style>-->