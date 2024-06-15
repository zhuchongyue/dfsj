<script setup lang="ts">
import {useDesign} from "/@/hooks/web/useDesign";
import {Icon} from "@dfsj/components";
const {prefixCls} = useDesign('tool-box-maptools');

interface IMapTool {
  icon:string,
  handle:Function,
  key:string,
  label:string
}
const toolListCfg:Array<IMapTool> = [
  {
    icon:'mdi:map-marker-radius',
    handle:()=>{},
    key:'',
    label:'半径查询'
  },
  {
    icon:'mdi:map-marker-path',
    handle:()=>{},
    key:'',
    label:'线查询'
  },
  {
    icon:'mdi:shape-polygon-plus',
    handle:()=>{},
    key:'',
    label:'面查询'
  },
  {
    icon:'mdi:clipboard-text-outline',
    handle:()=>{},
    key:'',
    label:'气象信息查询'
  },
  {
    icon:'mdi:weather-rainy',
    handle:()=>{},
    key:'',
    label:'点雨量查询'
  },
  {
    icon:'mdi:weather-pouring',
    handle:()=>{},
    key:'',
    label:'面雨量查询'
  },
  {
    icon:'mdi:tape-measure',
    handle:()=>{},
    key:'',
    label:'距离测量'
  },
  {
    icon:'mdi:shape-polygon-plus',
    handle:()=>{},
    key:'',
    label:'面积测量'
  },
  {
    icon:'mdi:broom',
    handle:()=>{},
    key:'',
    label:'清除'
  }
]



</script>

<template>
  <div :class="prefixCls">
    <div class="tb-item cursor-pointer item-section pointer-events-auto" v-for="(t , i) in toolListCfg"
         :key="t?.key + 'tb'"
         @click="t?.handle?.(t)"
    >
       <Icon size="24"  class="item-section-icon"  :icon="t.icon"/>
       <span>{{t.label}}</span>
    </div>
  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-tool-box-maptools;
$WRAP_WIDTH: 260px;
.#{$prefixCls} {
   @apply flex flex-col justify-center;
   min-width: $WRAP_WIDTH;
   .tb-item{
     @apply flex items-center;
   }
}


</style>