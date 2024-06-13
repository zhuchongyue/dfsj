<!--水位流量关系-->
<template>
  <UnifyChart v-bind="getBindValue"/>
</template>
<script lang="ts" name="CapacityChart" setup>
import {computed, ref} from 'vue'
import {useHydrology} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"
// import Data from "./data.ts";
import Data from "./data2.ts";

const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useHydrology,
      // convert,
      // stateful
    }));
</script>