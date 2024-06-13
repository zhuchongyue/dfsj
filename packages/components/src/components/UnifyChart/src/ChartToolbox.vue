<!--图表工具箱   下载 , 统计 , 表格 按钮。-->
<script setup lang="ts">
import {ref, toRefs} from "vue";
import {EToolbox, IToolbox, toolboxProps} from "./props";
import {Icon} from "../../Icon";
import {isEmpty} from "../../../utils/is";
import {useDownLoad} from "@dfsj/echarts";

const prefixCls = ('ec-chart-toolbox-wrap');
const props = defineProps(toolboxProps);
const isOpenTable = ref(false);
const {iconSize , toolbox}  = toRefs(props)
const { toggleStatistic , toggleTable , instance:getInstance }  = props;
function handleTable(ev:Event) {
  isOpenTable.value = !isOpenTable.value
  toggleTable()
}
function handleStatistic(ev:Event) {
  toggleStatistic()
}
function handleDownload(ev:Event) {
  const { downloadImg } = useDownLoad(getInstance)
  downloadImg({backgroundColor:'#000'})
}
const hasTool = (tool:IToolbox)=>{
  return toolbox?.value?.includes(tool)
}
</script>
<template>
    <div :class="`${prefixCls} h-full w-full relative`">
      <div  :class="`tools-container absolute top-0 right-0`"
            v-if="!isEmpty(toolbox)"
      >
        <div v-if="hasTool(EToolbox.Download)">
          <Icon  :color="'#f2973d'" @click="handleDownload" :size="iconSize" :icon="'mdi:cloud-arrow-down'"/>
        </div>
        <div v-if="hasTool(EToolbox.Statistic)">
          <Icon  :color="'#0885ec'" @click="handleStatistic" :size="iconSize" :icon="'mdi:chart-arc'"/>
        </div>
        <div v-if="hasTool(EToolbox.Table)">
          <Icon  :color="'#4caf50'" @click="handleTable"  :size="iconSize" :icon="'mdi:chart-line'" v-if="isOpenTable"/>
          <Icon  :color="'#4caf50'" @click="handleTable"  :size="iconSize" :icon="'mdi:table'" v-else/>
        </div>
      </div>
      <slot />
  </div>
</template>