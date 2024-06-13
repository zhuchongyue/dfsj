<script setup lang="ts">
import { ref, unref, computed, watch } from 'vue'
import { ElInput } from 'element-plus'
import propTypes  from '../../../utils/propTypes'
import { zxcvbn } from '@zxcvbn-ts/core'
import type { ZxcvbnResult } from '@zxcvbn-ts/core'



const prefixCls =('ec-component-input-password')

const props = defineProps({
  // 是否显示密码强度
  strength: propTypes.bool.def(false),
  modelValue: propTypes.string.def('')
})

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueRef)) return
    valueRef.value = val
  }
)


const emit = defineEmits(['update:modelValue'])

// 设置input的type属性
const textType = ref<'password' | 'text'>('password')

// 输入框的值
const valueRef = ref(props.modelValue)

// 监听
watch(
  () => valueRef.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)

// 获取密码强度
const getPasswordStrength = computed(() => {
  const value = unref(valueRef)
  const zxcvbnRef = zxcvbn(unref(valueRef)) as ZxcvbnResult
  return value ? zxcvbnRef.score : -1
})
</script>

<template>
  <div :class="[prefixCls, `${prefixCls}--default`]">
    <ElInput v-bind="$attrs" v-model="valueRef" showPassword :type="textType" />
    <div
      v-if="strength"
      :class="`${prefixCls}__bar`"
      class="relative h-6px mt-10px mb-6px mr-auto ml-auto"
    >
      <div :class="`${prefixCls}__bar--fill`" :data-score="getPasswordStrength"></div>
    </div>
  </div>
</template>

