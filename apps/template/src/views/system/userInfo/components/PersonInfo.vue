<script setup lang="ts">
import {useUserStore} from "/@/store/modules/user.ts";
import {computed, reactive} from "vue";
import {Form, FormSchema, useForm} from "@dfsj/components";
import {useRootStoreWithOut} from "/@/store/root.ts";
import Setting from "/@/components/Setting/src/Setting.vue";
import EmphasizeTitle from "/@/components/Title/EmphasizeTitle.vue";
const userStore = useUserStore();
const user = computed(()=>userStore.userInfo);
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
    label: '姓名',
    component: 'Input',
    formItemProps: {},
    value:user.value?.realName,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'genderStr',
    label: '性别',
    component: 'Input',
    formItemProps: {},
    value:user.value?.genderStr,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'deptName',
    label: '所在机构',
    component: 'Input',
    formItemProps: {},
    value:user.value?.deptName,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'phone',
    label: '联系电话',
    component: 'Input',
    formItemProps: {},
    value:user.value?.phone,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'descr',
    label: '个人描述',
    component: 'Input',
    formItemProps: {},
    value:user.value?.descr,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    formItemProps: {},
    value:user.value?.email,
    colProps: {
      span: 24,
    },
  }, {
    field: 'rolesStr',
    label: '角色',
    component: 'Input',
    formItemProps: {},
    value:user.value?.rolesStr,
    colProps: {
      span: 24,
    },
  },

]);

function updatePwd() {
  useRootStoreWithOut().window.open({
    id: 'user-pwd',
    title: '响应反馈详细',
    sizes: ['40rem', '40rem'],
    content: () => import('./UserPsw.vue'),
    // titleAfter: titleAfter,
    props: {
      responseId: 'xxx',
    },
    footer:false
  });
}
function logout() {
  
}
</script>

<template>
<div>
   <EmphasizeTitle :title="'个人信息'" />
  <div class="flex flex-col items-center top-info">
<!--    <img class="mt-5" src="/images/avatar.png" height="100"/>-->
    <span class="user-name">{{user.userName}}</span>
    <span class="update-pwd cursor-pointer" @click="updatePwd">修改密码</span>
    <span class="logout cursor-pointer" @click="logout">退出登陆</span>
  </div>
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
</div>
</template>

<style scoped lang="scss">

</style>