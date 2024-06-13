<!--复合水文 来水预报-->
<template>

  <UnifyChart v-bind="getBindValue"/>
</template>
<script setup lang="ts" name="ComplexHydrologyChart">
import {computed, ref} from 'vue'
import {useAssist, useComplexHydrology} from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"
import Data from "./data.ts";

const datasource =ref(Data.data)

const { getExistConfig } = useAssist();
const convert = getExistConfig(15).forec
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useComplexHydrology,
      convert,
      // stateful
    }));
</script>