<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {FormInstance} from "element-plus";
import {useDesign} from "/@/hooks/web/useDesign";
import {Icon} from "@dfsj/components";
import {useRouter} from "vue-router";
import {getCode} from "/@/api/user";
import {useCountdown, useRequest} from '@dfsj/hooks';
import {buildShortUUID} from "@dfsj/utils"
import {useUserStore} from "/@/store/modules/user";

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{required: true, message: "请输入用户名", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}]
});

const loginForm = reactive({
  username: "hfh_admin",
  password: "Dfsj@12345",
  captcha: '',
  captcha_id: '',
});


// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  console.log('formEl', formEl)
  if (!formEl) return;
  formEl.resetFields();
};

const {prefixCls} = useDesign('basic-login-form');

const { currentCount, start, isStart, restart, reset, stop } =
    useCountdown(60);

const {run, loading: captchaLoading, data} = useRequest(() => {
  const randomStr = buildShortUUID('code');
  loginForm.captcha_id = randomStr;
  return getCode({randomStr})
}, {
  manual: false
})
const img = computed(() => {
  if (!data.value) return null;
  const base64 =
      "data:image/png;base64," +
      btoa(
          new Uint8Array(data.value).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
          )
      );
  return base64;
})


function getFormData() {
  return new Promise((resolve)=>{
    loginFormRef.value.validate(async (valid) => {
      console.log('_________',valid,loginFormRef.value)
      console.log({valid})
      resolve(valid ? loginForm:null)
    })
  })
}

defineExpose({
  getFormData,
  resetForm,
  getCode:run
})

</script>
<template>
  <div
      :class="prefixCls">
    <el-form
        :hide-required-asterisk="true"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"  >
      <el-form-item prop="username"   class="top-form-item">
        <div class="top-input-wrap">
        <el-input v-model="loginForm.username" placeholder="用户名">
          <template #prefix>
            <Icon :icon="'basil:user-solid'"/>
          </template>
        </el-input>
        </div>
      </el-form-item>
      <el-form-item prop="password" >
        <el-input v-model="loginForm.password" type="password" placeholder="密码"
                  show-password
                  autocomplete="new-password">
          <template #prefix>
            <Icon :icon="'mdi:password'"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha" >
        <div class="captcha-wrap">
          <el-input
              placeholder="验证码"
              v-model="loginForm.captcha">
            <template #prefix>
              <Icon :icon="'gala:secure'" />
            </template>
          </el-input>


          <div style="height: 48px;display: flex;justify-content: center;align-items: center">
            <img @click="run" :src="img"></div>
        </div>
      </el-form-item>
    </el-form>


  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-basic-login-form;
.#{$prefixCls} {

}
</style>
