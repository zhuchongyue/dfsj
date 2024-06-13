# 全局 API 🌎

## setResourcesUrl()

> 初始化设置cesium资源目录。

```js

默认为public/cesium

```

## getLib()

> 获取框架中注册的第三方框架包，

```js
let turf = ECCesium.getLib('turf')
```

- 参数
    - `{String} name`：名称
- 返回值 `Object`

## 常量

> 框架内部默认常量

::: warning
开发时请使用默认常量进行开发
:::

### MouseEventType

**_`ECCesium.MouseEventType.LEFT_DOWN`_**: (场景、图层、覆盖物)鼠标左键按下事件

**_`ECCesium.MouseEventType.LEFT_UP`_**: (场景、图层、覆盖物)鼠标左键抬升事件

**_`ECCesium.MouseEventType.CLICK`_**: (场景、图层、覆盖物)鼠标点击事件

**_`ECCesium.MouseEventType.RIGHT_DOWN`_**: (场景、图层、覆盖物)鼠标右键按下事件

**_`ECCesium.MouseEventType.RIGHT_UP`_**: (场景、图层、覆盖物)鼠标右键按下事件

**_`ECCesium.MouseEventType.RIGHT_CLICK`_**: (场景、图层、覆盖物)鼠标右击事件

**_`ECCesium.MouseEventType.DB_CLICK`_**: (场景、图层、覆盖物)鼠标双击事件

**_`ECCesium.MouseEventType.MOUSE_MOVE`_**: 场景鼠标移动事件

**_`ECCesium.MouseEventType.WHEEL`_**: 场景鼠标滚轮事件

**_`ECCesium.MouseEventType.MOUSE_OVER`_**: 覆盖物鼠标移入事件

**_`ECCesium.MouseEventType.MOUSE_OUT`_**: 覆盖物鼠标移出事件

### SceneEventType

**_`ECCesium.SceneEventType.CAMERA_MOVE_END`_**: 相机移动完成

**_`ECCesium.SceneEventType.CAMERA_CHANGED`_**: 相机位置完成

**_`ECCesium.SceneEventType.PRE_UPDATE`_**: 场景更新前

**_`ECCesium.SceneEventType.POST_UPDATE`_**: 场景更新后

**_`ECCesium.SceneEventType.PRE_RENDER`_**: 场景渲染前

**_`ECCesium.SceneEventType.POST_RENDER`_**: 场景渲染后

**_`ECCesium.SceneEventType.MORPH_COMPLETE`_**: 场景模式变换完成

**_`ECCesium.SceneEventType.CLOCK_TICK`_**: 时钟跳动

**_`ECCesium.SceneEventType.RENDER_ERROR`_**: 渲染错误

### MouseMode

**_`ECCesium.MouseMode.LEFT_MIDDLE`_**: 左键拖动，中键翻转(默认)

**_`ECCesium.MouseMode.LEFT_RIGHT`_**: 左键拖动，右键翻转

### ImageryType

**_`ECCesium.ImageryType.ARCGIS`_**: arcgis 地图

**_`ECCesium.ImageryType.SINGLE_TILE`_**: 单图片地图

**_`ECCesium.ImageryType.WMS`_**: WMS 地图

**_`ECCesium.ImageryType.WMTS`_**: WMTS 地图

**_`ECCesium.ImageryType.XYZ`_**: xyz 格式地图

**_`ECCesium.ImageryType.COORD`_**: 瓦片坐标地图

**_`ECCesium.ImageryType.AMAP`_**: 高德地图

**_`ECCesium.ImageryType.BAIDU`_**: 百度地图

**_`ECCesium.ImageryType.GOOGLE`_**: 谷歌地图

**_`ECCesium.ImageryType.TDT`_**: 天地图

**_`ECCesium.ImageryType.TENCENT`_**: 腾讯地图

**_`ECCesium.ImageryType.GEO_VIS`_**: 星图地图

### TerrainType

**_`ECCesium.TerrainType.NONE`_**: 无地形

**_`ECCesium.TerrainType.XYZ`_**: xyz 格式地形

**_`ECCesium.TerrainType.GOOGLE`_**: 谷歌地形

**_`ECCesium.TerrainType.ARCGIS`_**: arcgis 地形

**_`ECCesium.TerrainType.VR`_**: VR 地形

### LayerType

**_`ECCesium.LayerType.VECTOR`_**: 矢量图层

**_`ECCesium.LayerType.PRIMITIVE`_**: 图元图层

**_`ECCesium.LayerType.TILESET`_**: 3dtiles 图层

