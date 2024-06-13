# 说明
> @dfsj 作为前端的组织名称。 利用lerna管理Monorepo项目，目前项目包有cesium、ol、echarts、utils、examples、twins、rollup、docs、hooks等。
> 每个包是独立版本发布、构建。
> 支持umd、cmd、esm、life标准引入使用。
> 支持类型提示。

# apps
> template: 项目模板  Vue 3 + TypeScript + Vite + Element-Plus + Pina。

# build
> @dfsj/rollup : rollup  打包器。

# docs
> 基于vitepress 搭建的文档说明项目，使用vue、markdown格式书写。

# packages
> - @dfsj/cesium: cesium 3维sdk
> - @dfsj/ol:     openlayers 2维sdk
> - @dfsj/utils:  常用工具库
> - @dfsj/hooks:  常用vue3 hooks库
> - @dfsj/echarts:常用水文图表库
> - @dfsj/components:常用基础vue组件库
> - @dfsj/guest:  免登录访问库
> - @dfsj/twins:  孪生可视化组件

# 贡献 
>https://blog.insistime.com/nx   分布式缓存构建。 
>verdaccio  私服发布。
  
 

# 技术方案
- 1.跨系统通讯
> 单机多标签打开:使用windows  postMessage 事件广播
> 多机打开:  使用即时通讯群聊功能，需要后台实现及时通讯服务。 定义事件类型，监听固定的事件类型进行操作处理。 为了防止复杂。
> 设置需要展示结果反馈(例如地图)作为聊天的群主用户  websocket。
- 2.数字孪生大屏
- UE + Cesium for Unreal插件  3dtiles tms 数据格式。
