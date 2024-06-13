<script setup lang="tsx">

import {Form, FormSchema, useForm} from "@dfsj/components";
import {reactive} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {getDeptListAPi, getRoleListApi} from "/@/api/system.ts";
import {useValidator} from "/@/hooks/web/useValidator.ts";
import {FormItemProp} from "element-plus";
import {useRootStoreWithOut} from "/@/store/root.ts";

const {prefixCls} = useDesign('users-edit-components-page');
const {required, phone, email, password} = useValidator()
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
    formItemProps: {
      rules: [required()],
    },
    componentProps: {
      style: {
        width: '100%'
      }
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    formItemProps: {
      rules: [required(),password()],
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'phone',
    label: '手机',
    component: 'Input',
    formItemProps: {
      rules: [phone()],
    },
    componentProps: {
      style: {
        width: '100%'
      },
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'deptId',
    label: '所在机构',
    component: 'Cascader',
    formItemProps: {
      rules: [required()],
    },
    componentProps: {
      style: {
        width: '100%'
      },
      props: {
        value: 'deptId',
        label: 'deptName',
      }
    },
    optionApi: async () => {
      const res = await getDeptListAPi();
      console.log('getDeptListAPi', res)
      return res;
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    formItemProps: {
      rules: [email()],
    },
    componentProps: {
      style: {
        width: '100%'
      },
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    formItemProps: {
      rules: [required()],
    },
    componentProps: {
      style: {
        width: '100%'
      },
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'gender',
    label: '性别',
    component: 'Select',
    formItemProps: {},
    componentProps: {
      options: [{
        value: 'm',
        label: '男'
      },
        {
          value: 'f',
          label: '女'
        },

      ]
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'roles',
    label: '用户角色',
    component: 'Select',
    formItemProps: {
      rules: [required()],
    },
    componentProps: {
      multiple: true,
      style: {
        width: '100%'
      },
      props: {
        value: 'roleId',
        label: 'roleName',
      },
    },
    colProps: {
      span: 12,
    },
    optionApi: async () => {
      const res = await getRoleListApi();
      console.log('res', res)
      return res;
    },
  },
  {
    field: 'tel',
    label: '固定电话',
    component: 'Input',
    formItemProps: {},
    componentProps: {
      style: {
        width: '100%'
      },
    },
    colProps: {
      span: 12,
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
                  <el-button type="primary" onClick={handleCancel}> 取消</el-button>
                  <el-button type="success" onClick={handleSubmit} class="ml-2"> 确定</el-button>
                </div>
              </>
          )
        }
      }
    }
  }
]);
const formValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  // console.log(prop, isValid, message)
}
const formValidation = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate((isValid) => {
    console.log(isValid)
  })
}

function handleSubmit() {
  formValidation()
}

function handleCancel() {
  useRootStoreWithOut().window.hide('edit-user');
}
</script>

<template>
  <div :class="prefixCls">
    <Form
        label-position="left"
        :isCustom="false"
        ref="formRef"
        :is-col="true"
        @register="formRegister"
        :schema="schema"
        label-width="auto"
        @validate="formValidate"
    />
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-users-edit-components-page;
.#{$prefix-cls} {
  background: white;
  padding: 20px;
}
</style>