<!--横断面图  -->
<template>
  <div class="h-300px">
  <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts" name="ComplexHydrologyChart">
import { nextTick, onMounted, ref, Ref, computed } from 'vue'
import {EToolbox, UnifyChart} from "@dfsj/components"
import { useCrossSection } from '@dfsj/echarts'
import Data from "./data.ts";
const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useCrossSection,
      toolbox:[EToolbox.Download],
      // convert,
      // stateful
    }));
</script>