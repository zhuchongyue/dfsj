# Highlight 文字高亮组件

### 基础用法

<preview path="../../examples/components/Highlight/Highlight.vue" title="使用方法" description="参照当前实例代码"></preview>

## 属性

| 属性    | 说明   | 类型       | 可选值 | 默认值                       |
|-------|------|----------|-----|---------------------------|
| tag   | 外层标签 | `string` | -   | `span`                    |
| keys  | 高亮文字 | `array`  | -   | `[]`                      | 
| color | 高亮颜色 | `string` | -   | `var(--el-color-primary)` | 

##  方法

| 方法名 | 说明     | 回调参数                   |
| ---- |--------|------------------------|
| click | 高亮文字点击 | (text: string) => void | 

