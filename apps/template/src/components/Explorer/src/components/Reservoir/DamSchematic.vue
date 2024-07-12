<!--大坝示意图-->
<template>
 <div class="h-full w-full">
   <UnifyChart v-bind="getBindValue"/>
 </div>
</template>
<script setup lang="ts">
import {computed, defineProps, unref} from 'vue';
import {useAttrs} from "@dfsj/hooks";
import {useDamSchematic} from "@dfsj/echarts";
import {compProps, EToolbox, UnifyChart, useLoader} from "@dfsj/components";

const props = defineProps(compProps);
const attrs = useAttrs({ excludeDefaultKeys: false });
// const datasource = ref();
const  { fetchData , stateful , datasource} = useLoader(props,{immediate:true ,condition:{}})

const getBindValue = computed(() => (
    { ...unref(attrs), ...props  ,
      chartHooks:useDamSchematic,
      stateful,
      toolbox:[EToolbox.Download],
      data:datasource.value}));

</script>
