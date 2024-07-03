<script lang="ts" setup>
import {computed, onMounted, ref, toRaw, unref, watchEffect} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
import {getLayerManage} from "@/core/adapter/class";
import {GisSymbolKey} from "@/core/GisCache.ts";
import getLayerConfig from "@/core/adapter/config/layer.feature.config.ts";
const {prefixCls} = useDesign('component-Point-page');
import {MockPoint} from "@/components/Graph/mock.ts"
onMounted(()=>{
  // let config =
  let manger  = getLayerManage(GisSymbolKey.default)
  const cfg = getLayerConfig({})
  console.log('图层管理器',manger,cfg,MockPoint)
  manger.addition(cfg , MockPoint)


  setTimeout(()=>{
    // manger.remove(cfg)
  },6000)

})

</script>
<template>
  <div :class="prefixCls">
     上图
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-Point-page;
.#{$prefix-cls} {
  position: fixed;
  top: 100px;
  left: 50px;
  z-index: 1000;
  background: yellow;
}
</style>