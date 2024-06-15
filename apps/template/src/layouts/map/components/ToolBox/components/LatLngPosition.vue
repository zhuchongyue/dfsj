<script setup lang="ts">
import {useDesign} from "/@/hooks/web/useDesign";
import {useLatLng} from "/@/layouts/map/components/ToolBox/hooks/useLatLng";
import {watch} from "vue";

const {prefixCls} = useDesign('lat-lng');

const {coordinate} = useLatLng()

</script>

<template>
  <div :class="prefixCls">
     <span class="ll-item">
       <span>x:  </span>
       <span>{{coordinate.lng}} </span>
     </span>
    <span class="ll-item">
       <span> y:  </span>
       <span>{{coordinate.lat}} </span>
     </span>
  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-lat-lng;
.#{$prefixCls} {
  position: fixed;
  bottom: 10px;
  left: 100px;
  //z-index: 10;
  @apply flex  justify-center items-center;
  //height: 40px;
  border-radius: 4px;
  //background: rgba(0, 0, 0, 0.5);
  //width: 140px;
  font-size: 12px;
  .ll-item{
    color: #614110;
    text-shadow:  0 0 0.2em #fff,0 0 0.3em #fff, 0 0 0.4em #fff;
    font-weight: bold;
    font-family: SourceHanSansCN-Bold;
    &:first-child{
       margin-right: 5px;
    }
  }
}

</style>