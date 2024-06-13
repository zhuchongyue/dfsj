<!--横断面图  -->
<template>
  <div class="flex flex-col h-full w-full">
    <BasicTitle title="河道断面图"/>
    <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts" name="ComplexHydrologyChart">
import {computed, ref} from 'vue'
import {UnifyChart,EToolbox} from "@dfsj/components"
import {useCrossSection} from '@dfsj/echarts'
import Data from "./data.ts";
import BasicTitle from "/@/components/Title/BasicTitle.vue";

const datasource = ref(Data.data)
const getBindValue = computed(() => (
    {
      data: datasource.value,
      chartHooks: useCrossSection,
      toolbox:[EToolbox.Download],
      // convert,
      // stateful
    }));
</script>