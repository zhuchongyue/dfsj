# useContext

获取和创建上下文 `provide` `inject`的hook.

## 使用

```
<template>
    <div>
       
    </div>
</template>

<script lang="ts">

import { ref } from 'vue';
import { useBoolean } from '@dfsj/hooks';


export default { 
  setup() {
     

    return {
      useBooleanState,
      useBooleanToggle,
      setTrue,
      setFalse
    }
  }
}
</script>
```

创建一个所有子组件可以共同访问的上下文。

## Api

### Params

| 参数           | 说明            | 类型                 | 默认值   |
|:-------------|:--------------|:-------------------|:------|
| defaultValue | 可选项，传入默认的状态值	 | ```Ref<boolean>``` | false |

### Result

| 参数      | 说明    | 类型      |
|:--------|:------|:--------|
| state   | 状态值   | -       |
| actions | 操作集合	 | Actions |

### Actions

| 参数       | 说明                        | 类型                        |
|:---------|:--------------------------|:--------------------------|
| toggle   | 触发状态更改的函数,可以接受一个可选参数修改状态值 | (value?: boolean) => void |
| setTrue  | 设置状态值为 true               | () => void                |
| setFalse | 设置状态值为 false              | () => void                |
