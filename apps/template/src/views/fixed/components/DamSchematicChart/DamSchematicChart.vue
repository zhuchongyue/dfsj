<!--大坝示意图-->
<template>
   <div class="flex flex-col h-full w-full">
     <BasicTitle title="大坝示意图"/>
     <UnifyChart class="flex-1" v-bind="getBindValue"/>
   </div>
</template>
<script setup lang="ts" name="SchematicDiagram">
import {UnifyChart,EToolbox} from "@dfsj/components"
import {computed, nextTick, onMounted, ref, Ref, watchEffect} from 'vue'
import { useDamSchematic } from '@dfsj/echarts'
import Data from "./data.ts";
import BasicTitle from "../../../../components/Title/BasicTitle.vue";
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