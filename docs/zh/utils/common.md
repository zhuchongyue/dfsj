# 通用

## setObjToUrlParams

> 设置对象到url

### params

- `{ string } baseUrl`：地址
- `{ object } obj`：对象

### returns

- `{ string }`：新地址

### usage

```ts
setObjToUrlParams(`www.baidu.com?a=3&b=4`, {a: '3', b: '4'})
== > `www.baidu.com?a=3&b=4`
```

## getObjFormUrlParams

> 获取url参数为对象

### params

- `{ string } url`：地址

### returns

- `{ obj }`：对象

### usage

```ts
getObjFormUrlParams(`www.baidu.com?a=3&b=4`)
== > {a: '3', b: '4'}  
```

## getUrlParam

> 通过属性获取当前url上对应属性的值

### params

- `{ string } paraName`：属性

### returns

- `{ string }`：值

### usage

```ts
`www.baidu.com?a=3&b=4`
getUrlParam('a') == > 3
```

## deepMerge

> 递归合并两个对象

### params

- `{ object } source`：要合并的源对象
- `{ object } target`：目标对象，合并后结果存放于此。
- `{ 'union' | 'intersection' | 'concat' | 'replace' = 'replace' } mergeArrays`：用目标数组替换源数组 默认 `replace`。

### returns

- `{ object }`：新对象
 
## openWindow

> 打开标签页

### params

- `{ string } url`：地址
- ` opt?: {
     target?: TargetContext | string
     noopener?: boolean
     noreferrer?: boolean
  }`：配置  
 
 