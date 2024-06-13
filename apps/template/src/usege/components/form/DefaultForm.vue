<script setup lang="tsx">
import {reactive, ref, watch} from 'vue';
import {Form, FormSchema, useForm} from '@dfsj/components';
import {ElButton} from 'element-plus';
import {findAdcdByPadcd, findWscdTreeByParentId} from '/src/usege/components/api.ts';

const { formRegister, formMethods } = useForm();
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
        // options: options3,
        placeholder:'选择行政区域',
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
            const res = await findAdcdByPadcd({ padcd: padcd ?? defParams.padcd });
            resolve(res ?? []);
          },

          // children: true,
        },
      },
      colProps: {
        span: 6,
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
        placeholder:'选择流域',
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

<template>
  <div class="h-full w-full bg-white form-demo">
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
</template>

<style lang="scss" scoped>
  .form-demo {
    padding: 30px;
  }

  //form {
  //  width: 400px;
  //  height: 600px;
  //}

  .el-form-item {
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    margin-left: 0 !important;
  }

  .el-input {
    width: 250px !important;
  }
</style>
