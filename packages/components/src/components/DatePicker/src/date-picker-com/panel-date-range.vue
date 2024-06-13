<template>
  <div
      :class="[
      ppNs.b(),
      drpNs.b(),
      {
        'has-sidebar': $slots.sidebar || hasShortcuts,
        'has-time': showTime,
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
        <div v-if="showTime" :class="drpNs.e('time-header')">
          <span :class="drpNs.e('editors-wrap')">
            <span :class="drpNs.e('time-picker-wrap')">
              <el-input
                  size="small"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.startDate')"
                  :class="drpNs.e('editor')"
                  :model-value="minVisibleDate"
                  :validate-event="false"
                  @input="(val) => handleDateInput(val, 'min')"
                  @change="(val) => handleDateChange(val, 'min')"
              />
            </span>
            <span
                v-clickoutside="handleMinTimeClose"
                :class="drpNs.e('time-picker-wrap')"
            >
              <el-input
                  size="small"
                  :class="drpNs.e('editor')"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.startTime')"
                  :model-value="minVisibleTime"
                  :validate-event="false"
                  @focus="minTimePickerVisible = true"
                  @input="(val) => handleTimeInput(val, 'min')"
                  @change="(val) => handleTimeChange(val, 'min')"
              />
              <time-pick-panel
                  :visible="minTimePickerVisible"
                  :format="timeFormat"
                  datetime-role="start"
                  :time-arrow-control="arrowControl"
                  :parsed-value="leftDate"
                  @pick="handleMinTimePick"
              />
            </span>
          </span>
          <span>
            <el-icon><arrow-right /></el-icon>
          </span>
          <span :class="drpNs.e('editors-wrap')" class="is-right">
            <span :class="drpNs.e('time-picker-wrap')">
              <el-input
                  size="small"
                  :class="drpNs.e('editor')"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.endDate')"
                  :model-value="maxVisibleDate"
                  :readonly="!leftDate"
                  :validate-event="false"
                  @input="(val) => handleDateInput(val, 'max')"
                  @change="(val) => handleDateChange(val, 'max')"
              />
            </span>
            <span
                v-clickoutside="handleMaxTimeClose"
                :class="drpNs.e('time-picker-wrap')"
            >
              <el-input
                  size="small"
                  :class="drpNs.e('editor')"
                  :disabled="rangeState.selecting"
                  :placeholder="t('el.datepicker.endTime')"
                  :model-value="maxVisibleTime"
                  :readonly="!leftDate"
                  :validate-event="false"
                  @focus="leftDate && (maxTimePickerVisible = true)"
                  @input="(val) => handleTimeInput(val, 'max')"
                  @change="(val) => handleTimeChange(val, 'max')"
              />
              <time-pick-panel
                  datetime-role="end"
                  :visible="maxTimePickerVisible"
                  :format="timeFormat"
                  :time-arrow-control="arrowControl"
                  :parsed-value="rightDate"
                  @pick="handleMaxTimePick"
              />
            </span>
          </span>
        </div>
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
                type="button"
                :class="ppNs.e('icon-btn')"
                class="arrow-left"
                @click="leftPrevMonth"
            >
              <el-icon><arrow-left /></el-icon>
            </button>
            <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableYearArrow"
                :class="[ppNs.e('icon-btn'), { 'is-disabled': !enableYearArrow }]"
                class="d-arrow-right"
                @click="leftNextYear"
            >
              <el-icon><d-arrow-right /></el-icon>
            </button>
            <button
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableMonthArrow"
                :class="[
                ppNs.e('icon-btn'),
                { 'is-disabled': !enableMonthArrow },
              ]"
                class="arrow-right"
                @click="leftNextMonth"
            >
              <el-icon><arrow-right /></el-icon>
            </button>
            <div>{{ leftLabel }}</div>
          </div>
          <date-table
              :date="leftDate"
              :parsed-value="parsedValue[0]"
              :disabled-date="leftDisableDate"
              :cell-class-name="cellClassName"
              @pick="handleRangePick($event, 1)"
              @select="onSelect"
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
                v-if="unlinkPanels"
                type="button"
                :disabled="!enableMonthArrow"
                :class="[
                ppNs.e('icon-btn'),
                { 'is-disabled': !enableMonthArrow },
              ]"
                class="arrow-left"
                @click="rightPrevMonth"
            >
              <el-icon><arrow-left /></el-icon>
            </button>
            <button
                type="button"
                :class="ppNs.e('icon-btn')"
                class="d-arrow-right"
                @click="rightNextYear"
            >
              <el-icon><d-arrow-right /></el-icon>
            </button>
            <button
                type="button"
                :class="ppNs.e('icon-btn')"
                class="arrow-right"
                @click="rightNextMonth"
            >
              <el-icon><arrow-right /></el-icon>
            </button>
            <div>{{ rightLabel }}</div>
          </div>
          <date-table
              :date="rightDate"
              :parsed-value="parsedValue[1]"
              :disabled-date="rightDisableDate"
              :cell-class-name="cellClassName"
              @pick="handleRangePick($event,2)"
              @select="onSelect"
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
import {computed, inject, ref, toRef, unref} from 'vue'
import type {Dayjs} from 'dayjs'
import dayjs from 'dayjs'
import {ClickOutside as vClickoutside, useLocale} from 'element-plus'
import {definePropType, isArray} from 'element-plus/es/utils/index.mjs'
import {extractDateFormat, extractTimeFormat, TimePickPanel,} from 'element-plus/es/components/time-picker/index.mjs'
//@ts-ignore
import {ArrowLeft, ArrowRight, DArrowLeft, DArrowRight,} from '@element-plus/icons-vue'

