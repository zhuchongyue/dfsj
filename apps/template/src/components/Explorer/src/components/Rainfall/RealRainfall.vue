<!--雨量站-->
<template>
  <div :class="`${prefixCls} h-full w-full min-h-0 min-w-0`">
    <div class="flex flex-col">
      <BasicTabs :options="tabOptions" v-model="curTab"/>
      <!-- 日期选择-->
      <div class="flex-1 flex flex-col">
        <div style="margin: 5px 0">
          <el-date-picker
              v-model="times"
              :type="picker"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              :format="dateFormat"
          />
        </div>
        <div class="flex-1 h-full">
          <UnifyChart
              v-bind="getBindValues"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col h-full">
      <div class="flex flex-col h-1/2">
        <div class="flex justify-between flex-nowrap">
          <span class="point-title-color"> 地址: {{ target?.address }}</span>
        </div>
        <div class="flex-grow">
          <Table
              :height="'100%'"
              max-height="100%"
              :header-align="'center'"
              stripe
              :columns="columns"
              :data="tableSource.sum"
              :loading="tableLoading.sum"
          />
        </div>
      </div>
      <div class="flex flex-col h-1/2">
        <h3 class="point-title-color">
          选择时间:
          {{ times?.[0] }} ~
          {{ times?.[1] }}
        </h3>
        <div class="flex-grow">
          <Table
              :height="'100%'"
              max-height="100%"
              :header-align="'center'"
              stripe
              :columns="columns"
              :data="tableSource.max"
              :loading="tableLoading.max"
          />
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, reactive, ref, toRefs, watch} from "vue"
import dayjs from "dayjs";
import {compProps, State, StateEnum, Table, TableColumn, UnifyChart} from "@dfsj/components";
import {getRainRealPro} from "@/api/common.ts";
import {isEmpty} from "@dfsj/utils";
import {findPptnMaxByIntv, findPptnSumByIntv, getRainRealProSource} from "@/components/Explorer";
import {tools, useRainfall} from "@dfsj/echarts";
import BasicTabs from "/@/components/Tabs/BasicTabs.vue";
import {useDesign} from "@/hooks/web/useDesign.ts";

const props = defineProps(compProps);
const {target} = toRefs(props);
const dataSource = ref<Object | null>({});
const stateful = new State(StateEnum.NONE);
const {prefixCls} = useDesign('component-real-rain-page-wrap');
const curTab = ref(1);
const tabOptions = [
  {label: '逐小时降雨', value: 1},
  {label: '雨量采集数据', value: 2},
];
const columns: TableColumn[] = [
  {
    label: '时段',
    field: 'stnm',
    align: 'center',
  },
  {
    label: '时间段',
    field: 'showTime',
    align: 'center',
  },
  {
    label: '降雨量(mm)',
    field: 'drp',
    align: 'center',
  },
];
const DEFAULT_TIMES = {
  1: (function () {
    let s = dayjs().format('YYYY-MM-DD 08:00:00');
    let e = dayjs().add(1, 'day').format('YYYY-MM-DD 08:00:00');
    const isAfter8am = dayjs().hour() >= 8;
    if (!isAfter8am) {
      s = dayjs().add(-1, 'd').format('YYYY-MM-DD 08:00:00');
      e = dayjs().format('YYYY-MM-DD 08:00:00');
    }
    return [s, e];
  })(),
  2: [
    dayjs().subtract(3, 'day').format('YYYY-MM-DD 00:00:00'),
    dayjs().format('YYYY-MM-DD 23:59:59'),
  ],
};
const times = ref(DEFAULT_TIMES['1']);
const dateFormat = computed(() => {
  if (curTab.value == 1) return 'YYYY-MM-DD HH:mm';
  return 'YYYY-MM-DD';
});
const picker = computed(() => {
  if (curTab.value == 1) return 'datetimerange';
  return 'daterange';
});


function fetchRain() {
  stateful.loading();
  const [start, end] = times.value;
  let Api: any = getRainRealPro;
  if (curTab.value == 2) {
    Api = getRainRealProSource;
  }
  let params = {
    stcd: target.value?.stcd,
    start: start,
    end: end,
  };
  Api?.(params)
      .then((res) => {
        if (isEmpty(res)) {
          dataSource.value = null;
        } else {
          dataSource.value = res;
        }
      })
      .catch(() => {
        stateful.error();
      })
      .finally(() => {
        let empty = isEmpty(dataSource.value);
        stateful.completed(empty);
        fetchSum();
        fetchMax();
      });
}

const convert = (data) => {
  if (data == null) return null;
  const day = tools.getNearNDays(data.source || [], 7);
  return {
    dataZoom: [
      {
        type: 'slider',
        startValue: day[0],
        endValue: day[1],
        minValueSpan: 4,
      },
      {
        type: 'inside',
        startValue: day[0],
        endValue: day[1],
        minValueSpan: 4,
      },
    ],
    xAxis: [
      {
        position: 'top',
      },
    ],
    yAxis: [{}, {show: false}],
  };
};
const getBindValues = computed(() => {
  return {
    stateful: stateful,
    chartHooks: useRainfall,
    convert: convert,
    data: dataSource,
  }
})


watch(
    () => curTab.value,
    (v) => {
      //@ts-ignore
      times.value = DEFAULT_TIMES?.[v];
    },
    {}
);

watch(
    () => times.value,
    () => {
      fetchRain();
    }
);
//todo sum
const tableSource = reactive({
  sum: [],
  max: [],
});
const tableLoading = reactive({
  sum: false,
  max: false,
});

async function fetchSum() {
  tableLoading.sum = true
  const params = {stcd: target.value.stcd, start: times.value?.[0]};
  let result = await findPptnSumByIntv(params);
  if (result && result?.length) {
    result.forEach((e) => {
      e.showTime =
          dayjs(e.start).format('MM/DD HH:mm') +
          '-' +
          dayjs(e.end).format('MM/DD HH:mm');
      e.drp = e.drp.toFixed(1);
    });
    tableSource.sum = [...result];
    tableLoading.sum = false
  } else {
    tableSource.sum = [];
    tableLoading.sum = false
  }
}

async function fetchMax() {
  tableLoading.max = true
  const params = {
    stcd: target.value?.stcd,
    start: times.value?.[0],
    end: times.value?.[1],
  };

  let result = await findPptnMaxByIntv(params);
  if (result && result?.length) {
    result.forEach((e) => {
      e.showTime =
          dayjs(e.start).format('MM/DD HH:mm') +
          '-' +
          dayjs(e.end).format('MM/DD HH:mm');
      e.drp = e.drp.toFixed(1);
    });
    tableSource.max = result;
  }
  tableLoading.max = false
}

onMounted(() => {
  fetchRain();
});
</script>
<style lang="scss">
$prefix-cls: #{$namespace}-component-real-rain-page-wrap;
.#{$prefix-cls} {
  $font-pr2: #158bd6;
  $font-dk2: #424242;

  display: grid;
  grid-template-columns: 60% 40%;
  gap: 12px;

  .number-color {
    color: $font-pr2;
  }

  .point-title-color {
    padding: 5px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: $font-dk2;
    opacity: 1;
  }

  .point-active-class {
    background-color: var(--el-color-primary-light-8);
  }

  .table-1,
  .table-2 {
    height: calc(100% - 34px);
    background-color: red;
  }
}
</style>