
# 免登

> **用于外部系统调用内部系统时，校验直接免登录系统的sdk**

- 1、目前系统是jwt RBAC权限模型认证方式，需要token实现登录授权（并未cookie方式）。
- 2、直接通过明文的用户名、密码免登录容易造成泄露以后到处会使用调用。甚至直接登录到系统进行非法操作（不使用iframe）。
- 3、用户名大概率甚至不会修改、密码会随时修改。修改以后不能正常访问主页要调用方重新更新。
- 4、需要中间转发BFF层,不是全部系统都通用不需要这一层，如果用户体系一样那可以。

## 方式

1、直接访问地址使用
2、iframe嵌套访问系统
3、微前端组件访问使用 

## 步骤

加载我司js sdk,注册参数，调用指定方法（里面包含加解密处理）

| 字段      | 字段说明                                               |
|---------|----------------------------------------------------|
| digest  | （数字签名：通过非对称加密向后端获取动态公钥、私钥钥匙对） publickey privatekey |
| appid   | （公司系统唯一标识：防止微服务串系统调用，根据appid作区分需要免登录的系统然后进行鉴权）     |
| usename | 用户名                                                |
|         |                                                    |

| 序号 | 接口                             | 参数                             |                返回 |
|----|--------------------------------|--------------------------------|------------------:|
| 1  | /user/guest/getPublicKeyBase64 | digest： "外部系统地址&内部系统标识&内部系统用户" | signStr，publicKey |
| 2  | /user/guest/validate           | usename   digest    referer    |             token |

1. 外部系统调用getPublicKey接口获取内部系统的公钥和签名 （签名明文格式："外部系统地址&内部系统标识&内部系统用户" 由内部系统方提供）

2. 通过postMessage()方法向iframe内部系统传输加密后的验证信息；
   内部系统通过sdk addReceiveMessageListener监听传入的message并处理，并且调用后台接口作校验操作，获取权限菜单；
3. 当内部系统：通过路由拦截等操作 ， 成功返回token进行获取用户信息进入页面或指定页面；
4. 当内部系统：过期或者referer禁用，通过postMessage()方法向外部系统传送无法访问；
5. 外部系统通过window.addEventListener('message', event => {})监听关闭iframe页面或者进行其他操作

6. 前端提供一个SDK作特定验证方法书写：包含获取方法，发送通知。

7. 增加referer字段作为白名单验证、过期时间、是否禁用referer等，可以通过后台接口进行统一配置和验证时判断，还可以判断网络请求头和参数请求头一致性。

## 问题

1、后台需要新增逻辑接口，有必要可能要新增一张表。
2、前端对于加载等待时需要补充少量loading状态 和 失败未授权等页面，不然可能导致短暂白屏
3、其它问题待实际使用发现

@dfsj/guest 类型文件

```typescript
/**
 * sdk配置类型
 */
export interface GuestOptions {
    guestPublicKeyUrl: string, //请求公钥地址
    guestValidateUrl: string,  //校验地址
    appId?: string, //项目应用唯一标识
    username?: string, //用户名
    role?: string, //访问角色
    origin?:string, //外部系统
    router?: string | '*'  , // "*"为所有路径  /drought-similar  旱情相似性
    receiveMessageCallback:Function  //回调函数
}
/**
 * 签名校验类型
 */
export interface Signature {
    publicKey: string, //公钥
    digest: string, //签名字符
    signStr: string  //签名密串
}
/**
 * 验证通过返回体
 */
export interface GuestResult {
    access_token: string;
    dept_id: number;
    expires_in: number;
    license: string;
    refresh_token: string;
    scope: string;
    token_type: "bearer" | string;
    user_adcd: string;
    user_id: number | string;
    username: string;
}

```
 

外部系统使用

```vue
<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
const iframeRef = ref(null)
import ecGuest from "@dfsj/guest";
/**
 * 实例化sdk
 * */
const guest = new ecGuest({
  guestPublicKeyUrl:'http://172.168.1.137:3000/apis/user/guest/getPublicKeyBase64',
  appId: 'dfsj2023050100001',
  username: 'guest',
  router:'/drought-similar'
})
// const src = ref('http://fxjc.dfsjcloud.com')
const src = ref('http://172.168.1.137:3000')

function postMessage() {
  console.log('加载完毕', iframeRef.value)
  if (!iframeRef.value) return;
  guest.postMessage(iframeRef.value)
  // iframeRef.value?.contentWindow?.postMessage({
  //   type: 'iframe',
  //   data: {
  //     username: 'this.options.username', //如果怕usename会允许更改那就考虑使用userId字段
  //     publicKey: 'result.publicKey', //公钥
  //     signStr: 'result.signStr',  //签名密串
  //     appId: 'this.options.appId',  //应用id
  //     origin: 'location.href', // referer记录引用原地址，到时候发现异常可以开启禁用
  //     router: 'this.options.router', //重定向的路由或者只需要查看的路由 *表示所有 指定的就写指定的路由，与前端框架配置保持一致即可
  //   }
  // }, '*')
}
</script>

<template>
  <iframe
      :onload="postMessage"
      id="iframe"
      :src="src"
      ref="iframeRef"
  />
  <button style="position:absolute;top: 0;left: 0;z-index: 10" @click="postMessage">手动发送</button>
</template>
<style lang="scss">
iframe {
  width: 100%;
  height: 100%;
}

</style>

```

