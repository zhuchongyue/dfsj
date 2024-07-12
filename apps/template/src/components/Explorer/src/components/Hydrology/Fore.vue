<!--来水预报-->
<template>
  <div :class="`${prefixCls} h-full w-full flex flex-col min-h-0 min-w-0`">
    <el-form :model="condition" inline class="flex flex-row flex-nowrap">
      <el-form-item prop="topoSplitType" label="" class="plan-unit-divid-type">
        <el-date-picker
          v-model="condition.date"
          type="datetimerange"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>

    <UnifyChart v-bind="getBindValue" />
  </div>
</template>
<script setup lang="ts">
import {computed, defineProps, reactive, unref,} from 'vue';

import UnifyChart from '/@/components/Explorer/components/Renders/UnifyChart.vue';
import {useLoader} from '/@/components/Explorer/components/Renders/useLoader';
import {compProps} from '/@/components/Explorer/props';
import {useAttrs} from '/@/hooks/core/useAttrs';
import {useDesign} from '/@/hooks/web/useDesign';
import {useAssist, useComplexHydrology} from '/@/packages/echarts/src';
import getter from '/@/utils/getter';

const { prefixCls } = useDesign('chart-hy-fore-page-wrap');
  const props = defineProps(compProps);
  const { options } = props;
  const attrs = useAttrs({ excludeDefaultKeys: false });
  // const datasource = ref();
  const { getExistConfig } = useAssist();
  const convert = getExistConfig(1).forec;
  // 查询条件
  const condition: any = reactive(getter(options?.condition));
  const { fetchData, stateful, datasource } = useLoader(props, {
    immediate: true,
    condition,
  });

  const getBindValue = computed(() => ({
    ...unref(attrs),
    ...props,
    data: datasource.value,
    chartHooks: useComplexHydrology,
    convert,
    stateful,
  }));
</script>
