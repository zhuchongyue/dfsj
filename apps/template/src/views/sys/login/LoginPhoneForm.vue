<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {FormInstance} from "element-plus";
import {useDesign} from "/@/hooks/web/useDesign";
import {Icon} from "@dfsj/components"
import {useRouter} from "vue-router";
import {getCaptcha, getCode} from "/@/api/user";
import {useRequest} from '@dfsj/hooks';
import {buildShortUUID} from "@dfsj/utils"
import {useUserStore} from "/@/store/modules/user";
import {useCountdown} from "@dfsj/hooks";

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const loginFormRef = ref<FormInstance>();

function validatePhone(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入手机号'));
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('输入手机号格式错误'));
  } else {
    callback();
  }
}

const loginRules = reactive({
  phone: [{validator: validatePhone, trigger: 'blur'}],
  code: [{required: true, message: '请输入短信验证码', trigger: 'blur'}],
  captcha: [{required: true, message: '请输入图形验证码', trigger: 'blur'}],
});

const loginForm = reactive({
  phone: null,
  code: null,
  grant_type: 'mobile',
  scope: 'server',


  captcha: '',
  captcha_id: '',
});
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

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  console.log('formEl', formEl)
  if (!formEl) return;
  formEl.resetFields();
};

//倒计时
const {currentCount, start, isStart, restart, reset, stop} =
    useCountdown(60);

function sendSmsHandle() {
  if (isStart.value) return;
  console.log('发送短信');
  loginFormRef.value.validateField('phone', (valid) => {
    console.log('发送短信', valid);
    reset();
    console.log('submit!');
    if (valid) {
      getCaptcha({phone: loginForm.phone}).then((res) => {
        console.log('res', res);
        if (res) restart();
      });
    } else {
      console.log('error submit!');
      return false;
    }
  });
}

const {prefixCls} = useDesign('phone-login-form');

function getFormData() {
  return new Promise((resolve) => {
    loginFormRef.value.validate(async (valid) => {
      console.log('_________', valid, loginFormRef.value)
      console.log({valid})
      resolve(valid ? loginForm : null)
    })
  })
}

defineExpose({
  getFormData,
  resetForm,
  getCode: run
})
</script>
<template>
  <div
      :class="prefixCls">
    <el-form
        :hide-required-asterisk="true"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules">


      <el-form-item prop="phone" class="top-form-item">
        <div class="top-input-wrap">
          <el-input v-model="loginForm.phone" placeholder="手机号">
            <template #prefix>
              <Icon :icon="'circum:mobile-4'"/>
            </template>
          </el-input>
        </div>
      </el-form-item>

      <!--      图形验证码-->
      <el-form-item prop="captcha">
        <div class="captcha-wrap">
          <el-input
              placeholder="图形验证码"
              v-model="loginForm.captcha">
            <template #prefix>
              <Icon :icon="'gala:secure'"/>
            </template>
          </el-input>
          <div style="height: 48px;display: flex;justify-content: center;align-items: center">
            <img @click="run" :src="img"></div>
        </div>
      </el-form-item>


      <el-form-item
          prop="code"
      >
        <div class="captcha-wrap">
          <el-input
              v-model="loginForm.code"
              placeholder="短信验证码"
          >
            <template #prefix>
              <Icon :icon="'gala:secure'"/>
            </template>
          </el-input>
          <span
              @click="sendSmsHandle"
              :class="[
                  'secure flex items-center justify-center',
                  { 'cursor-not-allowed': isStart },
                  { 'cursor-pointer': !isStart },
                ]"
          >
                {{ isStart ? `${currentCount}s后重新获取` : '获取验证码' }}
              </span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-phone-login-form;
.#{$prefixCls} {
  .secure {
    //height: 48px;
    font-size: 16px;
    color: #fff;
    background: #0A52CB;
  }
}
</style>