import {useRangePicker} from '../composables/use-range-picker'
import {getDefaultValue, isValidRange} from 'element-plus/es/components/date-picker/src/utils'
import DateTable from 'element-plus/es/components/date-picker/src/date-picker-com/basic-date-table.mjs'
import {cloneDeep} from "lodash-es";

type ChangeType = 'min' | 'max'
type UserInput = {
  min: string | null
  max: string | null
}

const props = defineProps({
  unlinkPanels: Boolean,
  visible: Boolean,
  parsedValue: definePropType<Dayjs[]>(Array)
})
const emit = defineEmits([
  'pick',
  'set-picker-option',
  'calendar-change',
  'panel-change',
])

const unit = 'month'
// FIXME: fix the type for ep picker
const pickerBase = inject('EP_PICKER_BASE') as any
const {
  disabledDate,
  cellClassName,
  format,
  defaultTime,
  arrowControl,
  clearable,
  type,
  defaultValue,

} = pickerBase.props
const shortcuts = toRef(pickerBase.props, 'shortcuts')
const { lang } = useLocale()
const leftDate = ref(props.parsedValue?.[0] || dayjs().locale(lang.value))
const rightDate = ref(props.parsedValue?.[1] || dayjs().locale(lang.value).add(1, unit))
const parsedValue = ref([cloneDeep(leftDate.value), cloneDeep(rightDate.value)])

const {
  ppNs,
  drpNs,
  rangeState,

  handleRangeConfirm,
  leftDisableDate,
  rightDisableDate,
  handleShortcutClick,
  onSelect,
  t,
  //@ts-ignore
} = useRangePicker(props, {
  leftDate,
  rightDate,
  unit,
  parsedValue,
  disabledDate,
})

const dateUserInput = ref<UserInput>({
  min: null,
  max: null,
})

const timeUserInput = ref<UserInput>({
  min: null,
  max: null,
})

const leftLabel = computed(() => {
  return `${leftDate.value.year()} ${t('el.datepicker.year')} ${t(
      `el.datepicker.month${leftDate.value.month() + 1}`
  )}`
})

const rightLabel = computed(() => {
  return `${rightDate.value.year()} ${t('el.datepicker.year')} ${t(
      `el.datepicker.month${rightDate.value.month() + 1}`
  )}`
})

const leftYear = computed(() => {
  return leftDate.value.year()
})

const leftMonth = computed(() => {
  return leftDate.value.month()
})

const rightYear = computed(() => {
  return rightDate.value.year()
})

const rightMonth = computed(() => {
  return rightDate.value.month()
})

const hasShortcuts = computed(() => !!shortcuts.value.length)

const minVisibleDate = computed(() => {
  if (dateUserInput.value.min !== null) return dateUserInput.value.min
  if (leftDate.value) return leftDate.value.format(dateFormat.value)
  return ''
})

const maxVisibleDate = computed(() => {
  if (dateUserInput.value.max !== null) return dateUserInput.value.max
  if (rightDate.value || leftDate.value)
    return (rightDate.value || leftDate.value)!.format(dateFormat.value)
  return ''
})

