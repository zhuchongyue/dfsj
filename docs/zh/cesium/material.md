# 材质 API 🌎

在真实世界里，每个物体会对光产生不同的反应。钢看起来比陶瓷花瓶更闪闪发光，一个木头箱子不会像钢箱子一样对光产生很强的反射。每个物体对镜面高光也有不同的反应。有些物体不会散射(
Scatter)很多光却会反射(Reflect)很多光，结果看起来就有一个较小的高光点(Highlight)，有些物体散射了很多，它们就会产生一个半径更大的高光。如果我们想要在
OpenGL 中模拟多种类型的物体，我们必须为每个物体分别定义材质(Material)属性。

## ECCesium.ColorMaterialProperty

> 颜色材质

### example

```js
let material = new ECCesium.ColorMaterialProperty(ECCesium.Color.RED)
```

### creation

- **_constructor(color)_**

  构造函数

    - 参数
        - `{ECCesium.Color} color`：颜色
    - 返回值 `material`

## ECCesium.ImageMaterialProperty

> 图片材质

### example

```js
let material = new ECCesium.ImageMaterialProperty({
    image: '**/**.png',
    transparent: true,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `material`

```json
// 属性参数（可选）
{
  "image": "",
  // 图片地址
  "repeat": {
    "x": 1,
    "y": 1
  },
  // 图片重复
  "color": ECCesium.Color.WHITE,
  // 图片颜色
  "transparent": false
  // 材质是否透明
}
```

### properties

- `{String} image`：图片地址
- `{Object} repeat`：图片重复
- `{ECCesium.Color} color`：图片颜色
- `{Boolean} transparent`：材质是否透明

## ECCesium.CircleBlurMaterialProperty

> 模糊圆材质

### example

```js
let material = new ECCesium.CircleBlurMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.CircleDiffuseMaterialProperty

> 扩散圆材质

### example

```js
let material = new ECCesium.CircleDiffuseMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.CircleFadeMaterialProperty

> 逐渐消逝圆材质

### example

```js
let material = new ECCesium.CircleFadeMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.CirclePulseMaterialProperty

> 脉冲圆材质

### example

```js
let material = new ECCesium.CirclePulseMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.CircleScanMaterialProperty

> 扫描圆材质

### example

```js
let material = new ECCesium.CircleScanMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.CircleSpiralMaterialProperty

> 螺旋圆材质

### example

```js
let material = new ECCesium.CircleSpiralMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.CircleVaryMaterialProperty

> 多彩圆材质

### example

```js
let material = new ECCesium.CircleVaryMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
            - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.CircleWaveMaterialProperty

> 波纹圆材质

### example

```js
let material = new ECCesium.CircleWaveMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10,
  // 速度
  "count": 5,
  //数量
  "gradient": 0.1
  //强度
}
```

### properties

- `{Color} color`：颜色
- `{Number} speed`：速度
- `{Number} count`：数量
- `{Number} gradient`：强度

## ECCesium.EllipsoidElectricMaterialProperty

> 电弧球材质

### example

```js
let material = new ECCesium.EllipsoidElectricMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.EllipsoidTrailMaterialProperty

> 轨迹球材质

### example

```js
let material = new ECCesium.EllipsoidTrailMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.PolylineDashMaterialProperty

> 虚线材质

### example

```js
let material = new ECCesium.PolylineDashMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 虚线颜色
  "gapColor": ECCesium.Color.TRANSPARENT,
  // 间隔颜色
  "dashLength": 16.0
  // 虚线片段长度
}
```

### properties

- `{ECCesium.Color} color`：虚线颜色
- `{ECCesium.Color} gapColor`：间隔颜色
- `{Number} dashLength`：虚线片段长度

## ECCesium.PolylineArrowMaterialProperty

> 箭头材质

### example

```js
let material = new ECCesium.PolylineArrowMaterialProperty(ECCesium.Color.WHITE)
```

### creation

- **_constructor(color)_**

  构造函数

    - 参数
        - `{ECCesium.Color} color`：箭头颜色
    - 返回值 `materialProperty`

### properties

- `{ECCesium.Color} color`：箭头颜色

## ECCesium.PolylineOutlineMaterialProperty

> 边线材质

### example

```js
let material = new ECCesium.PolylineOutlineMaterialProperty({
    color: ECCesium.Color.WHITE,
    outlineColor: ECCesium.Color.BLACK,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "outlineColor": ECCesium.Color.BLACK,
  // 边线颜色
  "outlineWidth": 1
  // 边线宽度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{ECCesium.Color} outlineColor`：边线颜色
