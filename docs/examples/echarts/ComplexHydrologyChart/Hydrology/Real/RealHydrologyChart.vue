<!--复合水文   实时数据-->
<template>
  <div class="h-300px">
  <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts" name="ComplexHydrologyChart">
import {computed, ref} from 'vue'

import {useAssist, useComplexHydrology} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"
import Data2 from "./data2.ts";
// const datasource =ref(Data.data)
const datasource =ref(Data2)

const { getExistConfig } = useAssist();
const convert = getExistConfig(15).real
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useComplexHydrology,
      convert,
      // stateful
    }));
</script>