<template>
  <div class="h-100px">
    <div class="h-full overflow-hidden min-h-0">
      <Form
          label-position="left"
          :isCustom="false"
          ref="formRef"
          :is-col="true"
          @register="formRegister"
          :schema="schema"
          label-width="auto"
      />
      <el-button @click.stop="handleSumbit">提交</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {reactive, ref, watch} from 'vue';
import {ColProps, Form, FormSchema, useForm} from '@dfsj/components';
import {ElButton} from 'element-plus';


function findAdcdByPadcd() {
  return [
    {
      "adcd": "520000000000000",
      "adnm": "贵州省",
      "level": 2,
      "padcd": "520000000000000",
    },
    {
      "adcd": "520100000000000",
      "adnm": "贵阳市",
      "level": 2,
      "padcd": "520000000000000",
    },
    {
      "adcd": "520400000000000",
      "adnm": "安顺市",
      "level": 2,
      "padcd": "520000000000000",
    },
    {
      "adcd": "520500000000000",
      "adnm": "毕节市",
      "level": 2,
      "padcd": "520000000000000",
    }
  ]
}

function findWscdTreeByParentId() {
  return [{
    "wscd": "1631001001",
    "wsnm": "红枫",
    "pwscd": "1631001000",
  },
    {
      "wscd": "1631001002",
      "wsnm": "百花",
      "pwscd": "1631001000",
    },
    {
      "wscd": "1631001003",
      "wsnm": "修文",
      "pwscd": "1631001000",
    },
    {
      "wscd": "1631001004",
      "wsnm": "窄巷口",
      "pwscd": "1631001000",
    },
    {
      "wscd": "1631001005",
      "wsnm": "红岩",
      "pwscd": "1631001000",
    }]
}

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
const schema = reactive<FormSchema[]>([
  {
    field: 'area',
    label: '行政区域',
    component: 'Cascader',
    value: ['520100000000000'],
    componentProps: {
      placeholder: '选择行政区域',
      props: {
        // multiple: true,
        checkStrictly: true,
        value: 'adcd',
        label: 'adnm',
        lazy: true,
        lazyLoad: async (node, resolve) => {
          const padcd = node?.value;
          if (!padcd) resolve([]);
          const res = await findAdcdByPadcd({padcd: padcd ?? defParams.padcd});
          resolve(res ?? []);
        },

        // children: true,
      },
    },
    colProps: {
      span: 6,
    },
  },
  {
    field: 'wscd',
    label: '流域',
    component: 'Cascader',
    colProps: {
      span: 6,
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
    field: 'resource',
    label: '数据来源',
    component: 'CheckboxGroup',
    // value: [],
    colProps: {
      span: 6,
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

const formRef = ref(null);
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