<script lang="ts" setup>
import GisComponent from "@/layouts/map/components/Derive/GisComponent.vue";
import {getGis, GisSymbolKey} from "@/core/GisCache.ts";
import {deepMergePlatformViewConfig, platformViewConfig} from "@/layouts/map/config/view.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
import defToolboxCfg from "@/layouts/map/components/ToolBox/config/toolbox.ts";
import Visual from "@/components/Visual/Visual.vue";
import {computed} from "vue";
import {usePlatformStoreWithOut} from "@/store/modules/platform.ts";

const allPlatform = platformViewConfig;
//地图工具的配置信息
const toolboxCfg  = defToolboxCfg;
const otherAllPlatform = deepMergePlatformViewConfig({
  [GisPlatformEnum.OPENLAYERS]:{
     target:GisSymbolKey.deriveDemo.toString()
  },
  [GisPlatformEnum.CESIUM]:{
    target:GisSymbolKey.deriveDemo.toString()
  }
})
const ready = computed(()=>{
  return usePlatformStoreWithOut().getGisKeyInstance(GisSymbolKey.default)?.ready && getGis(GisSymbolKey.default)
})
</script>
<template>
  <div class="fixed top-0 left-0 h-full w-full flex justify-center items-center">
    <Visual v-if="ready" />
<!--    <Plot v-if="ready" />-->
    <GisComponent
        :platform="GisPlatformEnum.OPENLAYERS"
        :options="allPlatform"
        :toolbox-cfg="toolboxCfg"
        :gis-key="GisSymbolKey.default"/>
<!--    <GisComponent-->
<!--        :platform="GisPlatformEnum.CESIUM"-->
<!--        :options="otherAllPlatform"-->
<!--        :toolbox-cfg="toolboxCfg"-->
<!--        :gis-key="GisSymbolKey.deriveDemo"/>-->
  </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-map-layout;
.#{$prefixCls} {
  z-index: 0;
}
</style>
