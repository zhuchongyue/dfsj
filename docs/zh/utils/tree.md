# 树与数组

```js
interface
TreeHelperConfig
{
    id: string;
    children: string;
    pid: string;
}
const DEFAULT_CONFIG: TreeHelperConfig = {
    id: 'id',
    children: 'children',
    pid: 'pid',
};
```

## listToTree

> 列表转树

### params

- `{any} list`：数组
- `{Partial<TreeHelperConfig>} config`：配置

## treeToList

> 树列表

### params

- `{any} tree`：树
- `{Partial<TreeHelperConfig>} config`：配置

## findNode

> 查找满足条件的节点(找的一个就返回)

### params

- `{any} tree`：树
- `{Fn} func`：满足的条件判断函数
- `{Partial<TreeHelperConfig>} config`：配置

## findNodeAll

> 查找满足条件的节点(返回所有的)

### params

- `{any} tree`：树
- `{Fn} func`：满足的条件判断函数
- `{Partial<TreeHelperConfig>} config`：配置

## findPath

> 查找满足条件的节点 全路径(找的一个就返回)

### params

- `{any} tree`：树
- `{Fn} func`：满足的条件判断函数
- `{Partial<TreeHelperConfig>} config`：配置

## findPathAll

> 查找满足条件的节点 全路径(返回所有的)

### params

- `{any} tree`：树
- `{Fn} func`：满足的条件判断函数
- `{Partial<TreeHelperConfig>} config`：配置

## filter

> 过滤掉满足条件的数据

### params

- `{any} tree`：树
- `{Fn} func`：满足的条件判断函数
- `{Partial<TreeHelperConfig>} config`：配置

## forEach

> 遍历  func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿

### params

- `{T[]} tree`：树
- `{Fn} func`：满足的条件判断函数
- `{Partial<TreeHelperConfig>} config`：配置

## treeMap

> 提取树指定结构

### params

- `{[]} treeData`：树
- `{ children?: string; conversion: Fn } opt` ：配置

## treeMapEach

> 提取树指定结构

### params

- `{[]} data`：树
- `{ children?: string; conversion: Fn } opt` ：配置

## eachTree

> 递归遍历树结构

### params

- `{ any[]} treeDatas`：树
- `{Fn} callBack`：回调
- `{{}} parentNode`：父节点