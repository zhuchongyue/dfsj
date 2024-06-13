<template>
  <div class="h-300px">
    <div class="h-full overflow-hidden min-h-0">
      <Table
          :height="'100%'"
          max-height="100%"
          show-action
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :columns="columns"
          :data="dataList"
          row-key="id"
          :loading="loading"
          sortable
          :pagination="{
        total: total
      }"
          @register="tableRegister"
      >
        <template #action="{row}">
          <el-button @click="actionFn(row)">自定义操作行</el-button>
        </template>

      </Table>
    </div>


  </div>
</template>
<script setup lang="ts">
import { Table, TableColumn, TableSlotDefault,useTable } from '@dfsj/components'
import { reactive, unref,computed } from 'vue'
import { ElTag, ElButton } from 'element-plus'
const data = computed(()=>{
  let result = []
  for (let i = 0; i < 20; i++) {
    result.push({
      title: `第${i}个标题`,
      author: `作者${i}`
    },)
  }
  return result;
} )
const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    return {
      list: unref(data),
      total: unref(data).length
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const actionFn = (data: TableSlotDefault) => {
  console.log(data)
}
const columns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'title',
    label: '标题'
  },
  {
    field: 'author',
    label: '作者'
  },
  {
    field: 'action',
    label: '操作'
  }
])


</script>