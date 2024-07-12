<!--河道断面-->
<template>
  <div :class=" `${prefixCls} h-full w-full`">
    <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts">
import {computed, defineProps, unref} from 'vue';
import {EToolbox, UnifyChart, useLoader} from '@dfsj/components';
import {compProps} from '/@/components/Explorer';
import {useAttrs} from '@dfsj/hooks';
import {useDesign} from "/@/hooks/web/useDesign";
import {useCrossSection} from '@dfsj/echarts';

const {prefixCls} = useDesign('chart-cross-page-wrap');
const props = defineProps(compProps);
const attrs = useAttrs({excludeDefaultKeys: false});
const {stateful, datasource} = useLoader(props, {immediate: true, condition: {}})

const getBindValue = computed(() => (
    {
      ...unref(attrs), ...props,
      chartHooks: useCrossSection,
      data: datasource.value,
      toolbox: [EToolbox.Download],
      stateful: stateful
    }));
</script>