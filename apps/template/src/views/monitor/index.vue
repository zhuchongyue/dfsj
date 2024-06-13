<script lang="ts" setup>
import {computed, ref, toRaw, unref, watchEffect} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
import {useRootStoreWithOut} from "@/store/root.ts";

const useStore = useUserStore();
const {prefixCls} = useDesign('module-monitor-page'); ;


function mutil() {
  useRootStoreWithOut().window.open({
    id: 'feedback-detail' ,
    title: '响应反馈详细',
    sizes: ['80vw', '60vh'],
    content: () => import("/@/usege/chart/ComplexHydrologyChart/Reservoir/Real/RealReservoirChart.vue"),
    // titleAfter: titleAfter,
    props: {
      responseId: 'xxx',
    },
  });
}


</script>
<template>
  <div :class="prefixCls">
    <el-button @click="mutil">打开</el-button>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-module-monitor-page;
.#{$prefix-cls} {
}
</style>