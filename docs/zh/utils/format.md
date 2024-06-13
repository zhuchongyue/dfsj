# 格式化
## formatMobile
> 手机号4位分隔符

```js
formatMobile(13999999999) `139-9999-9999`
```

## formatTrim
> 去空格
```js 
formatTrim(' mrgeeker  ')  `mrgeeker`
``` 

## formatCamelCase
> 转驼峰
```js
formatCamelCase('df sj')  `dfSj`
formatCamelCase('df-sj')  `dfSj`
formatCamelCase('df_sj')  `dfSj`
```  

## formatCapitalize
> 首字母大写
```js
formatCapitalize('dfsj')  `Dfsj` 
```

## formatNumToUpper
> 金额大写
```js
formatNumToUpper('1234')  `壹仟贰佰贰拾肆` 
```

## formatThousandSeparator
> 千分位分隔符
```js
formatThousandSeparator('12345555.5555')  `12,345,555.556` 
```
 