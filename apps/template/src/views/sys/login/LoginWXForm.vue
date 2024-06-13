<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "/@/store/modules/user";
import {useDesign} from "/@/hooks/web/useDesign";

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)

const {prefixCls} = useDesign('wx-login-form');
onMounted(() => {
  setWxerwma()
})
// 实例微信js对象
const base64 = `
ICAuaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjAwcHg7Ym9yZGVyLXJhZGl1czogMTBweH0KICAuaW1wb3dlckJveCAudGl0bGUge2Rpc3BsYXk6IG5vbmU7Y29sb3I6ICMwMDB9CiAgLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAxMDAlO2NvbG9yOiAjMDAwO30KICAuc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmU7Y29sb3I6ICMwMDB9CiAgLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO2NvbG9yOiAjMDAwfQ==`

function setWxerwma() {
  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
  const wxElement = document.body.appendChild(s)
  wxElement.onload = function () {

    const host = window.location.host;
    const origin = window.location.origin;
    const protocol = window.location.protocol;
    console.log(encodeURIComponent(origin))
    // "http%3A%2F%2Fgzsh.dfsjsoft.com"
    const obj = new WxLogin({
      self_redirect: false,
      id: 'weixinLogin', // 需要显示的容器id
      appid: window.globalEnvs.appid, // 微信开放平台appid wx*******
      scope: 'snsapi_login', // 网页默认即可
      redirect_uri: encodeURIComponent(window.globalEnvs.redirect_uri ?? origin), // 授权成功后回调的url
      state: Math.ceil(Math.random() * 1000), // 可设置为简单的随机数加session用来校验
      style: 'white', // 提供"black"、"white"可选。二维码的样式
      href: `data:text/css;base64,${base64}`, // 外部css文件url，需要https
    })

    console.log('obj',obj)
  }
}
</script>
<template>
  <div :class="prefixCls">
    <div id="weixinLogin"/>
  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-wx-login-form;
.#{$prefixCls} {
  height: 100%;
  width: 100%;
  max-height: 300px;
  display: flex;
  justify-content: center;
  align-content: center;

  .impowerBox .qrcode {
    width: 200px;
    border-radius: 10px
  }

  .impowerBox .title {
    display: none;
    color: #000
  }

  .impowerBox .info {
    width: 200px;
    color: #000;
  }

  .status_icon {
    display: none;
    color: #000
  }

  .impowerBox .status {
    text-align: center;
    color: #000
  }
}
</style>
