# useLocalStorage

一个可以将状态持久化存储在 localStorage 中的 Hook 。

## 使用Demo

```vue
<template>
  <div class="hello" style="display:flex;align-items:flex-start;">
    <div style="width: 60vw">
      <p> value:{{ state }}</p>
    </div>
    <div style="width:39vw">
      <button @click="handleUpdate">更新storage</button>
      <button @click="handleDelete">删除storage</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useLocalStorage } from "@dfsj/hooks";

export default {
  
  setup() {
    const state = useLocalStorage('useLocalStorage',{a:231});

    const handleUpdate = ()=>{
        state.value = { a: Math.random()};
    };

    const handleDelete = ()=>{
        state.value = undefined;
    };

    // useVirtualList测试
    return {
      state,
      handleUpdate,
      handleDelete
    };
  },
};
</script>
```

useLocalStorage接受一个key和一个value，导出一个响应式的state, 用户直接赋值state.value可自动修改本地localStorage。

## 注意点

* 不设置value可用于获取本地LocalStorage 例：`useLocalStorage('useLocalStorage')`
* value等于undefined或者null可用于删除本地Storage 例：`state.value = undefined;`

## Api

```
const state = useLocalStorage(
  key: string,
  initialValue?: any,
  options?: Options
);

```

### Params

| 参数           | 说明               | 类型       | 默认值 |
|:-------------|:-----------------|:---------|:----|
| key          | LocalStorage存储键名 | any	     | -   |
| initialValue | 初始值              | any	     | {}  |
| options      | 配置               | Options	 | -   |

### Options

| 参数    | 说明                 | 类型      | 默认值  |
|:------|:-------------------|:--------|:-----|
| watch | 是否实时修改LocalStorage | boolean | true |

### Result

| 参数    | 说明        | 类型              |
|:------|:----------|:----------------|
| state | 可以被修改的数据源 | ``` Ref<any>``` |

