<template>
  <el-checkbox
      @change="updateValue"
      :disabled="disabled"
      v-model="xvalue"
      disabled/>
</template>

<script setup  lang="ts">
import {ref, defineExpose} from 'vue'

const prop = defineProps({
  value: Boolean,
  disabled: {
    default: false,
    type: Boolean
  }
})

const xvalue = ref(prop.value)

const emit = defineEmits(["input"])
function updateValue (v) {
  xvalue.value = v
  emit('input', v)
}
</script>

