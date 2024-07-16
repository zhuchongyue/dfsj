<!--实时数据-->
<template>
  <div :class=" `${prefixCls} h-full w-full flex flex-col min-h-0 min-w-0`">
    <el-form :model="condition" inline class="flex flex-row flex-nowrap">
      <el-form-item prop="topoSplitType" label="" class="plan-unit-divid-type">
        <el-date-picker
            style="width: 300px;"
            v-model="condition.date"
            range-separator="~"
            unlink-panels
            type="daterange" format="YYYY-MM-DD" :clearable="false"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <TelescopicContainer :reverse="true" width="40%" :draw-open="true">
      <template #left>
        <UnifyChart ref="unifyRef" v-bind="getBindValue"/>
      </template>
      <template #right>
        <div class="flex box-border flex-col w-full h-full pl-10px overflow-hidden" >
          <Attache
              :fields="rsvrFields"
              :target="stationInfo"
          />
          <div class="flex-1  box-border relative mt-2">
            <div class="relative h-full w-full" v-if="!isEmpty(datasource) && !isEmpty(chart)">
              <ChartTable
                  v-if="!isEmpty(datasource)"
                  :shadow="false"
                  :page="{
                  layout: 'total, sizes, prev, pager, next',
                  pagerCount:5,small:true}"
                  immediate
                  :chart="chart"
                  :value="datasource" :visible="true"/>
              <Stateful :value="'empty'" v-else />
            </div>
          </div>
        </div>
      </template>
    </TelescopicContainer>
  </div>
</template>
<script setup lang="ts">
import {computed, defineProps, reactive, ref, unref, watch} from 'vue';
import {useAttrs, useRequest} from '@dfsj/hooks';
import {useDesign} from "/@/hooks/web/useDesign";
import {getter, isEmpty} from "@dfsj/utils";
import {ChartTable, useAssist, useComplexHydrology} from "@dfsj/echarts";
import {EToolbox, UnifyChart, useLoader,Stateful} from '@dfsj/components';
import {compProps, findRsvrStation} from '/@/components/Explorer';
import {TelescopicContainer} from "@/components/Container";
import Attache from "@/components/Explorer/src/components/Common/Attache/Attache.vue";
import {rsvrFields} from "@/components/Explorer/src/components/Common/Attache/fields.ts";

const {prefixCls} = useDesign('reservoir-real-warp');
const props = defineProps(compProps);
const {options} = props
const attrs = useAttrs({excludeDefaultKeys: false});
const {getExistConfig} = useAssist();
const convert = getExistConfig(1).real
const unifyRef = ref(null)
const getBindValue = computed(() => (
    {
      ...unref(attrs), ...props,
      data: datasource.value,
      chartHooks: useComplexHydrology,
      convert,
      stateful,
      toolbox: [EToolbox.Download, EToolbox.Statistic],
    }));
// 查询条件
const condition: any = reactive(getter(options?.condition));
const {fetchData, stateful, datasource,} = useLoader(props, {immediate: true, condition})
const {run, loading: captchaLoading, data: stationInfo} = useRequest(() => {
  const params = {stcd: props.target.stcd}
  return findRsvrStation(params)
}, {
  manual: false
})

const chart = computed(() => unifyRef.value?.getBindValue?.instance?.())

</script>
<style lang="scss">
$prefixCls: #{$namespace}-reservoir-real-warp;
.#{$prefixCls} {
  .assistant{
    padding: 0;
  }
  .el-form-item {
    margin-bottom: 0px;
  }

  .base-info {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px 20px;
  }

  .info-item {
    padding: 4px 10px;
    display: flex;
    justify-content: center;
  }

  .info-value {
    background-color: $neutral-color-4;
    color: $neutral-color-7;
    display: flex;
    justify-content: space-between;
  }
}
</style>