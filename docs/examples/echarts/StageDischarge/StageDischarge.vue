<!--水位流量关系-->
<template>
  <div class="h-300px">
  <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script lang="ts" name="CapacityChart" setup>
import {computed, ref} from 'vue'
import {useHydrology} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"
import Data from "./data.ts";

const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useHydrology,
      // convert,
      // stateful
    }));
</script>