<!--衍生的地图组件-->
<script setup lang="ts">
import {computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, toRaw, toRefs, unref} from "vue";
import {delGis, getGis, setGis} from "/@/core/GisCache";
import {useDesign} from "@/hooks/web/useDesign.ts";
import GisPlatformAdapter from "@/core/adapter/GisPlatformAdapter.ts";

import ToolBox from "@/layouts/map/components/ToolBox/ToolBox.vue";
import {platformBasicProps} from "@/layouts/map/props.ts";
import {usePlatformStoreWithOut} from "@/store/modules/platform.ts";
import LayerLegender from "@/components/Layer/LayerLegender.vue";
import {delLayerManage, delResourceManage} from "@/core/adapter/class";

const {prefixCls} = useDesign('gis-component-page-wrap');
const props = defineProps({
  ...platformBasicProps,
  toolboxCfg: {
    type: Array<any>,
    default: () => [],
  }
})
const {gisKey} = toRefs(props)
const emits = defineEmits(["ready"]);
const initMap = () => {
  //查找本地缓存的是2，3维
  const cachePlatform = usePlatformStoreWithOut().getGisKeyInstance(toRaw(unref(gisKey)))?.platform;
  const gisPlatform = cachePlatform ?? props.platform
  const baseLayers = props.options?.[gisPlatform]?.baseLayers ?? []
  const mapIndex = baseLayers.findIndex(v => v.isDefault);
  let adapter = new GisPlatformAdapter(gisPlatform, props.options?.[gisPlatform]);
  setGis(toRaw(unref(gisKey)), adapter.instance);
  usePlatformStoreWithOut().setInstance(toRaw(unref(gisKey)), {
    ready: true,
    platform: gisPlatform,
    mapIndex: mapIndex
  })
  emits('ready', true)
}
onMounted(() => {
  nextTick(initMap);
  window.addEventListener('beforeunload', resetMapState);
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', resetMapState);
  resetMapState()
  delLayerManage(toRaw(unref(gisKey)))
  getGis(toRaw(unref(gisKey)))?.dispose?.()
  delGis(toRaw(unref(gisKey)))
  delResourceManage(toRaw(unref(gisKey)))
})

function resetMapState() {
  let ready = usePlatformStoreWithOut().getGisKeyInstance(toRaw(unref(gisKey)))?.ready;
  if (ready)
    usePlatformStoreWithOut().setInstance(toRaw(unref(gisKey)), {
      ready: false,
    })
}

onBeforeMount(() => {
  resetMapState()
})
const ready = computed(() => {
  return !!(usePlatformStoreWithOut().getGisKeyInstance(gisKey.value)?.ready && getGis(gisKey?.value))
})


</script>

<template>
  <div :class="`${prefixCls} relative`">
    <template v-if="ready">
      <LayerLegender
          :gis-key="gisKey"
      />
      <ToolBox
          :platform="platform"
          :gis-key="gisKey"
          :options="options"
          :toolbox-cfg="toolboxCfg" :key="gisKey.toString()"/>
    </template>
    <div :id="gisKey.toString()" class="h-full w-full">

    </div>
  </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-gis-component-page-wrap;
.#{$prefixCls} {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .ecol-container {
    width: 100%;
    height: 100%;
  }
}
</style>