<!--水位流量关系-->
<template>
  <div :class="`${prefixCls} h-full w-full`">
    <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts">
import {computed, defineProps, unref} from 'vue';
import {EToolbox, UnifyChart, useLoader} from '@dfsj/components';
import {useAttrs} from '@dfsj/hooks';
import {useDesign} from "/@/hooks/web/useDesign";
import {compProps} from '/@/components/Explorer';
import {useStageflow} from "@dfsj/echarts";

const {prefixCls} = useDesign('chart-capacity-page-wrap');
const props = defineProps(compProps);
const attrs = useAttrs({excludeDefaultKeys: false});
const getBindValue = computed(() => ({
  ...unref(attrs),
  ...props,
  data: datasource.value,
  chartHooks: useStageflow,
  toolbox: [EToolbox.Download, EToolbox.Table],
  // convert
  stateful,
}));

const {stateful, datasource} = useLoader(props, {
  immediate: true,
  condition: {},
});
</script>