内部系统路由拦截文件

```typescript 
import {Router, useRouter, useRoute} from "vue-router";
import ecGuest from "@dfsj/guest";
const useUserStore:any = ()=>{}
/**
 * 全局路由拦截，执行简单的页面授权验证和404
 */
let isListener = false;
const isFrame = () => window.frames.length != parent.frames.length;
const createGlobalGuard = (router: Router) => {
    const userStore = useUserStore()
    /***
     * 监听回调函数
     */
    const handler =async (receiveMessage:any)=>{
        console.log('^^^^^^^^^^^^^^^接收跨域验证后数据^^^^^^^^^^^', receiveMessage)
        isListener = true;
       if (!receiveMessage || Reflect.has(receiveMessage,'access_token')) throw Error('验证不通过,无法访问！请联系系统人员');
       //验证成功则是token信息以及跨域通信发送的信息
        //拿到token信息则恢复走login成功以后请求用户详情的流程，并且判断跨域信息里面router  为*则跳转/  否则跳到指定路由页面；
        userStore.setToken(receiveMessage?.access_token)
        const getInfo = ()=>{ return fetch('/myInfo')}
       try {
           const userInfo = await  getInfo()
           userStore.setUserInfo(userInfo)
           if (receiveMessage.router && receiveMessage.router !== "*") {
               await router.replace(receiveMessage.router)
           } else {
               await router.replace('/')
           }
       }catch (e) {
           console.log('获取用户信息错误！')
       }
    }
    /**
     * 实例化sdk
     * */
    const guest = new ecGuest({
        guestValidateUrl:'/apis/user/guest/validate',
        receiveMessageCallback:handler
    })
    if (isFrame() && !isListener) {
        guest.addReceiveMessageListener()
    }
    const whiteList = ['/login', '/error', '/unauthorized', "/loginSSO", '/drought-similar']
    !isFrame() ? router.beforeEach((to, from, next) => {
        //FIXME 正常登录时的路由拦截
        console.log({to: to.path, from: from.path})
        const hasToken = ()=>(null) //正常获取token的方法 sessionStorage

    }) : router.beforeEach((to, from, next) => {
        //FIXME IFRAME 访问时的路由拦截
        const hasToken = ()=>(null) //正常获取token的方法 sessionStorage
        console.log('hasToken', hasToken)
        if (!hasToken) return;
        next()
    });
};

export {createGlobalGuard}

```

服务端代码

