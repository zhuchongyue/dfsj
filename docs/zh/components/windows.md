# Windows 抽屉管理器

结合 `Pinia` 的自定义项目插件 `window.plugin.ts` 管理项目的弹窗,基于 [`BasicModal`](/zh/components/modal.md)封装。
 
 
### 基础用法

```vue
<script setup lang="ts">
  import {Windows} from "@dfsj/components";
  import {useRootStoreWithOut} from "/@/store/root";
  import {computed} from "vue";
  const root = useRootStoreWithOut();
  const windows  = computed(()=>root.window.state)
  function open() { 
    useRootStoreWithOut().window.show({ 
      id: 'id',
      title: '标题',
      sizes: ['40rem', '40rem'],
      content: () => import('./ProcessFeedback.vue'),
      props: {
        
      },
      footer:false
    }); 
  }
  
</script>

<template>
  <template>
    <Windows
        :items="windows.items"
        :front="windows.front"
        :layer="windows.layer"
    />
  </template>
</template>

```
 


## Boards属性 
 

| 属性 | 说明   | 类型           | 可选值 | 默认值  |
| ---- |------|--------------| ---- |------|
| items | 内容集合 | `Options` | - | `[]`   |
| front | 当前弹窗 | `object`     | - | `{}` | 
| layer | 弹窗层级 | `number`     | - | 2000 | 



##  控制方法

使用 `window.plugin` 插件的方法进行控制。

| 方法名 | 说明   | 回调参数                        |
| ---- |------|-----------------------------|
| open | 展示弹窗 | (options: object) => void   |
| hide | 隐藏弹窗 | (id: string) => void        |
| once | 打开一次 | (options: object ) => void  |
| clear | 清除弹窗 | (group: string ) => void | 

