<script setup lang="tsx">
import {Form, FormSchema, Table, TableColumn, useForm, useTable} from '@dfsj/components';
import {reactive, ref, unref} from "vue";
import {findAdcdByPadcd, findWscdTreeByParentId} from "/@/usege/components/api.ts";
import {findRiverReport} from "/@/views/query/api.ts";
import dayjs from "dayjs";
import {findAdcdTreeByLevel} from "/@/api/adcd.ts";
import {useDesign} from "/@/hooks/web/useDesign.ts";
const {prefixCls} = useDesign('rain-real-time-page');

const {formRegister, formMethods} = useForm();
const defParams = reactive({
  parentWscd: '1631000000',
  padcd: '520000000000000',
});
const { getElFormExpose, getFormData, getFormExpose } = formMethods
const schema = reactive<FormSchema[]>([
  {
    field: 'keyword',
    label: '关键字',
    component: 'Input',
    formItemProps: {},
    colProps: {
      span: 24,
    },
  },
  {
    field: 'time',
    label: '',
    component: 'CustomDatePicker',
    value:[dayjs().subtract(3,'day').format('YYYY-MM-DD HH:mm:ss') , dayjs().format('YYYY-MM-DD HH:mm:ss')],
    componentProps: {
      type: 'datetimerange',
      format: "YY-MM-DD HH:mm",
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      clearable: false,
      unlinkPanels: true
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'area',
    label: '',
    component: 'Cascader',
    value: ['520100000000000'],
    componentProps: {
      placeholder: '选择行政区域',
      showAllLevels: false,
      collapseTags: true,
      collapseTagsTooltip: true,
      maxCollapseTags: 2,
      class:'w-full',
      props: {
        multiple: true,
        value: 'adcd',
        label: 'adnm',
      },
    },
    optionApi: async () => {
      const res = await findAdcdTreeByLevel({
        parentAdcd:'520000000000000',
        self:1,
        level:3
      });
      console.log('行政区域',res)
      return res;
    },
    colProps: {
      span: 24,
    },
  },

  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
              <>
                <div class="w-[100%]">
                  <el-button type="primary" onClick={handleSearch}> 查询</el-button>
                  <el-button type="success" class="ml-2"> 导出</el-button>
                </div>
              </>
          )
        }
      }
    }
  }
]);
const formRef = ref(null);


const {tableRegister, tableMethods, tableState} = useTable({
  fetchDataApi: async () => {
    const {currentPage, pageSize} = tableState;
    const form = await getFormData();
    console.log('form',form)
    const res = await findRiverReport({
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
const { setProps, setColumn, getElTableExpose, addColumn, delColumn, refresh } = tableMethods
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
    label: '时间',
    field: 'tm',
    width: '110px',
    sortable: true,
  },
  {
    label: '水位',
    field: 'z',
    sortable: true,
  },
  {
    label: '流量(m³/s)',
    field: 'q',
    sortable: true,
  },
  {
    label: '警戒水位(m)',
    field: 'wrz',
  },
  {
    label: '超警描述',
    minWidth: '120px',
    field: 'warning',
  },
  {
    label: '距警戒水位(m)',
    field: 'offset',
  },
  {
    label: '水势',
    field: 'wptn',
  },
  {
    label: '涨率',
    field: 'rorf',
  },
  {
    label: '水位变幅',
    field: 'fros',
  },
  {
    label: '数据来源',
    field: 'datasource',
  },
  {
    label: '站址',
    field: 'address',
  },
];

/**
 * 查询
 */

async function handleSearch() {
  const form = await getFormData();
  const formRef = await getElFormExpose()

  console.log('form',form)
  console.log('formMethods',formMethods)
  console.log('formRef',formRef)
  formRef?.validate(async (valid) => {
    refresh()
    if (valid) {
      try {
        // loading.value = true
      } finally {
        // loading.value = false
      }
    }
  })
}
</script>


<template>
  <div :class="prefixCls">
    <div class="w-full min-w-0">
      <div class="text-center">实时雨情</div>
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
$prefix-cls: #{$namespace}-rain-real-time-page;
.#{$prefix-cls} {
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 15%;
  padding: 10px;
  gap: 30px;

  .filter-form-wrapper {
    //width: 100%;
    //height: 100%;
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