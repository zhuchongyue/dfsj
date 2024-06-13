<script setup lang="ts">
import {PropType, ref, unref, watch} from 'vue'
import {propTypes} from '@dfsj/utils'
import {useDesign} from '/@/hooks/web/useDesign';
import {Icon} from "@dfsj/components"
import {Theme} from "/#/global";


const {prefixCls} = useDesign('theme-radio-picker')

const props = defineProps({
  schema: {
    type: Array as PropType<Theme[]>,
    default: () => []
  },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['update:modelValue', 'change'])

const themeVal = ref(props.modelValue)

watch(
    () => props.modelValue,
    (val: string) => {
      if (val === unref(themeVal)) return
      themeVal.value = val
    }
)

// 监听
watch(
    () => themeVal.value,
    (val: string) => {
      emit('update:modelValue', val)
      emit('change', val)
    }
)
</script>

<template>
  <div :class="prefixCls" class="flex">
    <div
        v-for="(item, i) in schema"
        @click="themeVal = item.themeNameEn"
        class="theme-item flex flex-col"
        :class="{ 'is-active': themeVal === item.themeNameEn }"
        :style="{'--theme-primary-color':item.primaryColor}"
        :key="`radio-${i}`">
      <el-image style="width: 70px; height: 70px" :src="item.thumbnail" fit="contain"/>
      <span class="theme-name">
        {{ item.themeNameCh }}
      </span>
      <div v-if="themeVal === item.themeNameEn" class="theme-check-icon">
        <Icon color="red" icon="ep:check" :size="20"/>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
$prefix-cls: '#{$namespace}-theme-radio-picker';

.#{$prefix-cls} {
  .theme-item {
    border-width: 1px;
    border-color: transparent;
    border-style: dashed;
    width: 80px;
    position: relative;
    cursor: pointer;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;

    .theme-name {
      color: var(--theme-primary-color);
    }

    &.is-active {
      border-color: var(--theme-primary-color);
    }

    .theme-check-icon {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
