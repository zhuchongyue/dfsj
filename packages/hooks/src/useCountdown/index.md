# useCountdown

倒计时hooks,手动开始、停止、重置的常用hooks

## 使用

```
<template>
 
</template>

<script lang="ts">
 
</script>
``` 

## Api

### Params

| 参数    | 说明   | 类型                 | 默认值  |
|:------|:-----|:-------------------|:-----|
| count | 倒数值	 | ```Ref<boolean>``` | true |

### Result

| 参数           | 说明  | 类型 |
|:-------------|:----|:---|
| isStart      | 状态值 | -  | 
| currentCount | 当前值 | -  | 

### Actions

| 参数      | 说明   | 类型         |     |
|:--------|:-----|:-----------|-----|
| start   | 开始   | () => void |     |
| reset   | 重置   | () => void |     |
| clear   | 清除   | () => void |     |
| restart | 重新开始 | () => void |     |
