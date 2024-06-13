# 快速开始
## 框架安装

`pnpm / npm / yarn  更好地和 `vite` 打包工具配合使用`
```shell
pnpm add @dfsj/xx
```
## 创建应用

> [框架安装](#框架安装) 和 [配置](#应用配置) 后，就可以开发属于自己的 **_`WebGis`_** 应用了

## 应用配置

1. @dfsj/cesium使用时，静态资源默认路径设置为 `public/cesium`, 这样需将对应版本的 `@cesium/engine`

   相关的静态资源文件: `Assets`、`Workers` 、`ThirdParty` 复制到工程的 `public/cesium`

   目录下以保证三维场景能够正常呈现。 

2. 使用大部分包时需要引入对应的样式文件，样式文件统一目录为@dfsj/*/dist/index.min.css

:::danger
CDN 模式下开发时尽量不要使用 EC 为变量名或者命名空间，避免框架无法正常使用。
:::

## 代码提示

ts编写，默认少许重要的提示，完整的逐步完善中，耗费时间较多。