```java
package com.test.sign.config;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.RSA;
import cn.hutool.crypto.asymmetric.Sign;
import cn.hutool.crypto.asymmetric.SignAlgorithm;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Setter
@Getter
@ApiModel(description = "RSA的密钥加密解密类")
public class KeyConfig {

    @ApiModelProperty("公钥")
    private static final String publicKeyBase64 = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr9ITf41HB4M1iqYg6a" +
            "PXNVNX1AcerDGsfWScTfeVhSP9yTX+reUSfg2r5Wqcg1ak1QXaj9U2j27O0OwOVWEtrbjsZXGcsmgYdX9MuRB+JxF" +
            "rNDAM2gMLJRZqNQUIpsyJJDSC8GRxIYYvOQQ3TzVmV5UNz8wxx7NudKu6K4OSKZQIDAQAB";

    @ApiModelProperty("私钥")
    private static final String privateKeyBase64 = "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAKv0hN/jUcH" +
            "gzWKpiDpo9c1U1fUBx6sMax9ZJxN95WFI/3JNf6t5RJ+DavlapyDVqTVBdqP1TaPbs7Q7A5VYS2tuOxlcZyyaBh1f0y5EH" +
            "4nEWs0MAzaAwslFmo1BQimzIkkNILwZHEhhi85BDdPNWZXlQ3PzDHHs250q7org5IplAgMBAAECgYEAjdWF2EpfgITV" +
            "xGDEDjHPNcuZI5uRP2Rh45yc37YDgug8U+LawOypDs3Oadk9a5bxGA1kN785iEPLCYl33jLTGXGaj8l6VT2/dc/0Ac8MP34H" +
            "ONT0KS0vuNC48O1uTcOw14q5cCac88rJHSA4gFUICIfIGpqdbOgS/uirTFffx+ECQQDkS7SY0zUMkTf8AAIrgk827bnxw" +
            "gLnduoKP7ETqsVNANehLrOWiyMV7yB14g374VOCesxj0DPzmH3Oojy9rVdJAkEAwNKFzhhzYeJtJvix1U8+IaCzGUitvc4ALlj" +
            "UgSItSgVpPYfQ3WSuDPVnRuAEZgc7wu454FbpS9b8lTTc/YrOPQJBAJD9G6dri+d9WwbqonYrfk+uT0ehJeMG/MChjr6k2E" +
            "V9YXT2igv0NcY6Zm03shXkFvtpLeG+WyA8GrpfAyCbtDECQEHU3lgB4wrNSmTezaA9IMJMYjlEpgTCWy93pn28FGhMNqUK" +
            "RJYBtKa59hutifLnj1C7Esl0AsygxrWOSdDKXiUCQQDNYifA/rx9+zc2sNjVdTuW8NqvZhXJOrccUwW58361Cco/w7wzCi3Aq+" +
            "wFuXSgsWRg19ZVma6sBsLhEmB6IfEs";

    /**
     * RSA解密
     *
     * @param encryptBase64
     * @return
     */
    public static String decryptStr(String encryptBase64, KeyType keyType) {
        //实测必须设置公钥和私钥,单个私钥是解不开的,会报错的,
        //这个公私钥是没有前有缀的-----END PUBLIC KEY-----和-----BEGIN PUBLIC KEY-----
        if (StrUtil.isNotBlank(encryptBase64)) {
            try {
                RSA rsa = new RSA(privateKeyBase64, publicKeyBase64);
                String decryptStr = rsa.decryptStr(encryptBase64, keyType);
                return decryptStr;
            } catch (Exception e) {
                log.info("解密异常={}", e.getMessage());
                CustomException.message("非法的加密变量");
            }
        }
        return "";
    }

    /**
     * RSA加密
     *
     * @param variable
     * @return
     */
    public static String encryptBase64(String variable, KeyType keyType) {
        //实测必须设置公钥和私钥,单个私钥是解不开的,会报错的,
        //这个公私钥是没有前有缀的-----END PUBLIC KEY-----和-----BEGIN PUBLIC KEY-----
        if (StrUtil.isNotBlank(variable)) {
            try {
                RSA rsa = new RSA(privateKeyBase64, publicKeyBase64);
                String encryptBase64 = rsa.encryptBase64(variable, keyType);
                return encryptBase64;
            } catch (Exception e) {
                log.info("加密异常={}", e.getMessage());
                CustomException.message("加密变量异常");
            }
        }
        return "";
    }

    /**
     * 获取公钥信息
     *
     * @return
     */
    public static String getPublicKeyBase64() {
        String suffix = "-----END PUBLIC KEY-----";
        String prefix = "-----BEGIN PUBLIC KEY-----";
        //这里公钥需要传递给前端(必须添加前后缀)
        return prefix.concat(publicKeyBase64).concat(suffix);
    }

    /**
     * 获取签名(验证公钥是否可信)
     *
     * @return
     */
    public static String getSign(String digest) {
        String content = StrUtil.isNotBlank(digest) ? digest : "defaultDigest";
        //这个加密算法需要和前端保持一致
        Sign sign = SecureUtil.sign(SignAlgorithm.SHA256withRSA, privateKeyBase64, publicKeyBase64);
        //如果传入的签名摘要是空的,为避免报错设置一个固定的默认值
        byte[] bytes = sign.sign(content.getBytes(CharsetUtil.CHARSET_UTF_8));
        return Base64.encode(bytes);
    }

}

```

```java
package com.test.user.guest.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class GuestService {  
    /**
     * 用户校验
     *
     * @param validateDto
     * @return
     */
    public String validate(ValidateDto validateDto, HttpServletRequest request) {
        //获取需要校验的信息
        String password = validateDto.getPassword();
        String username = validateDto.getUsername();
        //通过用户名获取用户基本信息(设定用户名是唯一的)
        UserInfo userInfo = userInfoMapper.selectOne(new QueryWrapper<UserInfo>().eq("username", username));
        //判读用户信息是否为空
        if (Objects.isNull(userInfo)) {
            //校验失败次数
            CustomException.message("用户不存在！");
        }
        //校验用户角色是否为访客  不是的话不通过（访客重要的操作不能操作，相当于只能查看，没有可以在系统新建“访客角色ROLE_GUEST”）
        if (!userInfo.getRole.equals('ROLE_GUEST')) {
            CustomException.message("不是访客角色！");
        }
        //判断请求头登录来源和请求参数里的登录来源是否一致
        String headerLoginFrom = CommonHandler.getHeaderLoginFrom(request);
        if (!validateDto.getLoginFrom().equals(headerLoginFrom)) {
            CustomException.message("请求头和请求参数登录来源不匹配");
        }
        //判断用户是否被禁用
        boolean equals = userInfo.getEnabled().equals(0);
        if (equals) {
            CustomException.message("该账户已经被禁用,请联系管理员处理");
        }
        //返回token信息;
        return generateToken(userInfo);
    }
 
}

```

