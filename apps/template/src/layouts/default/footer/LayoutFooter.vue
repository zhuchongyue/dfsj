<script lang="ts" setup>
import {useDesign} from "/@/hooks/web/useDesign";

const {prefixCls} = useDesign('basic-footer-layout')
</script>
<template>
 <el-footer :class="[prefixCls]">
   footer:技术支持单位
 </el-footer>
</template>
<style lang="scss">
$prefixCls:#{$namespace}-basic-footer-layout;

.#{$prefixCls}{
  @apply fixed bottom-0 right-0 w-full flex items-center;
  height: $FOOTER_HEIGHT;
  background: #EEEEEE;
  justify-content: center;
}

</style>
