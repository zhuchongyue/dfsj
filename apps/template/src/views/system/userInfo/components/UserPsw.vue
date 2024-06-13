<script setup lang="ts">
import {useUserStore} from "/@/store/modules/user.ts";
import {computed, reactive} from "vue";
import {Form, FormSchema, useForm} from "@dfsj/components";

const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
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
} = formMethods;
const schema = reactive<FormSchema[]>([
  {
    field: 'realName',
    label: '原有密码',
    component: 'InputPassword',
    formItemProps: {},
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'genderStr',
    label: '新密码',
    component: 'InputPassword',
    formItemProps: {},
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'deptName',
    label: '二次确定密码',
    component: 'InputPassword',
    formItemProps: {},
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
    },
    colProps: {
      span: 24,
    },
  },


]);
</script>

<template>
  <div>
    <Form
        label-position="left"
        :isCustom="false"
        ref="formRef"
        :is-col="true"
        @register="formRegister"
        :schema="schema"
        label-width="auto"
    />
  </div>
</template>

<style scoped lang="scss">

</style>