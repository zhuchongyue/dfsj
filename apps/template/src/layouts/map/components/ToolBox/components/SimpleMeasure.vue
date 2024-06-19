<script setup lang="ts">
import {useDesign} from "/@/hooks/web/useDesign";
import {Icon} from "@dfsj/components";
import {onBeforeUnmount, onMounted} from "vue";
import {getGis, GisSymbolKey} from "/@/core/GisCache";
import {EMeasure, useMeasure } from "/@/layouts/map/components/ToolBox/hooks/useMeasure";
import {platformBasicProps} from "@/layouts/map/props.ts";
const {prefixCls} = useDesign('tool-box-maptools');
const props = defineProps({
  ...platformBasicProps,
})
const { handleDraw ,handleClear } = useMeasure();
let measure: any = null;
interface IMapTool {
  icon: string,
  handle: Function,
  key: string | any,
  label: string
}

// enum EMeasure {
//   AREA = 'area',
//   DISTANCE = 'distance',
//   ANGLE = 'angle',
//   NONE = null
// }

// const type = ref();

// function handleDraw(t:EMeasure | any) {
//   console.log('绘制图案',t);
//   console.log('measure',measure)
//   type.value  = t
//   measure?.stop?.()
//   if (!type.value) return;
//   measure.activate(type.value,{})
// }


const toolListCfg: Array<IMapTool> = [
  {
    icon: 'mdi:tape-measure',
    handle: handleDraw,
    key: EMeasure.DISTANCE,
    label: '距离测量'
  },
  {
    icon: 'mdi:shape-polygon-plus',
    handle: handleDraw,
    key: EMeasure.AREA,
    label: '面积测量'
  },
  {
    icon: 'tabler:angle',
    handle: handleDraw,
    key: EMeasure.ANGLE,
    label: '角度测量'
  },
  {
    icon: 'mdi:broom',
    handle: handleClear,
    key: EMeasure.NONE,
    label: '清除'
  }
]


// onMounted(() => {
//   console.log('初始化' , measure)
//   if (!measure){
//     measure = new Measure(getGis(GisSymbolKey.default))
//   }
//
// })

// function handleStart() {
//   console.log('measure', measure)
//   measure?.deactivate?.()
//   if (!type.value) return;
//   measure.activate(type.value, {})
// }

//停止
// function handleStop() {
//   console.log('...', measure)
//   type.value = null
//   measure?.deactivate?.()
// }

// function handleClear() {
//   measure?.clear()
// }

onBeforeUnmount(()=>{
  // measure?.dispose();
  // measure = null
})


</script>

<template>
  <div :class="`${prefixCls} flex flex-col justify-center bg-white`">
<!--    <CompositeLocator/>-->
    <div class="tb-item cursor-pointer item-section pointer-events-auto flex items-center" v-for="(t , i) in toolListCfg"
         :key="t?.key + i + 'tb'"
         @click.stop="t?.handle?.(t.key)"
    >
      <Icon size="24" class="item-section-icon" :icon="t.icon"/>
      <span>{{ t.label }}</span>
    </div>
  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-tool-box-maptools;
$WRAP_WIDTH: 260px;
.#{$prefixCls} {
  max-width: $WRAP_WIDTH;
  min-width: 150px;
  .tb-item {
  }
}


</style>