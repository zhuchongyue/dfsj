# 初始化

## 功能

对 `echarts` 的 `初始化` 进行封装，只需要传入`dom` 则可以完成实例化；利用hooks的方式创建。

## 属性

| 属性    | 说明   | 类型            | 可选值                  | 默认值       |
|-------|------|---------------|----------------------|-----------|
| elRef | dom  | `HTMLElement` | --                   | `null`    |
| theme | 图表主题 | `string`      | `dark light default` | `default` | 

## 方法

| 方法名         | 说明                  | 回调参数                                             |
|-------------|---------------------|--------------------------------------------------|
| setOptions  | 用于设置echarts options | (options: EChartsOption , clear:boolean) => void |
| resize      | 用于适应容器变化            | () => void                                       |
| echarts     | echarts sdk         | `api`                                            |
| container   | 用于新增表单结构            | `Ref<HTMLElement>`                               |
| getInstance | 获取当前实例              | () => void                                       |

