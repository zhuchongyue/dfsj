<!--大坝示意图-->
<template>
  <div class="h-400px">
  <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts" name="SchematicDiagram">
import {EToolbox, UnifyChart} from "@dfsj/components"
import {computed, ref} from 'vue'
import {useDamSchematic} from '@dfsj/echarts'
import Data from "./data.ts";

const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useDamSchematic,
      toolbox:[EToolbox.Download],
      // convert,
      // stateful
    }));
</script>