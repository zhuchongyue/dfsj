<script setup lang="ts">
import {Form, FormSchema, Table, TableColumn, useForm, useTable} from '@dfsj/components';
import {reactive, ref, unref} from "vue";
import {countPptnByDrp, findPptnReport} from "/@/views/query/api.ts";


const {tableRegister, tableMethods, tableState} = useTable({
  fetchDataApi: async () => {
    const {currentPage, pageSize} = tableState;
    const res = await countPptnByDrp({
      page: {pageNow: unref(currentPage), pageSize: unref(pageSize)},
      adcds: ["520000000000000"],
      start: "2023-03-05 14:00:00",
      end: "2024-03-06 15:00:00"
    });
    const {
      none = 0,
      over01 = 0,
      over10 = 0,
      over25 = 0,
      over50 = 0,
      over100 = 0,
      over250 = 0,
      name =''
    } = res;
    const total = none + over01 + over10 + over25 + over50 + over100 + over250;
    return {
      list: [{
        name,
        none , over01, over10 , over25 , over50 , over100 , over250,total
      }],
    };
  },
});
const {loading, dataList, total, currentPage, pageSize} = tableState;
const columns: TableColumn[] = [
  {
    label: '降雨等级[降雨量/mm]',
    field: 'name',
    align: 'center',
  },
  {
    field: 'over250',
    label: '特大暴雨[>=250]',
    align: 'center',
  },
  {
    field: 'over100',
    label: '大暴雨[100-249.9]',
    align: 'center',
  },
  {
    field: 'over50',
    label: '暴雨[50-99.9]',
    align: 'center',
  },
  {
    field: 'over25',
    label: '大雨[25-49.9]',
    align: 'center',
  },
  {
    label: '中雨[10-24.9]',
    field: 'over10',
    align: 'center',
  },
  {
    label: '小雨[0.1-9.9]',
    field: 'over01',
    align: 'center',
  },
  {
    label: '无雨[0或未报]',
    field: 'none',
    align: 'center',
  },
  {
    label: '合计',
    field: 'total',
    align: 'center',
  },
];
</script>


<template>
    <div>
      <Table
          :height="'100%'"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :header-align="'center'"
          stripe
          :columns="columns"
          :data="dataList"
          :loading="loading"
          :pagination="null"
          @register="tableRegister"
      >
      </Table>
    </div>
</template>

<style lang="scss">
</style>