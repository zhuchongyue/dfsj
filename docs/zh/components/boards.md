# Boards 抽屉管理器

结合 `Pinia` 的自定义项目插件 `board.plugin.ts` 管理项目上下左右侧的动态看板组件包裹器。实现展示、销毁、切换等功能。
 
 
### 基础用法

```vue
<script setup lang="ts">
  import {Boards} from "@dfsj/components";
  import {useRootStoreWithOut} from "/@/store/root";
  import {computed} from "vue";
  const root = useRootStoreWithOut();
  const east  = computed(()=>root.board.state.east)
  function open() { 
    useRootStoreWithOut().board.show({
      position:'west',
      id: 'id',
      label: '右侧面板',
      content: () => import('./ProcessFeedback.vue'),
      props: {
        
      },
    }); 
  }
  
</script>

<template>
  <template>
    <Boards
        :board="east"
        position="east"
    />
  </template>
</template>

```
 


## Boards属性 
 

| 属性 | 说明   | 类型 | 可选值 | 默认值      |
| ---- |------| ---- | ---- |----------|
| board | 内容集合 | `BoardState` | - | []       |
| position | 位置   | `'east', 'top', 'west', 'south', 'full'` | - | `west`   | 



##  控制方法

使用 `board.plugin` 插件的方法进行控制。

| 方法名 | 说明     | 回调参数                                       |
| ---- |--------|--------------------------------------------|
| show | 展示看板   | (id: string) => void                       |
| hide | 隐藏看板   | (id: string) => void                       |
| status | 设置看板状态 | (position: string, stateX: string) => void |
| clear | 清除看板   | (position: string ) => void                | 

