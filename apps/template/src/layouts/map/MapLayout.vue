<script lang="ts" setup>
import GisComponent from "@/layouts/map/components/Derive/GisComponent.vue";
import {GisSymbolKey} from "@/core/GisCache.ts";
import {platformViewConfig} from "@/layouts/map/config/view.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
const openlayers = platformViewConfig[GisPlatformEnum.OPENLAYERS];
const cesium = platformViewConfig[GisPlatformEnum.CESIUM];
</script>
<template>
  <div class="fixed top-0 left-0 h-full w-full flex justify-center items-center">

    <GisComponent
        :platform="GisPlatformEnum.OPENLAYERS"
        :options="openlayers"
        :gis-key="GisSymbolKey.default"/>
    <GisComponent
        :platform="GisPlatformEnum.CESIUM"
        :options="cesium"
        :gis-key="GisSymbolKey.deriveDemo"/>
  </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-map-layout;
.#{$prefixCls} {
  z-index: 0;
}
</style>
