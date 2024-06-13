<script setup lang="ts">
import {Form, FormSchema, Table, TableColumn, useForm, useTable} from '@dfsj/components';
import {reactive, ref, unref} from "vue";
import {findAdcdByPadcd, findWscdTreeByParentId} from "/@/usege/components/api.ts";
import {findPptnReport} from "/@/views/query/api.ts";
import RainDrpRangStatistics from "/@/views/query/rain/RainDrpRangStatistics.vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import dayjs from "dayjs";

const {formRegister, formMethods} = useForm();
const {
  setProps,
  delSchema,
  addSchema,
  setValues,
  setSchema,
  getComponentExpose,
  getFormItemExpose,
  getElFormExpose,
  getFormData
} = formMethods

const defParams = reactive({
  parentWscd: '1631000000',
  padcd: '520000000000000',
});

const schema = reactive<FormSchema[]>([
  {
    field: 'time',
    label: '降雨时间',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: '最新',
          value: 0,
        },
        {
          label: '最近1H',
          value: 1,
        },
        {
          label: '最近3H',
          value: 3,
        },
        {
          label: '最近9H',
          value: 9,
        },
        {
          label: '最近12H',
          value: 12,
        },
        {
          label: '最近24H',
          value: 24,
        },
        {
          label: '自定义',
          value: 25,
        },
      ],
      class: 'radio-custom-class',
      on: {
        change: (timeVal: number) => {
          let end, start;
          const valueFormat = 'YYYY-MM-DD HH:00:00';
          // 今天 8 点
          const t8 = dayjs().hour(8).minute(0).second(0).format(valueFormat);
          // 昨天 8 点
          const y8 = dayjs(t8)
              .subtract(1, 'day')
              .format(valueFormat);
          const now = dayjs().add(1, 'hour').format(valueFormat);
          let originStart = dayjs(now).isBefore(t8) ? y8 : t8;
          console.log('降雨时间', timeVal);
          if ([1, 3, 6, 9, 12, 24].includes(timeVal)) {
            end = dayjs().format('YYYY-MM-DD HH:mm:ss');
            start = dayjs()
                .subtract(Number(timeVal), 'hour')
                .format('YYYY-MM-DD HH:mm:ss');
            // order = 'dyp';
          } else {
            start = originStart;
            end = now;
          }
          if (Number(timeVal) == 25) {
            setSchema([{
              field: 'customTime',
              path: 'hidden',
              value: false,
            }])
          } else {
            setSchema([{
              field: 'customTime',
              path: 'hidden',
              value: true,
            }])
          }

          //
          start = dayjs(start).set('minute', 0).set('second', 0).format(valueFormat);
          const minute = dayjs(end).get('minute');
          if (+minute > 0) {
            end = dayjs(end)
                .add(1, 'hour')
                .set('minute', 0)
                .set('second', 0)
                .format(valueFormat);
          } else {
            end = dayjs(end).set('minute', 0).set('second', 0).format(valueFormat);
          }

          setValues([{
            customTime: [start, end]
          }])

          console.log({start, end})
        }
      }
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'customTime',
    label: '统计时间',
    component: 'CustomDatePicker',
    value: [dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')],
    componentProps: {
      type: 'datetimerange',
      format: "YY-MM-DD HH:mm",
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      clearable: false,
      unlinkPanels: true
    },
    hidden: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'area',
    label: '行政区域',
    component: 'Cascader',
    value: ['520100000000000'],
    componentProps: {
      // options: options3,
      placeholder: '选择行政区域',
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
      span: 24,
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
      span: 24,
    },
    componentProps: {
      placeholder: '选择流域',
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
    field: 'keyword',
    label: '关键字',
    component: 'Input',
    formItemProps: {},
    colProps: {
      span: 24,
    },
  },
]);
const formRef = ref(null);

const {prefixCls} = useDesign('rain-real-time-statistics-page');

const {tableRegister, tableMethods, tableState} = useTable({
  fetchDataApi: async () => {
    const {currentPage, pageSize} = tableState;
    const res = await findPptnReport({
      page: {pageNow: unref(currentPage), pageSize: unref(pageSize)},
      adcds: ["520000000000000"],
      start: "2023-03-05 14:00:00",
      end: "2024-03-06 15:00:00"
    });
    console.log('res', res);
    return {
      list: res?.rows ?? [],
      total: res?.total ?? 0,
    };
  },
});
const {loading, dataList, total, currentPage, pageSize} = tableState;
const columns: TableColumn[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    field: '',
  },
  {
    field: 'adnm',
    label: '行政区',
    align: 'center',
  },
  {
    field: 'stcd',
    label: '站码',
    align: 'center',
  },
  {
    field: 'stnm',
    label: '站名',
    align: 'center',
  },
  {
    field: 'rvnm',
    label: '河流',
    align: 'center',
  },
  {
    label: '水系',
    field: 'hnnm',
  },
  {
    label: '昨日雨量',
    field: 'dypYstd',
    width: '110px',
    sortable: true,
  },
  {
    label: '今日雨量',
    field: 'drp',
    width: '110px',
    sortable: true,
  },
  {
    label: '累积雨量',
    field: 'dyp',
    width: '110px',
    sortable: true,
  },
  {
    label: '最大时间段雨量',
    field: 'maxDrp',
    width: '150px',
    sortable: true,
  },
  {
    label: '时段长(h)',
    field: 'intv',
  },
  {
    label: '出现时间',
    minWidth: '120px',
    field: 'maxtime',
  },
  {
    label: '数据来源',
    field: 'source',
  },
  {
    label: '站址',
    field: 'address',
  },
];
</script>


<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__table`">
      <RainDrpRangStatistics/>
      <Table
          :height="'100%'"
          max-height="100%"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
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
    </div>
    <div class="filter-form-wrapper">
      <Form
          label-position="top"
          :isCustom="false"
          ref="formRef"
          :is-col="true"
          @register="formRegister"
          :schema="schema"
          label-width="auto"
      />
    </div>
  </div>
</template>
<style lang="scss">
$prefix-cls: #{$namespace}-rain-real-time-statistics-page;
.#{$prefix-cls} {
  display: grid;
  grid-template-columns: 1fr 15%;
  padding: 10px;
  gap: 30px;
  height: calc(100% - $FOOTER_HEIGHT);
  min-height: 0;
  box-sizing: border-box;

  &__table {
    display: grid;
    grid-template-rows:100px 1fr;
    min-height: 0;
    height: 100%;
    overflow: hidden;
  }

  .filter-form-wrapper {
    width: 100%;
    height: 100%;
    min-width: 0;
    overflow: hidden;
  }

  .el-radio-group {
    &.radio-custom-class {
      .el-radio {
        width: 50%;
        margin-right: 0;
      }
    }

  }

}
</style>