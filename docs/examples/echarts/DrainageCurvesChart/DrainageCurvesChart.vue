<!--泄洪曲线-->
<template>

  <div class="h-300px">
    <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts" name="DrainageCurvesChart">
import {computed, ref} from 'vue'
import {useDrainageCurves} from '@dfsj/echarts'
import {EToolbox, UnifyChart} from "@dfsj/components"

import Data from "./data.ts";

const datasource = ref(Data.data)

const getBindValue = computed(() => (
    {
      data: datasource.value,
      chartHooks: useDrainageCurves,
      toolbox:[EToolbox.Download,EToolbox.Table],
      // convert,
      // stateful
    }));

</script>