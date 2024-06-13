<!--横断面图  -->
<template>
  <UnifyChart v-bind="getBindValue"/>
</template>
<script setup lang="ts" name="ComplexHydrologyChart">
import {computed, ref} from 'vue'
import {UnifyChart} from "@dfsj/components"
import {useCrossSection} from '@dfsj/echarts'
import Data from "./data.ts";

const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useCrossSection,
      // convert,
      // stateful
    }));
</script>