**_`ECCesium.LayerType.HTML`_**: html 图层

**_`ECCesium.LayerType.GEOJSON`_**: GeoJson 图层

**_`ECCesium.LayerType.CLUSTER`_**: 聚合图层

**_`ECCesium.LayerType.KML`_**: kml 图层

**_`ECCesium.LayerType.CZML`_**: czml 图层

**_`ECCesium.LayerType.HEAT`_**: 热区图层

**_`ECCesium.LayerType.CHART`_**: echarts 图层

### OverlayType

**_`ECCesium.OverlayType.POINT`_**: 点 **_`可标绘`_**

**_`ECCesium.OverlayType.POLYLINE`_**: 线 **_`可标绘`_**

**_`ECCesium.OverlayType.POLYGON`_**: 面 **_`可标绘`_**

**_`ECCesium.OverlayType.MODEL`_**: 模型

**_`ECCesium.OverlayType.BILLBOARD`_**: 图标点 **_`可标绘`_**

**_`ECCesium.OverlayType.RECTANGLE`_**: 矩形 **_`可标绘`_**

**_`ECCesium.OverlayType.CIRCLE`_**: 圆 **_`可标绘`_**

**_`ECCesium.OverlayType.LABEL`_**: 标签

**_`ECCesium.OverlayType.TILESET`_**: 3DTiles

**_`ECCesium.OverlayType.BOX`_**: 盒

**_`ECCesium.OverlayType.CORRIDOR`_**: 走廊

**_`ECCesium.OverlayType.CYLINDER`_**: 圆柱

**_`ECCesium.OverlayType.ELLIPSE`_**: 椭圆

**_`ECCesium.OverlayType.ELLIPSOID`_**: 球体

**_`ECCesium.OverlayType.PLANE`_**: 面板

**_`ECCesium.OverlayType.POLYLINE_VOLUME`_**: 管道

**_`ECCesium.OverlayType.WALL`_**: 墙体

**_`ECCesium.OverlayType.DYNAMIC_BILLBOARD`_**: 动态图标点

**_`ECCesium.OverlayType.DYNAMIC_MODEL`_**: 动态模型点

**_`ECCesium.OverlayType.CUSTOM_BILLBOARD`_**: 自定义图标

**_`ECCesium.OverlayType.CUSTOM_LABEL`_**: 自定义标签

**_`ECCesium.OverlayType.ATTACK_ARROW`_**: 攻击箭头 **_`可标绘`_**

**_`ECCesium.OverlayType.DOUBLE_ARROW`_**: 双箭头 **_`可标绘`_**

**_`ECCesium.OverlayType.FINE_ARROW`_**: 直箭头 **_`可标绘`_**

**_`ECCesium.OverlayType.GATHERING_PLACE`_**: 聚集地 **_`可标绘`_**

**_`ECCesium.OverlayType.TAILED_ATTACK_ARROW`_**: 燕尾攻击箭头 **_`可标绘`_**

**_`ECCesium.OverlayType.BILLBOARD_PRIMITIVE`_**: 图标图元

**_`ECCesium.OverlayType.DIFFUSE_WALL_PRIMITIVE`_**: 扩散墙图元

**_`ECCesium.OverlayType.ELEC_ELLIPSOID_PRIMITIVE`_**: 电弧球图元

**_`ECCesium.OverlayType.FLOW_LINE_PRIMITIVE`_**: 流动线图元

**_`ECCesium.OverlayType.LABEL_PRIMITIVE`_**: 文本图元

**_`ECCesium.OverlayType.MODEL_PRIMITIVE`_**: 模型图元

**_`ECCesium.OverlayType.POINT_PRIMITIVE`_**: 点图元

**_`ECCesium.OverlayType.POLYLINE_PRIMITIVE`_**: 线图元

**_`ECCesium.OverlayType.SCAN_CIRCLE_PRIMITIVE`_**: 扫描圆图元

**_`ECCesium.OverlayType.TRAIL_LINE_PRIMITIVE`_**: 轨迹线图元

**_`ECCesium.OverlayType.WATER_PRIMITIVE`_**: 水面图元

**_`ECCesium.OverlayType.VIDEO_PRIMITIVE`_**: 视频图元

### TrackViewMode

**_`ECCesium.TrackViewMode.FP`_**: 第一人称视角

**_`ECCesium.TrackViewMode.TP`_**: 第三人称视角

**_`ECCesium.TrackViewMode.TRACKED`_**: 跟随视角

**_`ECCesium.TrackViewMode.FREE`_**: 自由视角
