<script setup lang="ts">
import ChartToolbox from "./ChartToolbox.vue";
import {useRender} from "./hooks/useRender";
import {computed, ref, Ref, toRefs} from "vue";
import {unifyChartProps} from "./props";
import Stateful from "../../Stateful/src/Stateful.vue";

const chartRef = ref<HTMLDivElement | null>(null);
const props = defineProps(unifyChartProps);
const { data ,stateful:sf } = toRefs(props);

const compState = computed(()=>{
  return props.stateful?.stringify
})
const {chartHooks , convert} = props;
const { getBindValue } = useRender(
    {
      ...chartHooks(chartRef as Ref<HTMLDivElement>),
      ...convert,
    },
    data,
    props.toolbox
)



</script>
<template>
  <Stateful :value="compState">
  <ChartToolbox
      v-bind="getBindValue"
  >
    <div ref="chartRef" :style="{ height:props.height, width:props.width }"></div>
  </ChartToolbox>
  </Stateful>
</template>
