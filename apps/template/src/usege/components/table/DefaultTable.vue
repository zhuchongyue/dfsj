<script setup lang="tsx">
import {Form, FormSchema, Table, TableColumn, useForm, useTable} from '@dfsj/components';
// import { getTableListApi } from '@/api/table'
// import { TableData } from '@/api/table/types'
import {ElButton} from 'element-plus';
import {
  findAdcdByPadcd,
  findObjectDataByPage,
  findRdResultByPage,
  findWscdTreeByParentId,
} from '/src/usege/components/api.ts';
import {reactive, ref, unref, watch} from 'vue';

interface Params {
  pageIndex?: number;
  pageSize?: number;
}

const columns: TableColumn[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    field: '',
  },
  {
    field: 'address',
    label: '区域',
    align: 'center',
  },
  {
    field: 'monm',
    label: '站名',
    align: 'center',
  },
  {
    field: 'wsnm',
    label: '水系',
    sortable: true,
    align: 'center',
  },
  {
    field: 'sttype',
    label: '水库规模',
    align: 'center',
    // formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
    //   return h(
    //     ElTag,
    //     {
    //       type: cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger',
    //     },
    //     () => (cellValue === 1 ? '重要' : cellValue === 2 ? '好' : '一般')
    //   );
    // },
  },
  {
    field: 'action',
    label: '操作',
    align: 'center',
    slots: {
      default: (data) => {
        return (
            <ElButton
                type="primary"
                onClick={() => actionFn(data)}
            >
              操作
            </ElButton>
        );
      },
    },
  },
];
const schema = reactive<FormSchema[]>([
  {
    field: 'area',
    label: '行政区域',
    component: 'Cascader',
    value: ['520100000000000'],
    componentProps: {
      // options: options3,
      props: {
        // multiple: true,
        checkStrictly: true,
        value: 'adcd',
        label: 'adnm',
        lazy: true,
        lazyLoad: async (node, resolve) => {
          console.log('动态加载', node);
          const padcd = node?.value;
          if (!padcd) resolve([]);
          const res = await findAdcdByPadcd({padcd: padcd ?? defParams.padcd});
          resolve(res ?? []);
        },

        // children: true,
      },
    },
    colProps: {
      span: 5,
    },
    // optionApi: async () => {
    //   const res = await findAdcdByPadcd(defParams);
    //   console.log('行政区域', res);
    //   return res;
    // },
  },
  {
    field: 'wscd',
    label: '流域',
    component: 'Cascader',
    colProps: {
      span: 6,
    },
    componentProps: {
      props: {
        // multiple: true,
        checkStrictly: true,
        value: 'wscd',
        label: 'wsnm',
      },
    },
    optionApi: async () => {
      const res = await findWscdTreeByParentId(defParams);
      console.log('re流域s', res);
      return res;
    },
  },
  {
    field: 'resource',
    label: '数据来源',
    component: 'CheckboxGroup',
    // value: [],
    colProps: {
      span: 5,
    },
    componentProps: {
      options: [
        {
          label: '水利',
          value: '1',
        },
        {
          label: '气象',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'keyword',
    colProps: {
      span: 6,
    },
    label: '关键字',
    component: 'Input',
    formItemProps: {},
  },
]);

const {tableRegister, tableMethods, tableState} = useTable({
  fetchDataApi: async () => {
    const {currentPage, pageSize} = tableState;
    const res = await findObjectDataByPage({
      area: "520000000000000",
      type: {motype: "1", sttypes: [1, 2, 3, 4, 5]},
      end: "2024-07-23 24:00:00",
      start: "2024-07-23 00:00:00",
      page: {pageNow: unref(currentPage), pageSize: unref(pageSize)},
      // type: { motype: '1', sttypes: [1, 2, 3, 4, 5] },
    });

    console.log('res', res);
    return {
      list: res?.rows ?? [],
      total: res?.total ?? 0,
    };
  },
});
const {loading, dataList, total, currentPage, pageSize} = tableState;
const {
  setProps: setTableProps,
  setColumn,
  getElTableExpose,
  addColumn,
  delColumn,
  refresh,
} = tableMethods;

const actionFn = (data: any) => {
  console.log(data);
};
const canShowPagination = ref(true);

function rowClickHandle(ev) {
  console.log('行点击', ev);
}

const formRef = ref(null);
const {formRegister, formMethods} = useForm();
const defParams = reactive({
  parentWscd: '1631000000',
  padcd: '520000000000000',
});

const {
  setProps,
  delSchema,
  addSchema,
  setValues,
  setSchema,
  getComponentExpose,
  getFormItemExpose,
  getElFormExpose,
  getFormData,
} = formMethods;
const formModel = reactive({
  rainTime: 0,
  area: '',
  wscd: '',
  resource: 1,
  keyword: '',
});
watch(
    () => formModel,
    (value, oldValue, onCleanup) => {
      console.log('form', value, oldValue);
    },
    {
      deep: true,
      immediate: true,
    }
);

async function handleSumbit() {
  const elFormExpose = await getElFormExpose();
  const elFormData = await getFormData();
  console.log('elFormExpose', elFormExpose);
  console.log('elFormData', elFormData);
}
</script>

<template>
  <div class="h-full w-full bg-white flex flex-col table-form-view">
    <div>
      <Form
          label-position="left"
          ref="formRef"
          :is-col="true"
          @register="formRegister"
          :schema="schema"
          label-width="auto"
      >
        <el-button @click.stop="handleSumbit">提交</el-button>
      </Form>
    </div>
    <div
        style="min-height: 0"
        class="table-container-wrap"
    >
      <Table
          :height="'100%'"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          showAction
          :header-align="'center'"
          stripe
          :columns="columns"
          :data="dataList"
          :loading="loading"
          :pagination="
          canShowPagination
            ? {
                total: total,
              }
            : undefined
        "
          @register="tableRegister"
          @refresh="refresh"
          @row-click="rowClickHandle"
          :defaultSort="{ prop: 'display_time', order: 'descending' }"
      >
        <template #type="{ row }">
          {{ row.type == 1 ? '规则调度' : '优化调度' }}
        </template>
        <template #programmeInfo="{ row }">
          {{ row.programmeInfo?.targetNames }}
        </template>
      </Table>
    </div>
  </div>
</template>

<style lang="scss">
.table-form-view {
  padding: 30px;
  overflow: hidden;
  //width: 500px;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  .table-container-wrap {
    height: 100%;
    flex: 1;
    width: 100%;
    overflow: hidden;
  }
}

.el-form-item {
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  margin-left: 0 !important;
}
</style>
