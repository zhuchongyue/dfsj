<script lang="ts" setup>
import {useRouter} from 'vue-router';
import {useDesign} from '/@/hooks/web/useDesign';
import {ElNotification, FormInstance} from "element-plus";
import {onMounted, ref, h} from "vue"
import BasicTabs from "@/components/Tabs/BasicTabs.vue";
import {Icon} from "@dfsj/components"
import {EncryptionFactory} from "@dfsj/utils"
import LoginBasicForm from "@/views/sys/login/LoginBasicForm.vue";
import LoginPhoneForm from "@/views/sys/login/LoginPhoneForm.vue";
import LoginWXForm from "@/views/sys/login/LoginWXForm.vue";
import LoginUKeyForm from "@/views/sys/login/LoginUKeyForm.vue";
import {useUserStore} from "@/store/modules/user.ts";

const userStore = useUserStore()
const router = useRouter();
const {prefixCls} = useDesign('login');
const loading = ref(false)
const loginFormRef = ref<FormInstance>({});

/**
 * 登录方式
 */
enum LoginType {
  BASIC = 'basic',
  PHONE = 'phone',
  WX = 'wx',
  UKEY = 'ukey',
}

const loginOptions = [
  {
    label: '账户登录',
    value: LoginType.BASIC,
  },
  (() => {
    return window.globalEnvs?.phonelogin ? {
      label: '短信登录',
      value: LoginType.PHONE,
    } : null
  })(),
  (() => {
    return window.globalEnvs?.wxlogin ? {
      label: '微信登录',
      value: LoginType.WX,
    } : null
  })(),
  (() => {
    return window.globalEnvs?.ukeylogin ? {
      label: 'ukey登录',
      value: LoginType.UKEY,
    } : null
  })()
].filter(Boolean)
const def = window.globalEnvs?.defaultlogin ?? LoginType.BASIC;
const appIcon = window.globalEnvs?.appIcon;
const loginType = ref(def)

/**
 * 登录操作
 */
async function login() {
  const formData = await loginFormRef.value?.getFormData?.();
  loading.value = true;
  if (!formData) {
    loading.value = false
    return
  }
  ;

  if (loginType.value == LoginType.BASIC) {
    const Aes = EncryptionFactory.createAesEncryption({
      key: "thanks,dfsjcloud",
    })
    const password = Aes.encrypt(formData.password);
    const user = {
      username: formData.username,
      password: password,
      code: formData.captcha,
      randomStr: formData.captcha_id,
      grant_type: "password",
      scope: "server",
    }
    try {
      await userStore.login(user)
      loading.value = false
    } catch (e) {
      loading.value = false
    } finally {
      loginFormRef.value?.getCode?.();
      loading.value = false;
    }
  } else if (loginType.value == LoginType.PHONE) {
    const user = {
      mobile: formData.phone,
      smsCode: formData.code,
      grant_type: 'mobile',
      scope: 'server',
      randomStr: formData.captcha_id,
      code: formData.captcha
    };
    try {
      await userStore.phoneLogin(user);
    } catch (e) {
    } finally {
      loginFormRef.value?.getCode?.();
      loading.value = false;
    }

  }
};

function wxLoginCheck(code) {
  const formData = new FormData();
  formData.append("code", code);
  wxLogin(formData).then((res: any) => {
    console.log('res---->>>', res)
    if (res?.code == 101) {
      router.replace(PageEnum.BASE_LOGIN)
      ElNotification({
        title: '错误提示',
        message: '绑定的手机号在系统里面没有注册！',
        type: 'error',
      })
      return;
    } else if (res?.code == 99) {
      router.replace(PageEnum.BASE_LOGIN)
      ElNotification({
        title: '错误提示',
        message: '微信用户token失败！',
        type: 'error',
      })
      return;
    } else if (res?.openid && res?.code == 100) {
      // refreshCode();
      // pageObj.loading = false;
      // pageObj.isShowBind = true;
      // pageObj.wxUserId = res.wxUserId;
      addDialog({
        title: "微信绑定手机",
        width: '60rem',
        height: '500px',
        // contentRenderer: () => (ReportForm)//import("./components/reportForm/index.vue")
        contentRenderer: markRaw(defineAsyncComponent(() => import("./LoginWXBindForm.vue"))),
        // hideFooter: true
        props: {
          code: code,
          openid: res?.openid
        }
      })
    } else if (res?.access_token && res?.refresh_token) {
      userStore.setToken(res?.access_token);
      userStore.setTokenType(res?.token_type);
      userStore.setRefreshToken(res?.refresh_token);
      userStore.setExpiresIn(res?.expires_in);
      return userStore.afterLoginAction(true, res);
    }
  })
}


