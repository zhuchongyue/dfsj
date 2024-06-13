# SvgIcon 图标组件
 
> 需要配合vite插件 `vite-plugin-purge-icons` `vite-plugin-svg-icons`使用，自定义的svg字体图标需要放到规定的目录下`src/assets/svg`
 
 
### 基础用法

```vue
<script setup lang="ts">
  import {SvgIcon} from "@dfsj/components";  
</script>

<template>
  <template>
    <SvgIcon
        name="'mdi:user'"
    />
  </template>
</template>

```

##  属性

| 属性    | 说明   | 类型       | 可选值 | 默认值 |
|-------|------|----------|-----|---|
| name   | 名称   | `string` | -   |  | 
| size | 尺寸   | `number` | -   | `16` | 
| spin | 加载效果 | `boolean` | -   | `false` | 
| prefix | 前缀   | `string` | -   | `icon` | 

:::tip
如果设置颜色需设置到包裹的外层style
:::
