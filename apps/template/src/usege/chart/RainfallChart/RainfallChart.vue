<!--降雨量关系图-->
<template>

  <UnifyChart v-bind="getBindValue"/>
</template>
<script lang="ts" name="CapacityChart" setup>
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



// onMounted(() => {
// 	nextTick(() => {
// 		console.log('getInstance', getInstance())
// 		const data = load()
// 		const optioned = {
// 			xAxis: [
// 				{
// 					position: 'top'
// 				}
// 			],
// 			yAxis: [{}, { show: false }]
// 		}
// 		const options = assemble(data, optioned)
// 		setOptions(options, true)
// 		console.log('options', { ...options })
// 	})
// })
</script>