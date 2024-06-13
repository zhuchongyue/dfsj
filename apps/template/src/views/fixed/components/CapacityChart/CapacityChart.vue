<!--库容曲线-->
<template>
  <UnifyChart v-bind="getBindValue"/>
</template>
<script lang="ts" name="CapacityChart" setup>
import { nextTick, onMounted, ref, Ref, watchEffect,computed } from 'vue'
import { useCapacity } from '@dfsj/echarts'
import {UnifyChart} from "@dfsj/components"
import Icon from '/src/components/Icon/src/Icon.vue'
import Data from "./data.ts";
const datasource =ref(Data.data)
const getBindValue = computed(() => (
    {
      data:datasource.value,
      chartHooks:useCapacity,
      // convert,
      // stateful
    }));
</script>