<script lang="ts" setup>
import {useDesign} from "/@/hooks/web/useDesign.ts";
import LayoutContent from "./content/LayoutContent.vue";
import LayoutBoard from "/@/layouts/default/board/LayoutBoard.vue";
import LayoutWindow from "/@/layouts/default/window/LayoutWindow.vue";

const {prefixCls} = useDesign('fixed-layout');

</script>
<template>
  <div :class="[prefixCls,'h-full','w-full']">
    <LayoutContent/>
    <LayoutBoard/>
    <LayoutWindow/>
  </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-fixed-layout;
.#{$prefixCls} {
  @apply fixed bottom-0 right-0;
  z-index: 0;
}
</style>