onMounted(() => {
  // const routeParams = signMd5Utils.parseQueryString(window.location.href);
  // if (Reflect.has(routeParams, "code")) {
  //   loginType.value = LoginType.WX
  //   wxLoginCheck(routeParams?.code)
  // }
  // // wxLoginCheck('1222')
  // console.log('routeParams', routeParams)
})
const LoginIcon = () => {
  return h(Icon, {
    icon: 'material-symbols:login-rounded'
  })
}
</script>
<template>
  <div :class="`${prefixCls} relative flex w-full h-full px-4 justify-center items-center`">
    <div class="sys-name h-full absolute">
      <img :src="appIcon" style="border: none"/>
    </div>
    <div :class="`${prefixCls}__form_wrap flex flex-col justify-center items-center`">
      <BasicTabs style="margin-bottom: 20px" v-model="loginType" :options="loginOptions"/>
      <div class="flex-1">
        <LoginBasicForm ref="loginFormRef" v-if="loginType == LoginType.BASIC"/>
        <LoginPhoneForm ref="loginFormRef" v-else-if="loginType == LoginType.PHONE"/>
        <LoginWXForm ref="loginFormRef" v-else-if="loginType == LoginType.WX"/>
        <LoginUKeyForm ref="loginFormRef" v-else-if="loginType == LoginType.UKEY"/>
        <div class="login-btn w-full" v-if="![LoginType.WX ,LoginType.UKEY].includes(loginType)">
          <el-button :icon="LoginIcon"
                     class="w-full"
                     round size="large"
                     @keyup.enter.native="login"
                     type="primary" :loading="loading" @click="login">
            登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-login;
$logo-prefix-cls: #{$namespace}-app-logo;
$countdown-prefix-cls: #{$namespace}-countdown-input;
$dark-bg: #293146;
.#{$prefix-cls} {
  min-height: 100%;
  overflow: hidden;
  background-image: url('/@/assets/images/login_bg.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;

  .sys-name {
    display: flex;
    height: $HEADER_HEIGHT;
    overflow: hidden;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);

    img {
      height: 90%;
      width: auto;
    }
  }

  &__form_wrap {
    position: relative;
    width: 505px;
    height: 545px;
    overflow: hidden;
    padding: 60px 20px 0 20px;
    box-sizing: border-box;
    background-image: url('/@/assets/images/login_form_bg.png');
    background-repeat: no-repeat;
    background-position: center center;
    // background-attachment: fixed;
    background-size: cover;

    img {
      height: 46px;
      overflow: hidden;
    }

    .el-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;

      .el-input, .el-select__wrapper {
        // width: 250px;
        height: 48px;
      }

      .el-input__inner {
        display: inline-block;
        position: relative !important;
        padding-left: 10px;

        &::before {
          display: inline-block;
          position: absolute !important;
          top: 0;
          right: 0;
          width: 2px;
          height: 40px;
          background: #5e5e5e;
          content: '1';
        }
      }

      .el-form-item {
        position: relative;
        box-sizing: border-box;
        width: 360px;
        height: 76px;
        margin: 0;
        margin-bottom: 20px;
        padding: 0 24px;
        background-image: url('/@/assets/images/login_form_input_bg.png');
        background-repeat: no-repeat;
        background-position: center center;

        // background-attachment: fixed;
        // background-attachment: fixed;
        background-size: cover;

        &:first-child {
          // background-image: url('/@/assets/images/login_form_input_1_bg.png');
          // height: 96px;
        }

        &:last-child {
          // margin-bottom: 0px;
        }
      }

      .top-input-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 20px;
        right: 0;
        bottom: 0;
        left: 0;
      }

      .top-form-item {
        height: 96px;
        background-image: url('/@/assets/images/login_form_input_1_bg.png');
      }

      .captcha-wrap {
        display: grid;
        grid-template-columns: 1fr 114px;
        gap: 5px;

        .secure {
          height: 48px;
          font-size: 16px;
          color: #fff;
          background: #3fbbbb;
        }
      }
    }

    .login-btn {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 20px;
      white-space: nowrap;

      .el-button {
        border-color: var(--el-button-hover-border-color);
        color: white;
        background: transparent;
        outline: 0;
      }
    }
  }

  @media (max-width: $screen-xl) {
    background-color: #293146;

    .#{$prefix-cls}-form {
      background-color: #fff;
    }
  }


  .#{$countdown-prefix-cls} input {
    min-width: unset;
  }
}
</style>
