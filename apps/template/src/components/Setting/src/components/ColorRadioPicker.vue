<script setup lang="ts">
import { PropType, watch, unref, ref } from 'vue'
import { propTypes } from '@dfsj/utils'
import { useDesign } from '/@/hooks/web/useDesign';
import { Icon} from "@dfsj/components"


const prefixCls = useDesign('color-radio-picker')

const props = defineProps({
  schema: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['update:modelValue', 'change'])

const colorVal = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(colorVal)) return
    colorVal.value = val
  }
)

// 监听
watch(
  () => colorVal.value,
  (val: string) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
)
</script>

<template>
  <div :class="prefixCls" class="flex flex-wrap space-x-4">
    <span
      v-for="(item, i) in schema"
      :key="`radio-${i}`"
      class="w-8 h-8 cursor-pointer rounded-2px border-solid border-gray-300 border-2px text-center leading-20px mb-5px"
      :class="{ 'is-active': colorVal === item }"
      :style="{
        background: item
      }"
      @click="colorVal = item"
    >
      <Icon v-if="colorVal === item" color="#fff" icon="ep:check" :size="16" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
$prefix-cls: '#{$namespace}-color-radio-picker';

.#{$prefix-cls} {
  .is-active {
    border-color: var(--el-color-primary);
  }
}
</style>
