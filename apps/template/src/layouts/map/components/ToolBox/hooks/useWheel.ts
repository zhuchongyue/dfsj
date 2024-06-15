import { onBeforeUnmount, onMounted, reactive, toRefs } from 'vue';

import { GisSymbolKey, getGis } from '/@/core/GisCache';
import baseLayers from '/@/layouts/map/config/basemap';
import { MouseEventType } from '/@/packages/ol';

import { useMapSwitch } from '@/layouts/map/components/ToolBox/hooks/useMapSwitch';
import { useStaticVisualResource } from '@/layouts/map/components/ToolBox/hooks/useStaticVisualResource';
import { useAppStore } from '@/store/modules/app';
import {isSWJEnv, isWLSDEnv, isCQCJEnv} from "@/utils/env";
import emitter from "/@/utils/mitt";

const Names = {
  get custom(){
    // return isSWJEnv() ? 'custom_wmts_url':isWLSDEnv() ? 
    // 'custom_wmts_url': isCQCJEnv() ? 'custom_wmts_url' : null
    return isSWJEnv() ? ['sx', 'ter'] : isWLSDEnv() ? 
    ['sx', 'ter']: isCQCJEnv() ? ['ter'] : ['sx', 'ter']
  },
  // custom: 'china_jctc_gz_shzhsx',
  // isSWJEnv() ? 'img' : 'vec'
  vec: 'vec', // 切换成影像图或者其他
};
export function useWheel() {
  const appStore = useAppStore();
  const { onSwitch,  loadAdditional } = useMapSwitch();
  const { additionalCheck, absentCheck, dispose, install } =
    useStaticVisualResource();

  // 多个图层放大时候需要切换底图
  const customIndex = computed(() =>
    baseLayers.findIndex((e) => e.layerName == Names.custom)
  );
  const vecIndex = computed(() =>
    baseLayers.findIndex((e) => e.layerName == Names.vec)
  );

  const isChangeBaseLayer = () => {
    return Names.custom.some(layerName => {
      return appStore.mapIndex == baseLayers.findIndex((e) => e.layerName == layerName || e.__markID == layerName)
    })
  }

  const scale = ref(null)
  function handleWheel(ev: any) {
    if (appStore.cacheLayer != null) {
      return 
    }
    const movement = ev?.movement;
    const zoom = movement?.zoom ?? 0;
    console.log('dddddddddddddddddddddddddddd',zoom)
    //策略>> 矢量图为13
    if (appStore.cacheWheelMapIndex === null) {
      scale.value = baseLayers[appStore.mapIndex]?.layerName == 'ter' ? 13 : 16
    }
    if (zoom > scale.value) {
      if (isChangeBaseLayer()) {// appStore.mapIndex == customIndex.value
        console.log('需要切换');
        const tempIndex = appStore.mapIndex
        const cfg = baseLayers.find((e) => e.layerName == Names.vec);
        onSwitch(cfg, { index: vecIndex.value });
        additionalCheck(['layer_base_0', 'layer_base_910']); // layer_base_0:行政区划 + layer_base_910: 水系图层
        appStore.cacheWheelMapIndex = tempIndex
      }
    } else {
      // appStore.mapIndex == vecIndex.value
      if (appStore.cacheWheelMapIndex != null) {
        console.log('需要切换');
        // const cfg = baseLayers.find((e) => e.layerName == Names.custom);
        const cfg = baseLayers[appStore.cacheWheelMapIndex];
        onSwitch(cfg, { index: appStore.cacheWheelMapIndex });
        absentCheck(['layer_base_0']); // layer_base_910
        appStore.cacheWheelMapIndex = null
        scale.value = null
      }
    }
    // const [lng, lat] = movement?.coordinate;
    console.log('层级发生变化了........', movement, ev);
  }

  function handeRestoreLayer() {
    const map = getGis(GisSymbolKey.default)
    handleWheel({ movement: { zoom: map?.view?.getZoom?.() } })
  }

  onBeforeUnmount(() => {
    getGis(GisSymbolKey.default) &&
      getGis(GisSymbolKey.default).un(MouseEventType.WHEEL, handleWheel);
    emitter.off("MouseEventType.WHEEL.RESTORE", handeRestoreLayer)
    dispose();
  });

  function bindEvent() {
    install();
    setTimeout(() => {
      console.log(
        '@@@@@@@@@@@@@@@@层级发生变化了map',
        getGis(GisSymbolKey.default)
      );
      getGis(GisSymbolKey.default) &&
        getGis(GisSymbolKey.default).on(MouseEventType.WHEEL, handleWheel);
      emitter.on("MouseEventType.WHEEL.RESTORE", handeRestoreLayer)
    }, 100);
  }

  return {
    bindEvent,
    additionalCheck,
    loadAdditional
  };
}
