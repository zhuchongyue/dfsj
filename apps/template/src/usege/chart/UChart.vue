<script setup lang="ts">
import * as C from '@dfsj/echarts';
import "@dfsj/echarts/src/themes/index"

import {useEChartsThemes} from "@dfsj/echarts"
import bigviewThemeJson from "./bigview.json"

// const {registerTheme,setTheme} = useEChartsThemes() ;
// registerTheme('bigview',bigviewThemeJson)
// setTheme('bigview')
import StageDischarge from "/@/usege/chart/StageDischarge/StageDischarge.vue";
// const {registerTheme,setTheme} = useEChartsThemes() ;
// registerTheme('bigview',bigviewThemeJson)
// setTheme('bigview')
//泄洪曲线图
//库容曲线图
import CapacityChart from "/src/usege/chart/CapacityChart/CapacityChart.vue";
// //大坝示意图
// import DamSchematicChart from "/src/usege/chart/DamSchematicChart/DamSchematicChart.vue";
// //河道断面示意图（横断面）
import CrossSectionChart from "/src/usege/chart/CrossSectionChart/CrossSectionChart.vue";
// //水位流量关系
// // 降雨量关系图
import RainfallChart from "/src/usege/chart/RainfallChart/RainfallChart.vue";
//水文站()
//实时数据
// 来水预报
import ForceHydrologyChart from '/src/usege/chart/ComplexHydrologyChart/Hydrology/Force/ForceHydrologyChart.vue'
import DrainageCurvesChart from "./DrainageCurvesChart/DrainageCurvesChart.vue";
import StageflowChart from "./StageflowChart/StageflowChart.vue";
import RealHydrologyChart from "./ComplexHydrologyChart/Hydrology/Real/RealHydrologyChart.vue";
import RealReservoirChart from "./ComplexHydrologyChart/Reservoir/Real/RealReservoirChart.vue";
import ForceReservoirChart from "./ComplexHydrologyChart/Reservoir/Force/ForceReservoirChart.vue";
//水库()
// 实时数据

console.log('@dfsj/echarts', {...C})
</script>

<template>
  <div class="ec-echarts-page-wrap">
<!--        <StageDischarge/>-->
<!--        <RealHydrologyChart />-->
    <!--	<div class="ec-echarts-container"  >-->

    <!--    <div class="chart-issue-container">-->
    <!--          <CapacityChart/>-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--      <DrainageCurvesChart />-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
<!--    <DamSchematicChart/>-->
    <!--          <DamSchematicChart/>-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--          <CrossSectionChart />-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--      <StageflowChart />-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--      <RainfallChart />-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--      <RealHydrologyChart />-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--      <ForceHydrologyChart />-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--      <RealReservoirChart/>-->
    <RealReservoirChart/>
    <!--    </div>-->
    <!--    <div class="chart-issue-container">-->
    <!--      <ForceReservoirChart/>-->
    <!--    </div>-->
    <!--    <div class="chart-issue-container"></div>-->
    <!--    <div class="chart-issue-container"></div>-->
    <!--	</div>-->
  </div>
</template>

<style lang="scss">
.ec-echarts-page-wrap {
  padding: 5px;
  height: 95%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  background: white;

  .ec-echarts-container {
    display: grid;
    height: 100%;
    width: 300%;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 5px;
  }

  //grid-template-columns: repeat(3 ,1fr);
  .chart-issue-container {
    border: 1px dashed gray;
    min-height: 0;
    min-width: 0;
  }
}
</style>
