<template>
  <div class="h-200px overflow-hidden">
    <Table :columns="columns" :data="data" />
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { Table, TableColumn } from '@dfsj/components'

const columns = reactive<TableColumn[]>([
  {
    field: 'title',
    label: '标题'
  },
  {
    field: 'author',
    label: '作者'
  }
])

const data = reactive([
  {
    title: '第一个',
    author: '张三'
  },
  {
    title: '第二个',
    author: '李四'
  },
  {
    title: '第三个',
    author: '王五'
  }
])
</script>