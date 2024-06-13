<!--泄洪曲线-->
<template>
  <UnifyChart v-bind="getBindValue"/>
</template>
<script setup lang="ts" name="DrainageCurvesChart">
import {computed, ref} from 'vue'
import {useDrainageCurves} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"

import Data from "./data.ts";

const datasource =ref(Data.data)

const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useDrainageCurves,
      // convert,
      // stateful
    }));

</script>