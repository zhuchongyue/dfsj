<script setup lang="ts">
import * as ECCesium from '@dfsj/cesium';
import '@dfsj/cesium/src/themes/index.js'
import {onBeforeUnmount, onMounted} from 'vue';
import {GisSymbolKey, setGis} from '/@/core/GisCache.ts';
import {use3DTileEffect} from "/@/usege/cesium/hooks/useTilesEffect.ts";
import {useTerrain} from "/@/usege/cesium/hooks/useTerrain.ts";
import {useClock} from "/@/usege/cesium/hooks/useClock.ts";

const Cesium = ECCesium.getLib('Cesium');
ECCesium.setResourcesUrl();
const emits = defineEmits(['ready']);
/**
 * 贵州高清影像图
 */
const gzImgOptions = {
  url: new Cesium.Resource({
    url: `https://58.42.237.172:8188/terrain3/egis/mask/wmts?range=egis_gz`, // 1米精度EGIS影像
  }),
  tilingScheme: new Cesium.GeographicTilingScheme(),
  layer: 'img',
  format: 'tiles',
  srs: 'EPSG:4490',
  maximumLevel: 18,
  style: 'default',
  tileMatrixSetID: 'c',
  tileMatrixLabels: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
  ],
};

let viewer: ECCesium.Viewer = undefined;
let xyzLayer: any = null;
let imgLayer: any = null;

const { addEffect } = use3DTileEffect();
const { addTerrain, setExaggeration } = useTerrain();
const { setClock } = useClock();
function initViewer() {
  console.log('初始化cesium');
  viewer = new ECCesium.Viewer('viewer-container', {
    timeline: false, // 显示时间轴刻度
    animation: false, // 显示时间轴动画按钮
    shouldAnimate: false, // 开启或关闭时间轴

    contextOptions: {
      webgl: {
        alpha: false, // 背景
      },
    },
    sceneMode: 3, // 1: 2.5D，2: 2D，3: 3D
  }).setOptions({
    shadows: true, // 是否开启阴影
    showAtmosphere: true, // 大气设置
    showMoon: true, // 是否显示月亮
    showSun: true, // 是否显示太阳
    skyBox: {
      // 天空盒子
      show: true,
    },
    globe: {
      baseColor: Cesium.Color.fromCssColorString('#2c5e7f'), // 地球默认底色
      // baseColor: Cesium.Color.TRANSPARENT, // 地球默认底色
      enableLighting: true, // 是否开启灯光，开启后地球会根据当前时间启用灯光
    },
  });
  viewer.flyToPosition(
      //@ts-ignore
      {
        alt: 704208.9648567601,
        heading: 351.1051896382928,
        lat: 21.1951713435045,
        lng: 107.84051080848603,
        pitch: -50.98279899695291,
        roll: 0.0030214874823045203,
      },
      () => {},
      0
  );
  let baseLayer = ECCesium.ImageryLayerFactory.createImageryLayer(
      ECCesium.ImageryType.SINGLE_TILE,
      {
        url: '/assets/tile/world_n.jpg',
      }
  );
  viewer.addBaseLayer(baseLayer);
  //高程图
  // const p = ECCesium.ImageryLayerFactory.createXYZImageryLayer(optiosn);
  // xyzLayer = new ECCesium.RasterTileLayer('baseLayerXYZ', p, {
  //   alpha: 1,
  // });
  // xyzLayer.delegate.alpha = 0;
  // viewer.addLayer(xyzLayer);
  //影像图
  const i = ECCesium.ImageryLayerFactory.createWMTSImageryLayer(gzImgOptions);
  imgLayer = new ECCesium.RasterTileLayer('baseLayerImg', i, {
    alpha: 1,
  });
  imgLayer.delegate.alpha = 1;
  viewer.addLayer(imgLayer);
  console.log('xyzLayer', xyzLayer);
  console.log('imgLayer', imgLayer);
  let effect = new ECCesium.Effect(viewer);
  effect.silhouette.enable = false;
  viewer!.locationBar.enable = false;
  /** 缓存gis实例*/
  setGis(GisSymbolKey.default, viewer);
  addTerrain();
  setExaggeration(12);
  addEffect();
  onReady();
}

function onReady() {
  emits('ready', true);
  setClock({
    startTime: '2023/11/23 00:00:00',
    currentTime: '2023/11/23 06:26:57',
    stopTime: '2023/11/23 23:59:59',
  });
  bindEvent();
}

onMounted(() => {
  initViewer();
});
onBeforeUnmount(() => {
  unbindEvent();
});
function getCarame() {
  console.log(viewer.cameraPosition);
}

/**
 * 绑定鼠标滚动的事件
 */
let maxAlt = 720000; // 最大高程,
let maxZoom = 6; //最大层级
function handleWheel(movement: any) {
  console.log('鼠标移动了', movement, viewer);
  const camera = viewer.cameraPosition;
  const height = Math.ceil(camera.alt);
  const zoom = viewer.zoom;
  // 根据层级与高程比例换算地形夸张值
  let kzNum = Number((height * (maxZoom / maxAlt)).toFixed(2));
  console.log(`zoom:${zoom},kzNum:${kzNum}`, 'zzp-外');
  if (zoom > 8) {
    // viewer.scene.globe.terrainExaggeration = 1;
    xyzLayer.delegate.alpha = 0;
    imgLayer.delegate.alpha = 1;
    if (zoom > 10)
      setTimeout(() => {
        // viewer.setTerrain(gzTerrain);
      }, 1000);
  } else {
    // viewer.scene.globe.terrainExaggeration = 5;
    imgLayer.delegate.alpha = 0;
    xyzLayer.delegate.alpha = 1;
    // viewer.setTerrain(terrain);
  }
}
function bindEvent() {
  // viewer?.on(ECCesium.MouseEventType.WHEEL, handleWheel);
}
function unbindEvent() {
  // viewer?.off(ECCesium.MouseEventType.WHEEL, handleWheel);
}
</script>

<template>
  <div class="h-full w-full w-100vw h-100vh">
    <div class="div-mask"></div>
    <div
        @click="getCarame"
        class="fixed bottom-0 left-0% z-1000 bg-amber cursor-pointer"
    >
      获取相机的位置
    </div>
    <div
        id="viewer-container"
        class="viewer-container"
    ></div>
  </div>
</template>

<style lang="scss">
.viewer-container {
  height: 100%;
  width: 100%;
}
.div-mask {
  background: #0000;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 1px 0 500px 170px #000;
  pointer-events: none;
  z-index: 1;
  //background-image: radial-gradient(
  //  rgba(139, 138, 138, 0.22) 50%,
  //  rgba(65, 57, 57, 0.66) 70%,
  //  rgb(17, 16, 16) 90%
  //);
}
</style>
