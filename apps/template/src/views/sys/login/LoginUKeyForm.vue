<script lang="ts" setup>
import {h, onBeforeMount, onMounted, reactive, ref, unref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "/@/store/modules/user";
import {useDesign} from "/@/hooks/web/useDesign";
import {ElNotification} from "element-plus";
import {Icon} from "@dfsj/components";

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const isPlugins = ref(false)

const {prefixCls} = useDesign('ukey-form');
const loginForm = reactive({
  pin: '',
  sn: '',
  options: '',
  random: '',
})

enum UKEY {
  P1S,
  P7,
  P7S
}

const type = ref(UKEY.P7)

function getPlugins() {
  try {
    let version = JIT_GW_ExtInterface?.GetVersion?.() ?? 0;
    console.log('version', version)
    isPlugins.value = !!version
  } catch (e) {
    console.log('getPlugins', e)
  } finally {
    if (!isPlugins.value) {
      ElNotification({
        title: 'UKey登录提示',
        message: '插件初始化失败，请确认是否已安装插件；如果未安装，请安装!',
        type: 'warning',
      })
    }
  }
}

/**
 * 下载的提示框
 */
onBeforeMount(() => {
  getPlugins()
})

function initialize() {
  try {
    JIT_GW_ExtInterface?.Finalize?.();
    let options = JIT_AUTHEN?.getCertList?.() ?? [];
    console.log('证书信息', options)
    loginForm.options = options;
    loginForm.sn = loginForm.options?.[0].sn;
    console.log('loginForm', loginForm)
  } catch (e) {

  }
}

onMounted(() => {
  initialize()
})

function authentication() {
  getPlugins();
  if (!isPlugins.value) return;
  //1发起随机数请求
  let random = JIT_AUTHEN?.random?.();
  loginForm.random = random;
  console.log('随机数', random)
  if (!random) {
    return ElNotification({
      title: 'UKey登录提示',
      message: '随机数获取失败!',
      type: 'error',
    })
  }
  const _type = unref(type);
  let authResult = null;
  switch (_type) {
    case UKEY.P1S:
      // 2对随机数做p1签名
      let signObj = JIT_AUTHEN.AuthP1Sign_certSelect(random, loginForm.sn, loginForm.pin);
      //3请求网关认证
      authResult = JIT_AUTHEN.P1certAuth(random, signObj.signdata, signObj.cert, signObj.algid);
      break;
    case UKEY.P7:
      let P7 = JIT_AUTHEN.AuthP7Sign(random);
      authResult = JIT_AUTHEN.P7certAuth(random, P7);
      break;
    case UKEY.P7S:
      let P7S = JIT_AUTHEN.AuthP7Sign_certSelect(random, loginForm.sn);
      authResult = JIT_AUTHEN.P7certAuth(random, P7S);
      break;
  }
  console.log('认证结果', authResult)
  if (!authResult) {
    return ElNotification({
      title: 'UKey登录提示',
      message: '认证失败!',
      type: 'error',
    })
  }
  if (authResult) {
    const res = authResult;
    if (res?.access_token && res?.refresh_token) {
      userStore.setToken(res?.access_token);
      userStore.setTokenType(res?.token_type);
      userStore.setRefreshToken(res?.refresh_token);
      userStore.setExpiresIn(res?.expires_in);
      return userStore.afterLoginAction(true, res);
    }
  }
}

const AuthIcon = () => {
  return h(Icon, {
    icon: 'mdi:key'
  })
}
</script>
<template>
  <div :class="prefixCls">
    <div>
      <el-form :model="loginForm">
        <!--        用户-->
        <el-form-item class="top-form-item">
          <div class="top-input-wrap">
            <el-input v-model="loginForm.random" disabled placeholder="用户（点击认证后将随机生成）"></el-input>
          </div>
        </el-form-item>
        <!--证书-->
        <el-form-item >
          <el-select style="width: 100%;" v-model="loginForm.sn" placeholder="请选择证书">
            <el-option v-for="item in loginForm.options"
                       :key="item.sn"
                       :label="item.dn"
                       :value="item.sn"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

    </div>
    <div :class="`${prefixCls}__plugin`">
      <span class="isInstall" :style="{'color':isPlugins?'#0A52CB':'red'}">
         {{ isPlugins ? '已安装' : '未安装' }}
      </span>
      <div class="download">
        <div>PNXClient插件：<a href="/ukey/PNXClient.exe" target="_blank" class="access">下载</a></div>
        <div>HaiKey：<a href="/ukey/20529_User_x86_x64_5.0.2023.12061.exe" target="_blank" class="access">下载</a></div>
      </div>
    </div>

    <div class="login-btn w-full">
      <el-button :icon="AuthIcon"
                 class="w-full"
                 round size="large"
                 type="primary" :loading="loading"
                 @keydown.enter="authentication"
                 @click="authentication">
        认证
      </el-button>
    </div>

  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-ukey-form;

.#{$prefixCls} {
  height: 100%;
  width: 100%;

  // placeholder 样式修改
  input::-webkit-input-placeholder {
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    color: #fff !important;
    font-family: 'MyFont';
  }

  .el-tabs__item {
    padding: 0 !important;
    padding-right: 10px !important;
  }

  &__plugin {
    display: flex;
    align-items: center;
    gap: 20px;

    .isInstall {
      font-size: 16px;
      font-family: SourceHanSansCN-Bold;
    }

    .download {
      font-size: 14px;
      font-style: italic;
      font-family: SourceHanSansCN-Bold;
    }
  }
}
</style>
