# `@dfsj/guest`

用于校验直接免登录系统的sdk

# 系统引用（使用）方式

1、直接访问地址使用
2、iframe嵌套访问系统
3、微前端组件访问使用

# 以往方案对比

《贵阳市智慧防汛系统方案》
http://gywfc.dfsjcloud.com:8081/free/login
http://gywfc.dfsjcloud.com:8081/free/valid/" + token
登录账户/密码
gydshare/gydashare520100

1、目前系统是jwt RBAC权限模型认证方式，需要token实现登录授权（并未cookie方式）。
2、直接通过明文的用户名、密码免登录容易造成泄露以后到处会使用调用。甚至直接登录到系统进行非法操作（不使用iframe）。
3、用户名大概率甚至不会修改、密码会随时修改。修改以后不能正常访问主页要调用方重新更新。
4、需要中间转发BFF层,不是全部系统都通用不需要这一层，如果用户体系一样那可以。

# 主要步骤

需要的字段信息：
digest（数字签名：通过非对称加密向后端获取动态公钥、私钥钥匙对） publickey privatekey
appid（公司系统唯一标识：防止微服务串系统调用，根据appid作区分需要免登录的系统然后进行鉴权）
usename（用户名）
//role（角色：ROLE_GUEST）

接口1：/user/guest/getPublicKeyBase64
参数-签名文本：digest：string    "外部系统地址&内部系统标识&内部系统用户"
返回体： signStr
publicKey

接口2：/user/guest/validate
参数(公钥加密):usename
digest     
referer
加载我司js sdk,注册参数，调用指定方法（里面包含加解密处理）

- 1、外部系统调用getPublicKey接口获取内部系统的公钥和签名 （签名明文格式："外部系统地址&内部系统标识&内部系统用户"
  由内部系统方提供）
    - 2、通过postMessage()方法向iframe内部系统传输加密后的验证信息；
      -3、内部系统通过sdk addReceiveMessageListener监听传入的message并处理，并且调用后台接口作校验操作，获取权限菜单；
      - 当内部系统：通过路由拦截等操作 ， 成功返回token进行获取用户信息进入页面或指定页面；
      - 当内部系统：过期或者referer禁用，通过postMessage()方法向外部系统传送无法访问；
- 外部系统通过window.addEventListener('message', event => {})监听关闭iframe页面或者进行其他操作
  - 前端提供一个SDK作特定验证方法书写：包含获取方法，发送通知。

增加referer字段作为白名单验证、过期时间、是否禁用referer等，可以通过后台接口进行统一配置和验证时判断，还可以判断网络请求头和参数请求头一致性。

## 问题

1、后台需要新增逻辑接口，有必要可能要新增一张表。
2、前端对于加载等待时需要补充少量loading状态 和 失败未授权等页面，不然可能导致短暂白屏
3、其它问题待实际使用发现

