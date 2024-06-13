<template>
  <div class="h-50px">
    <div class="h-full overflow-hidden min-h-0">
      <Form :schema="schema" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Form, FormSchema } from '@dfsj/components'
import { reactive } from 'vue'

const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: '姓名',
    component: 'Input'
  }
])
</script>