- `{Number} outlineWidth`：边线宽度

## ECCesium.PolylineGlowMaterialProperty

> 光晕材质

### example

```js
let material = new ECCesium.PolylineGlowMaterialProperty({
    color: ECCesium.Color.WHITE,
    glowPower: 0.25,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "glowPower": 0.25,
  // 发光强度，以总线宽的百分比表示
  "taperPower": 1
  // 渐缩效果的强度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} glowPower`：发光强度
- `{Number} taperPower`：渐缩效果的强度

## ECCesium.PolylineFlickerMaterialProperty

> 闪烁线材质

### example

```js
let material = new ECCesium.PolylineFlickerMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.PolylineFlowMaterialProperty

> 流动线材质

### example

```js
let material = new ECCesium.PolylineFlowMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10,
  // 速度,
  "percent": 0.3,
  // 比例
  "gradient": 0.1
  // 透明程度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度
- `{Number} percent`：比例,
- `{Number} gradient`：透明程度,

## ECCesium.PolylineImageTrailMaterialProperty

> 图片轨迹线材质

### example

```js
let material = new ECCesium.PolylineImageTrailMaterialProperty({
    color: ECCesium.Color.WHITE,
    image: '**/*.png',
    repeat: {x: 10, y: 1},
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10,
  // 速度
  "image": "**/*.png",
  // 图片地址
  "repeat": {
    "x": 10,
    "y": 1
  }
  //重复规则
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度
- `{String} image`：图片地址
- `{Object} repeat`：重复规则

## ECCesium.PolylineLightingMaterialProperty

> 发光线材质

### example

```js
let material = new ECCesium.PolylineLightingMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE
  // 颜色
}
```

### properties

- `{ECCesium.Color} color`：颜色

## ECCesium.PolylineLightingTrailMaterialProperty

> 颜色轨迹线材质

### example

```js
let material = new ECCesium.PolylineLightingTrailMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.PolylineTrailMaterialProperty

> 颜色轨迹线材质

### example

```js
let material = new ECCesium.PolylineTrailMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.RadarLineMaterialProperty

> 雷达线材质

### example

```js
let material = new ECCesium.RadarLineMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.RadarWaveMaterialProperty

> 波纹雷达材质

### example

```js
let material = new ECCesium.RadarWaveMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.WallImageTrailMaterialProperty

> 图片轨迹墙体材质

### example

```js
let material = new ECCesium.WallImageTrailMaterialProperty({
    color: ECCesium.Color.WHITE,
    image: '**/*.png',
    repeat: {x: 10, y: 1},
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10,
  // 速度
  "image": "**/*.png",
  // 图片地址
  "repeat": {
    "x": 10,
    "y": 1
  }
  //重复规则
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度
- `{String} image`：图片地址
- `{Object} repeat`：重复规则

## ECCesium.WallTrailMaterialProperty

> 流动墙材质

### example

```js
let material = new ECCesium.WallTrailMaterialProperty({
    color: ECCesium.Color.WHITE,
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "color": ECCesium.Color.WHITE,
  // 颜色
  "speed": 10
  // 速度
}
```

### properties

- `{ECCesium.Color} color`：颜色
- `{Number} speed`：速度

## ECCesium.WaterMaterialProperty

> 流动水材质

### example

```js
let material = new ECCesium.WaterMaterialProperty({
    baseWaterColor: ECCesium.Color.WHITE,
    normalMap: '**/**.png',
})
```

### creation

- **_constructor([options])_**

  构造函数

    - 参数
        - `{Object} options`：属性
    - 返回值 `materialProperty`

```json
// 属性参数（可选）
{
  "baseWaterColor": ECCesium.Color.WHITE,
  // 水体颜色
  "blenECCesiumolor": ECCesium.Color.WHITE,
  // 混合颜色
  "specularMap": "",
  // 镜面图
  "normalMap": "",
  // 法线图
  "frequency": 1000,
  //波纹数量
  "animationSpeed": 0.03,
  // 动画速度
  "amplitude": 10,
  //水波振幅
  "specularIntensity": 10
  //镜面反射强度
}
```

### properties

- `{ECCesium.Color} baseWaterColor`：颜色
- `{ECCesium.Color} blenECCesiumolor`：混合颜色
- `{String} normalMap`：法线图
- `{String} specularMap`：镜面图