const minVisibleTime = computed(() => {
  if (timeUserInput.value.min !== null) return timeUserInput.value.min
  if (leftDate.value) return leftDate.value.format(timeFormat.value)
  return ''
})

const maxVisibleTime = computed(() => {
  if (timeUserInput.value.max !== null) return timeUserInput.value.max
  if (rightDate.value || leftDate.value)
    return (rightDate.value || leftDate.value)!.format(timeFormat.value)
  return ''
})

const timeFormat = computed(() => {
  return extractTimeFormat(format)
})

const dateFormat = computed(() => {
  return extractDateFormat(format)
})

const leftPrevYear = () => {
  leftDate.value = leftDate.value.subtract(1, 'year')
  if (!props.unlinkPanels) {
    rightDate.value = leftDate.value.add(1, 'month')
  }
  handlePanelChange('year')
}

const leftPrevMonth = () => {
  leftDate.value = leftDate.value.subtract(1, 'month')
  if (!props.unlinkPanels) {
    rightDate.value = leftDate.value.add(1, 'month')
  }
  handlePanelChange('month')
}

const rightNextYear = () => {
  if (!props.unlinkPanels) {
    leftDate.value = leftDate.value.add(1, 'year')
    rightDate.value = leftDate.value.add(1, 'month')
  } else {
    rightDate.value = rightDate.value.add(1, 'year')
  }
  handlePanelChange('year')
}

const rightNextMonth = () => {
  if (!props.unlinkPanels) {
    leftDate.value = leftDate.value.add(1, 'month')
    rightDate.value = leftDate.value.add(1, 'month')
  } else {
    rightDate.value = rightDate.value.add(1, 'month')
  }
  handlePanelChange('month')
}

const leftNextYear = () => {
  leftDate.value = leftDate.value.add(1, 'year')
  handlePanelChange('year')
}

const leftNextMonth = () => {
  leftDate.value = leftDate.value.add(1, 'month')
  handlePanelChange('month')
}

const rightPrevYear = () => {
  rightDate.value = rightDate.value.subtract(1, 'year')
  handlePanelChange('year')
}

const rightPrevMonth = () => {
  rightDate.value = rightDate.value.subtract(1, 'month')
  handlePanelChange('month')
}

const handlePanelChange = (mode: 'month' | 'year') => {
  emit(
      'panel-change',
      [leftDate.value.toDate(), rightDate.value.toDate()],
      mode
  )
}

const enableMonthArrow = computed(() => {
  const nextMonth = leftMonth.value + 1 >= 12 ? 0 : leftMonth.value+1;
  const yearOffset = leftMonth.value + 1 >= 12 ? 1 : 0
  return (
      props.unlinkPanels &&
      new Date(leftYear.value + yearOffset, nextMonth) <=
      new Date(rightYear.value, rightMonth.value)
  )
})

const enableYearArrow = computed(() => {
  return (
      props.unlinkPanels &&
      rightYear.value * 12 +
      rightMonth.value -
      (leftYear.value * 12 + leftMonth.value + 1) >=
      11
  )
})



const showTime = computed(
    () => type === 'datetime' || type === 'datetimerange'
)

const formatEmit = (emitDayjs: Dayjs | null, index?: number) => {
  if (!emitDayjs) return
  if (defaultTime) {
    const defaultTimeD = dayjs(
        defaultTime[index as number] || defaultTime
    ).locale(lang.value)
    return defaultTimeD
        .year(emitDayjs.year())
        .month(emitDayjs.month())
        .date(emitDayjs.date())
  }
  return emitDayjs
}

const handleRangePick = (
    date,
    type
) => {
  if(type==1){
    leftDate.value = formatEmit(date,0)
    parsedValue.value[0] = cloneDeep(leftDate.value)
  }else{
    rightDate.value = formatEmit(date, 1)
    parsedValue.value[1] = cloneDeep(rightDate.value)

  }
}

const minTimePickerVisible = ref(false)
const maxTimePickerVisible = ref(false)

const handleMinTimeClose = () => {
  minTimePickerVisible.value = false
}

const handleMaxTimeClose = () => {
  maxTimePickerVisible.value = false
}

