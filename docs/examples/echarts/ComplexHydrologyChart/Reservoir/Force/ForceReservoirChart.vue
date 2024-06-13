<!--复合水文   来水预报-->
<template>
  <div class="h-300px">
  <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts" name="ComplexHydrologyChart">
import {computed, ref} from 'vue'
import {useAssist, useComplexHydrology} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"
import Data from "./data.ts";

const datasource =ref(Data.data)

const { getExistConfig } = useAssist();
const convert = getExistConfig(1).forec
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useComplexHydrology,
      convert,
      // stateful
    }));
</script>