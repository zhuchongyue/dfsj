<!--衍生的地图组件-->
<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, toRaw, toRefs, unref, watchEffect} from "vue";
import {delGis, GisSymbolKey, setGis} from "/@/core/GisCache";
import {useDesign} from "@/hooks/web/useDesign.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
import GisPlatformAdapter from "@/core/adapter/GisPlatformAdapter.ts";

import ToolBox from "@/layouts/map/components/ToolBox/ToolBox.vue";
import {platformBasicProps} from "@/layouts/map/props.ts";
import {usePlatformStoreWithOut} from "@/store/modules/platform.ts";

let map: any = void 0;
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
  console.log('cachePlatform',cachePlatform)

  // return
  const baseLayers = props.options?.[gisPlatform]?.baseLayers??[]
  const mapIndex = baseLayers.findIndex(v => v.isDefault);
  let adapter = new GisPlatformAdapter(gisPlatform, props.options?.[gisPlatform]);
  console.log('adapter', adapter)
  setGis(toRaw(unref(gisKey)), adapter.instance);
  emits('ready', true)
  // setTimeout(()=>{
    usePlatformStoreWithOut().setInstance(toRaw(unref(gisKey)), {
      ready: true,
      platform: gisPlatform,
      mapIndex:mapIndex
    })
  // },2000)
}
onMounted(() => {
  nextTick(initMap)
})
onBeforeUnmount(() => {
  delGis(toRaw(unref(gisKey)))
})


watchEffect(()=>{
  let i = usePlatformStoreWithOut().getInstance;
  console.log('7777777777777777',i)
})

const ready = computed(()=>{
  return usePlatformStoreWithOut().getGisKeyInstance(gisKey.value)?.ready
})


</script>

<template>
  <div :class="`${prefixCls} relative`">
   <template v-if="ready">
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