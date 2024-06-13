<!--大坝示意图-->
<template>
  <UnifyChart v-bind="getBindValue"/>
</template>
<script setup lang="ts" name="SchematicDiagram">
import {UnifyChart} from "@dfsj/components"
import {computed, ref} from 'vue'
import {useDamSchematic} from '@dfsj/echarts/src/charts/useDamSchematic'
import Data from "./data.ts";

const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useDamSchematic,
      // convert,
      // stateful
    }));
</script>