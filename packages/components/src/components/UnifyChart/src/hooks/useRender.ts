import {computed, onMounted, Ref, watch} from 'vue';
import {EToolbox, IToolbox} from '../props';
import {isEmpty} from "@dfsj/utils";
// import type { EChartsType } from 'echarts/core';
type EChartsType = object | any;
export interface RenderConfig {
  setOptions: Function;
  echarts: EChartsType;
  createOptions: Function;
  getInstance: Function;
  assemble: Function;
  toggleTable: Function;
  transform: Function;
  toggleStatistic: Function;
}
type Toolbox = Array<IToolbox>;

export function useRender(config: RenderConfig, datasource: Ref, toolbox: Toolbox) {
  const {
    getInstance,
    setOptions,
    transform = (d) => d,
    createOptions = (p) => p,
    assemble,
    toggleTable,
    toggleStatistic,
  } = config;
  const getBindValue = computed(() => ({
    instance: getInstance,
    toggleTable: toggleTable,
    toggleStatistic: toggleStatistic,
    toolbox: toolbox ?? [EToolbox.Download, EToolbox.Table, EToolbox.Statistic],
  }));
  /** 刷新图表*/
  function refreshCharts(data) {
    if (!data || isEmpty(data)) return;
    transform(data);
    const optioned = createOptions(data);
    const options = assemble(data, optioned);
    setTimeout(() => {
      setOptions(options, true);
    }, 100);
  }
  watch(
    () => datasource.value,
    (v) => {
      refreshCharts(v);
    }
  );

  onMounted(() => {
    refreshCharts(datasource.value);
  });

  return {
    refreshCharts,
    getBindValue,
  };
}
