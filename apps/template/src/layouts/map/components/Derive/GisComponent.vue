<!--衍生的地图组件-->
<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, toRaw, toRefs, unref} from "vue";
import {delGis, GisSymbolKey, setGis} from "/@/core/GisCache";
import {useDesign} from "@/hooks/web/useDesign.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
import GisPlatformAdapter from "@/core/adapter/GisPlatformAdapter.ts";

import ToolBox from "@/layouts/map/components/ToolBox/ToolBox.vue";

let map: any = void 0;
const {prefixCls} = useDesign('gis-component-page-wrap');
const props = defineProps({
  gisKey: {
    type: Symbol,
    default: () => GisSymbolKey.default
  },
  platform: {
    type: String,
    default: () => GisPlatformEnum.OPENLAYERS
  },
  options: {
    type: Object,
    default: () => ({})
  }
})
const {gisKey} = toRefs(props)
const emits = defineEmits(["ready"]);
const initMap = () => {
  let adapter = new GisPlatformAdapter(props.platform, props.options);
  console.log('adapter', adapter)
  setGis(toRaw(unref(gisKey)), adapter.instance);
  emits('ready', true)
}
onMounted(() => {
  nextTick(initMap)
})
onBeforeUnmount(() => {
  delGis(toRaw(unref(gisKey)))
})


</script>

<template>
  <div :class="`${prefixCls} relative`">
    <ToolBox :key="gisKey.toString()"/>
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