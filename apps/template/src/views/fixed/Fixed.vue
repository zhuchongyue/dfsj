<script setup lang="ts">
import SiteVideo from "./components/SiteVideo.vue";
import CapacityChart from "./components/CapacityChart/CapacityChart.vue";
import CrossSectionChart from "./components/CrossSectionChart/CrossSectionChart.vue";
import {useDesign} from "../../hooks/web/useDesign";
import Cloud from "./components/Cloud/Cloud.vue";
import Radar from "./components/Radar/Radar.vue";
import DamSchematicChart from "./components/DamSchematicChart/DamSchematicChart.vue";
const { prefixCls } = useDesign('fixed-content-page');
</script>

<template>
   <div :class="prefixCls">
     <SiteVideo />
     <div :class="`${prefixCls}__right`">
       <DamSchematicChart/>
       <Cloud/>
       <CrossSectionChart/>
       <Radar/>
     </div>
   </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-fixed-content-page;
.#{$prefixCls} {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: 33% 1fr;
  gap: 5px;
  &__right{
    display: grid;
    grid-template-rows: repeat(2,1fr);
    grid-template-columns: repeat(2,1fr);
    gap: 5px;
  }
}
</style>