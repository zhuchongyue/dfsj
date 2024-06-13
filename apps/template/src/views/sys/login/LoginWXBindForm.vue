<script lang="ts" setup>
import {computed, h, reactive, ref, unref} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {useDesign} from "/@/hooks/web/useDesign";
import Icon from "/@/components/Icon/src/Icon.vue";
import {useRouter} from "vue-router";
import {getCaptcha, getCode, wxBind} from "/@/api/user";
import {useRequest} from '@dfsj/hooks';
import {buildShortUUID} from "@dfsj/utils";
import {useUserStore} from "/@/store/modules/user";
import {useCountdown} from "@dfsj/hooks";
import {propTypes} from "@dfsj/utils";
import {PageEnum} from "/@/enums/pageEnum";

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const bindFormRef = ref<FormInstance>();
function validatePhone(rule: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error('请输入手机号'));
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('输入手机号格式错误'));
  } else {
    callback();
  }
}
const bindRules = reactive({
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  smsCode: [{required: true, message: "请输入短信验证码", trigger: "blur"}],
  // code: [{required: true, message: "请输入图形验证码", trigger: "blur"}]
});
const props = defineProps({
  code: propTypes.string.def(''),
  openid: propTypes.string.def(''),
});
const bindForm = reactive({
  phone: null,
  smsCode: null,
  // code: '',
  randomStr: '',
  grant_type: 'mobile',
  scope: 'server',
  openid: props.openid,
});


// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  console.log('formEl', formEl)
  if (!formEl) return;
  formEl.value.resetFields();
};

const bind = async (formEl: FormInstance | undefined) => {
  bindFormRef.value.validate(async (valid) => {
    if (valid){
        wxBind(unref(bindForm)).then((res)=>{
          if (res?.access_token && res?.refresh_token) {
            userStore.setToken(res?.access_token);
            userStore.setTokenType(res?.token_type);
            userStore.setRefreshToken(res?.refresh_token);
            userStore.setExpiresIn(res?.expires_in);
            return userStore.afterLoginAction(true, res);
          }
        }).catch(()=>{
          router.replace(PageEnum.BASE_LOGIN)
          ElMessage.error('绑定出错!')
          resetForm(bindFormRef)
          run()
        })
    }

  })
};
const {prefixCls} = useDesign('login-form');

const LoginIcon = () => {
  return h(Icon, {
    icon: 'material-symbols:login-rounded'
  })
}

const {run, loading: captchaLoading, data} = useRequest(() => {
  const randomStr = buildShortUUID('code');
  bindForm.randomStr = randomStr;
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
const { currentCount, start, isStart, restart, reset, stop } =
    useCountdown(60);
function sendSmsHandle() {
  if (isStart.value) return;
  console.log('发送短信');
  bindFormRef.value.validateField('phone', (valid) => {
    console.log('发送短信', valid);
    reset();
    console.log('submit!');
    if (valid) {
      getCaptcha({ phone: bindForm.phone }).then((res) => {
        console.log('res', res);
        if(res)restart();
      });
    } else {
      console.log('error submit!');
      return false;
    }
  });
}

</script>
<template>
  <div class="h-full w-full flex justify-center items-center">
  <div
      :class="prefixCls">
    <el-form
        :hide-required-asterisk="true"
        ref="bindFormRef"
        :model="bindForm"
        label-width="90px"
        :rules="bindRules" size="large">
      <el-form-item prop="phone" label="手机号" class="top-form-item">
          <el-input v-model="bindForm.phone" placeholder="手机号">
            <template #prefix>
              <Icon :icon="'circum:mobile-4'" />
            </template>
          </el-input>
      </el-form-item>
<!--      <el-form-item prop="code" label="图形验证码">-->

<!--        <div class="captcha">-->
<!--       <div>-->
<!--         <el-input-->
<!--             placeholder="图形验证码"-->
<!--             v-model="bindForm.code">-->
<!--           <template #prefix>-->
<!--             <Icon :icon="'gala:secure'" />-->
<!--           </template>-->

<!--         </el-input>-->
<!--       </div>-->
<!--          <div><img @click="run" :src="img"></div>-->
<!--        </div>-->
<!--      </el-form-item>-->

      <el-form-item
          prop="smsCode"
          label="短信验证码"
          class="captcha-form-item"
          style="margin-bottom: 0"
      >
        <div class="captcha">
          <el-input
              v-model="bindForm.smsCode"
              placeholder="短信验证码"
          >
            <template #prefix>
              <Icon :icon="'gala:secure'" />
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

    <div class="login-btn w-full">
      <el-button :icon="LoginIcon"
                  class="w-full"
                 round size="large"
                 type="primary" :loading="loading" @click="bind(bindFormRef)">
        绑定
      </el-button>
    </div>
  </div>

  </div>
</template>

<style lang="scss" scoped>
$prefixCls: #{$namespace}-login-form;
.#{$prefixCls} {
  width: 60%;
  padding: 25px 40px 45px;
  background-color: var(--el-bg-color);
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;
  overflow: hidden;
  .el-form-item {
    //margin-bottom: 40px;
  }

  .captcha {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 120px;
    gap: 5px;
  }
  .secure {
    //height: 48px;
    font-size: 16px;
    color: #fff;
    background: #0A52CB;
  }
  .el-form-item__label{
    font-size: 18px;
    font-family: SourceHanSansCN-Bold;
    color: #141313;
  }
  .el-input__wrapper{
    box-shadow: none!important;
    //border-bottom: 1px solid var(--el-input-hover-border-color);
    border-bottom: 1px solid #212121;
    border-radius:0;
    transition: all 0.2s ease-in-out;
    font-size: 16px;
    &:hover ,  &.is-focus{
      box-shadow: none!important;
      border-bottom: 1px solid var(--el-border-color);
      transition: all 0.2s ease-in-out;
    }
  }

}
</style>
