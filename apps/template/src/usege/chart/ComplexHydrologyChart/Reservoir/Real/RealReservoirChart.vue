<!--复合水文   实时数据-->
<template>
  <UnifyChart v-bind="getBindValue"/>
</template>
<script setup lang="ts" name="ComplexHydrologyChart">
import {computed, ref} from 'vue'
import {useAssist, useComplexHydrology} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"
import Data from "./data2.ts";

const datasource =ref(Data.data)

const { getExistConfig } = useAssist();
const convert = getExistConfig(1).real
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useComplexHydrology,
      convert,
      // stateful
    }));
</script>