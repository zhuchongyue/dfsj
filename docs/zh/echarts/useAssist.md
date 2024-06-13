# 通用的配置和数据转换
 
 >    目前所有的图表都是以hooks的创建方式执行。初始化以后返回`useEcharts` 以外，还附带了`createOptions` 、`assemble`、`toggleTable` 、`toggleStatistic`额外的方法供分析或者更换配置、转换结果。
 

>   `useAssist` 返回一个 `getExistConfig` 方法，目前包含<span style="color:red">水库水文站实时预报数据</span>的配置，返回一个包含`createOptions`  `transform`的对象。

## 方法

| 方法名             | 说明        | 回调参数               |
|-----------------|-----------|--------------------| 
| assemble        | 组装        | (value: T, options: EChartsOption) => void         |
| toggleTable     | 切换表格      | () => void         |
| toggleStatistic | 切换分析      | () => void         |
| createOptions   | 生成自定义配置   | (data:T) => EChartsOption |
| transform       | 转换后台的数据结构 | (data：T) => T      |

