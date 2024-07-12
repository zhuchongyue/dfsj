<script lang="ts" setup>
import {useDesign} from "/@/hooks/web/useDesign.ts";
import LayoutFeatures from "/@/layouts/default/features/LayoutFeatures.vue";
import LayoutHeader from "/@/layouts/default/header/LayoutHeader.vue";
import LayoutContent from "/@/layouts/default/content/LayoutContent.vue";
import LayoutBoard from "/@/layouts/default/board/LayoutBoard.vue";
import LayoutFooter from "/@/layouts/default/footer/LayoutFooter.vue";
import LayoutWindow from "/@/layouts/default/window/LayoutWindow.vue";
import MapLayout from "@/layouts/map/MapLayout.vue";

const {prefixCls} = useDesign('default-layout');

</script>
<template>
  <div :class="[prefixCls,'h-full','w-full']">
    <LayoutFeatures />
    <LayoutHeader/>
<!--    <LayoutContent/>-->
    <LayoutBoard/>
    <LayoutWindow/>
    <LayoutFooter/>
<!-- 地图-->
    <MapLayout/>
  </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-default-layout;
.#{$prefixCls} {
  @apply fixed bottom-0 right-0;
  //top: $HEADER_HEIGHT;
  z-index: 0;
}
</style>
