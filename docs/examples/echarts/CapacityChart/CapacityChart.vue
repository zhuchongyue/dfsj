<!--库容曲线-->
<template>
  <div class="h-300px">
    <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script lang="ts" name="CapacityChart" setup>
import {computed, ref} from 'vue'
import {useCapacity} from '@dfsj/echarts'
import {EToolbox, UnifyChart} from "@dfsj/components"
import Data from "./data.ts";

const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useCapacity,
      toolbox:[EToolbox.Download,EToolbox.Table],
      // convert,
      // stateful
    }));
</script>