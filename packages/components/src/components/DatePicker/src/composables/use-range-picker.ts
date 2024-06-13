import {getCurrentInstance, inject, type Ref, ref, unref, watch} from 'vue'
import {useLocale, useNamespace} from 'element-plus/es/hooks/index.mjs'
import {getDefaultValue, isValidRange} from 'element-plus/es/components/date-picker/src/utils.mjs'
import {ROOT_PICKER_INJECTION_KEY} from 'element-plus/es/components/date-picker/src/constants.mjs'
import {useShortcut} from 'element-plus/es/components/date-picker/src/composables/use-shortcut.mjs'

import type {Dayjs} from 'dayjs'
import dayjs from "dayjs";
import type {PanelRangeSharedProps, RangeState} from 'element-plus/es/components/date-picker/src/props/shared'
import {isArray} from 'element-plus/es/utils/index.mjs'

type UseRangePickerProps = {
  leftDate: Ref<Dayjs>
  rightDate: Ref<Dayjs>
  unit: 'month' | 'year',
  parsedValue: Ref<Dayjs[]>,
  disabledDate: (date: Dayjs) => boolean
}
type ExtendProps = {
  visible: boolean
}
export const useRangePicker = (
    props: PanelRangeSharedProps & ExtendProps,
    {
      leftDate,
      rightDate,
      unit,
      parsedValue,
      disabledDate,
    }: UseRangePickerProps
) => {
  const { emit } = getCurrentInstance()!

  const { pickerNs } = inject(ROOT_PICKER_INJECTION_KEY)! as any;
  const drpNs = useNamespace('date-range-picker')
  const rangeState = ref<RangeState>({
    endDate: null,
    selecting: false,
  })
  const { t, lang } = useLocale()
  const handleShortcutClick = useShortcut(lang)

  const handleRangeConfirm = (visible = false) => {
    const _minDate = unref(leftDate)
    const _maxDate = unref(rightDate)

    if (isValidRange([_minDate, _maxDate])) {
      emit('pick', [_minDate, _maxDate], visible)
    }
  }
  const onSelect = (selecting: boolean) => {
    rangeState.value.selecting = selecting
    if (!selecting) {
      rangeState.value.endDate = null
    }
  }

  const restoreDefault = () => {
    const [start, end] = getDefaultValue(unref(props.parsedValue), {
      lang: unref(lang),
      unit,
      unlinkPanels: props.unlinkPanels,
    })
    leftDate.value = start
    rightDate.value = end
    parsedValue.value = [start, end]
  }
  const leftDisableDate = (date) => {
    if(disabledDate && disabledDate(date)) return true;
    if(!rightDate.value) return false;
    if(dayjs(date).hour(0).minute(0).second(0).valueOf() > dayjs(rightDate.value).valueOf()) return true;
  }
  const rightDisableDate = (date) => {
    if(!leftDate.value) return false;
    if(dayjs(date).valueOf() < dayjs(leftDate.value).hour(0).minute(0).second(0).valueOf()) return true;
  }


  watch(
      () => props.parsedValue,
      (parsedValue) => {
        // debugger
        if (isArray(parsedValue) && parsedValue.length === 2) {
          const [start, end] = parsedValue
          leftDate.value = start
          rightDate.value = end
        } else {
          restoreDefault()
        }
      },
      { immediate: true }
  )
  watch(() => props.visible, (val) => {
    if(!val) restoreDefault();
  })
  return {
    lang,
    ppNs: pickerNs,
    drpNs,
    rangeState,

    handleRangeConfirm,
    onSelect,
    handleShortcutClick,
    leftDisableDate,
    rightDisableDate,
    t,
  }
}