const handleDateInput = (value: string | null, type: ChangeType) => {
  dateUserInput.value[type] = value
  const parsedValueD = dayjs(value, dateFormat.value).locale(lang.value)
  if (parsedValueD.isValid()) {
    if (disabledDate && disabledDate(parsedValueD.toDate())) {
      return
    }
    if (type === 'min') {
      leftDate.value = parsedValueD
      leftDate.value = (leftDate.value || leftDate.value)
          .year(parsedValueD.year())
          .month(parsedValueD.month())
          .date(parsedValueD.date())
      if (
          !props.unlinkPanels &&
          (!rightDate.value || rightDate.value.isBefore(leftDate.value))
      ) {
        rightDate.value = parsedValueD.add(1, 'month')
        rightDate.value = leftDate.value.add(1, 'month')
      }
    } else {
      rightDate.value = parsedValueD
      rightDate.value = (rightDate.value || rightDate.value)
          .year(parsedValueD.year())
          .month(parsedValueD.month())
          .date(parsedValueD.date())
      if (
          !props.unlinkPanels &&
          (!leftDate.value || leftDate.value.isAfter(rightDate.value))
      ) {
        leftDate.value = parsedValueD.subtract(1, 'month')
        leftDate.value = rightDate.value.subtract(1, 'month')
      }
    }
  }
}

const handleDateChange = (_: unknown, type: ChangeType) => {
  dateUserInput.value[type] = null
}

const handleTimeInput = (value: string | null, type: ChangeType) => {
  timeUserInput.value[type] = value
  const parsedValueD = dayjs(value, timeFormat.value).locale(lang.value)

  if (parsedValueD.isValid()) {
    if (type === 'min') {
      minTimePickerVisible.value = true
      leftDate.value = (leftDate.value)
          .hour(parsedValueD.hour())
          .minute(parsedValueD.minute())
          .second(parsedValueD.second())
      if (!rightDate.value || rightDate.value.isBefore(leftDate.value)) {
        rightDate.value = leftDate.value
      }
    } else {
      maxTimePickerVisible.value = true
      rightDate.value = (rightDate.value)
          .hour(parsedValueD.hour())
          .minute(parsedValueD.minute())
          .second(parsedValueD.second())
      rightDate.value = rightDate.value
      if (rightDate.value && rightDate.value.isBefore(leftDate.value)) {
        leftDate.value = rightDate.value
      }
    }
  }
}

const handleTimeChange = (value: string | null, type: ChangeType) => {
  timeUserInput.value[type] = null
  if (type === 'min') {
    minTimePickerVisible.value = false
  } else {
    maxTimePickerVisible.value = false
  }
}

const handleMinTimePick = (value: Dayjs, visible: boolean, first: boolean) => {
  if (timeUserInput.value.min) return
  if (value) {
    leftDate.value = value
    leftDate.value = (leftDate.value || leftDate.value)
        .hour(value.hour())
        .minute(value.minute())
        .second(value.second())
  }

  if (!first) {
    minTimePickerVisible.value = visible
  }

  if (!rightDate.value || rightDate.value.isBefore(leftDate.value)) {
    rightDate.value = leftDate.value
    rightDate.value = value
  }
}

const handleMaxTimePick = (
    value: Dayjs | null,
    visible: boolean,
    first: boolean
) => {
  if (timeUserInput.value.max) return
  if (value) {
    rightDate.value = value
    rightDate.value = (rightDate.value || rightDate.value)
        .hour(value.hour())
        .minute(value.minute())
        .second(value.second())
  }

  if (!first) {
    maxTimePickerVisible.value = visible
  }

  if (rightDate.value && rightDate.value.isBefore(leftDate.value)) {
    leftDate.value = rightDate.value
  }
}

const handleClear = () => {
  leftDate.value = getDefaultValue(unref(defaultValue), {
    lang: unref(lang),
    unit: 'month',
    //@ts-ignore
    unlinkPanels: props.unlinkPanels,
  })[0]
  rightDate.value = leftDate.value.add(1, 'month')
  emit('pick', null)
}

const formatToString = (value: Dayjs | Dayjs[]) => {
  return isArray(value)
      //@ts-ignore
      ? value.map((_) => _.format(format))
      //@ts-ignore
      : value.format(format)
}

const parseUserInput = (value: Dayjs | Dayjs[]) => {
  return isArray(value)
      //@ts-ignore
      ? value.map((_) => dayjs(_, format).locale(lang.value))
      //@ts-ignore
      : dayjs(value, format).locale(lang.value)
}
emit('set-picker-option', ['isValidValue', isValidRange])
emit('set-picker-option', ['parseUserInput', parseUserInput])
emit('set-picker-option', ['formatToString', formatToString])
emit('set-picker-option', ['handleClear', handleClear])
</script>
