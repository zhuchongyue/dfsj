<script lang="ts" setup>
import {compProps} from '/@/components/Explorer';
import {Table, TableColumn, useTable} from "@dfsj/components";

const props = defineProps(compProps);
const columns: TableColumn[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    field: '',
  },
  {
    field: 'duties',
    label: '类型',
    align: 'center',
  },
  {
    field: 'name',
    label: '人员',
    align: 'center',
  },
  {
    field: 'genderStr',
    label: '性别',
    align: 'center',
  },
  {
    field: 'title',
    label: '职务',
    align: 'center',
  },
  {
    label: '手机号',
    align: 'center',
    field: 'phone',
    minWidth: '110px',
  },
];
const {tableRegister, tableMethods, tableState} = useTable({
  fetchDataApi: async () => {
    const res = await props.options
        .loader({target: props.target});
    return {
      list: res ?? [],
      total: res?.length ?? 0,
    };
  },
});
const {loading, dataList, total} = tableState;
</script>

<template>
  <Table
      :height="'100%'"
      max-height="100%"
      showAction
      :header-align="'center'"
      stripe
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination=" {
                total: total,
              }
        "
      @register="tableRegister"
      :defaultSort="{ prop: 'display_time', order: 'descending' }"
  >
  </Table>
</template>
