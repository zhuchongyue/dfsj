<template>
  <el-color-picker
      :disabled="disabled"
      @change="emit('input', xvalue)"
      v-model="xvalue" />
</template>


<script setup lang="ts">
import {ref, onMounted} from 'vue'

const  prop = defineProps({
  value: String,
  disabled: {
    default: false,
    type: Boolean
  }
})

const xvalue = ref()
const emit = defineEmits(["input"])
onMounted( () => {
  xvalue.value = prop.value
})

</script>

<style>
</style>
