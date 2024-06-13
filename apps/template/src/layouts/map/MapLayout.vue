<script lang="ts" setup>
import {reactive, onMounted, onBeforeMount, onBeforeUnmount} from "vue"
</script>
<template>
   <div class="h-full w-full flex justify-center items-center">
      地图
   </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-map-layout;
.#{$prefixCls} {
  @apply fixed bottom-0 right-0;
  z-index: 0;
}
</style>
