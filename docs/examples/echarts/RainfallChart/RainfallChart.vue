<!--降雨量关系图-->
<template>

  <div class="h-300px">
  <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script lang="ts"  setup>
import {computed, ref} from 'vue'
import {useRainfall} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"


import Data from "./data.ts";

const datasource =ref(Data.data?.[0])


const convert = {
  createOptions:()=>{
    return {
      xAxis: [
        {
          position: 'top'
        }
      ],
      yAxis: [{}, { show: false }]
    }
  }
}

const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useRainfall,
      convert,
      // stateful
    }));
</script>