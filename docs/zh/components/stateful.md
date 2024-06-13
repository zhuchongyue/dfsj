# Stateful 状态组件

> 使用`State`类构建 `Stateful`组件的value属性。

### 基础用法

<preview path="../../examples/components/Stateful/Stateful.vue" title="使用方法" description="参照当前实例代码"></preview>

## 属性

| 属性           | 说明                      | 类型                         | 可选值 | 默认值 |
|--------------|-------------------------|----------------------------|-----|-----|
| value        | 状态，必填项                  | `object` `number` `string` | -   |     |
| contentClass | 自定义类                    | `string`                   | -   |     |
| states       | error、empty、loading状态配置 | `tag label image color`    | -   | -   | 

## State 方法

| 方法名       | 说明   | 回调参数                |
|-----------|------|---------------------|
| loading   | 加载   | `() => viod`        |
| error     | 失败   | `(state) => viod`   |
| merge     | 合并状态 | `() => viod`        |
| completed | 完成   | `(isEmpty) => viod` |
| isLoading | 是否加载 | `() => boolean`     |
| state     | 获取状态 | `() => boolean`     |
| stringify | 获取状态 | `() => string`      |

