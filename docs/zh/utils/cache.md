# LocalforageCache 
> indexdb 储存 包括`LocalforageCache`实例化类，  `setupLocalforageCache`、`disposeLocalforageCache`全局安装和卸载方法。

### constructor
- `{ string } name`：数据库名称 

## properties
- `{any} db`：数据库实例
- `{string} name`：数据库名称

## methods
- `{Fn} get`：获取
- `{Fn} set`：设置
- `{Fn} remove`：删除
- `{Fn} clear`：清除
- `{Fn} keys`：查看所有key
- `{Fn} length`：长度大小
- `{Fn} iterate`：迭代

## static methods
- `{Fn} install`：注册
- `{Fn} getInstance`：获取数据库
- `{Fn} getCacheSize`：使用的存储空间大小
- `{Fn} dropInstance`：删除实例
- `{Fn} support`：查看浏览器是否支持indexdb
- `{Fn} setDriver`：设置储存策略
- `{Fn} dispose`：销毁

