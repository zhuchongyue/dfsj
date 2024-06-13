# 文件下载

## downloadByOnlineUrl

> 下载在线图片

### params

- `{ string } url`：地址
- `{ string } filename`：文件名
- `{ string } mime`：格式
- `{ BlobPart } bom`：字节顺序标记

## downloadByBase64

> 下载基于 base64 的图片
### params

- `{ string } buf`：base64
- `{ string } filename`：文件名
- `{ string } mime`：格式
- `{ BlobPart } bom`：字节顺序标记
## downloadByData
> 根据后台接口文件流下载
### params

- `{ BlobPart } data`：后台流数据
- `{ string } filename`：文件名
- `{ string } mime`：格式
- `{ BlobPart } bom`：字节顺序标记

## downloadByUrl

> 根据文件地址`a标签`下载文件
### params

- `{ string } url`：地址
- `{ string } target`：_blank 浏览器标签
- `{ string } fileName`：文件名 
 