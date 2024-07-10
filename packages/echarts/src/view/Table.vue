<script lang="ts" setup>
import {ECharts} from 'echarts'
import get from 'lodash-es/get'
import {computed, defineProps, onMounted, reactive, ref, toRefs, watch, withDefaults} from 'vue'
import {dimensions as dimensionsFn} from '../utils/statistics'
import {ElConfigProvider, ElPagination, ElTable, ElTableColumn} from 'element-plus'
import exportFile from '../utils/export'
import dayjs from 'dayjs'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

interface Page {
  total: number,
  currentPage: number,
  pageSize: number,
  pageSizes: [number],
  small: boolean,
  background: boolean,
  disabled: boolean,
  layout: string,
  pagerCount: number
}

const locale = ref(zhCn)
const props = withDefaults(
    defineProps<{
      value: object
      chart: ECharts
      visible: boolean
      dimensionsFn: Function,
      immediate: boolean,
      shadow: boolean,
      page?: Partial<Page>,
    }>(),
    {
      value: null,
      chart: null,
      visible: false, // 可见性（默认隐藏）
      dimensionsFn: dimensionsFn,
      immediate: false,
      shadow: true,
    }
)

const {chart, visible, value, page} = toRefs(props)

const dataSource = ref([])
const dimensions = ref([])
const source = ref([])
const pagination = reactive(Object.assign({}, {
  total: 0,
  currentPage: 1,
  pageSize: 100,
  pageSizes: [50, 100, 200, 300],
  small: false,
  background: true,
  disabled: false,
  layout: 'total, sizes, prev, pager, next, jumper',
  pagerCount: 10
}, {...page.value}))

watch(
    () => props,
    (value) => {
      update()
    },
    {
      deep: true
    }
)

function mergeData(fields, data) {
  const mergedData = []
  if (!data) return []
  for (const row of data) {
    const obj = {}
    for (let i = 0; i < fields.length; i++) {
      let k = `t${fields[i].field}`
      if (i == 0) {
        obj[k] = Date.parse(row[i]) && dayjs(row[i], 'YYYY-MM-DD HH:mm:ss', true).isValid() ? dayjs(row[i]).format('MM/DD HH:mm') : row[i];
      } else {
        obj[k] = row[i]
      }
    }
    mergedData.push(obj)
  }
  return mergedData
}

const exportable = computed(() => {
  if (chart.value) return get(chart?.value?.getOption(), '$export', true)
  return null
})
const index = ref(0)
const tableData = computed(() => {
  return dataSource.value.slice(
      pagination.pageSize * (pagination.currentPage - 1),
      pagination.pageSize * pagination.currentPage
  )
})

function getSource() {
  const option: any = chart?.value?.getOption()
  const s: any[] = option?.dataset[0]?.source
  source.value = s
  pagination.total = source.value?.length || 0
}

function getDimensions() {
  dimensions.value = (props?.dimensionsFn(chart.value, value.value) || []).filter(
      (item) => item.selected != false
  )
  console.log(props?.dimensionsFn(chart.value, value.value), dimensions.value)
}

function getDataSource() {
  const d = dimensions.value
  const s = source.value
  let result = mergeData(d, s)
  dataSource.value = result
}

function update() {
  if (visible.value) {
    getSource()
    getDimensions()
    getDataSource()
    console.log(dimensions.value, dataSource.value)
  } else {
    dimensions.value.length = 0
    dataSource.value.length = 0
  }
}

function exportHandle() {
  exportFile({
    source: source.value, //表格内数据
    columns: dimensions.value, //表格内标题 [{field:"name",label:"名称"}]
    file: '图表数据' //导出文件名称
  })
}

props.immediate && onMounted(()=>setTimeout(update,200))
</script>

<template>
  <div :class="[`assistant tabulation bg-white` ,{
    shadow:shadow
  }]">
    <div class="chart-tabulation-wrap flex flex-col justify-between">
      <div class="export" @click="exportHandle">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
              fill="currentColor"
              d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m-1 1.5L18.5 9H13m-4.07 3.22H16v7.07l-2.12-2.12L11.05 20l-2.83-2.83l2.83-2.82"
          />
        </svg>
      </div>
      <div class="table-container">
        <el-table
            v-if="dataSource.length"
            :data="tableData"
            stripe
            height="100%"
            style="width: 100%"
        >
          <el-table-column sortable type="index" label="序号" align="center" width="60px">
            <template #default="{ $index }">
              {{ $index + (pagination.currentPage - 1) * pagination.pageSize + 1 }}
            </template>
          </el-table-column>
          >
          <el-table-column
              sortable
              v-for="(item, index) in dimensions"
              :key="index + item?.label"
              :prop="`t${item?.field}`"
              align="center"
              min-width="120px"
              :label="item?.label"
          />
        </el-table>
      </div>
      <div class="table-pager">
        <el-config-provider :locale="locale">
          <el-pagination
              hide-on-single-page
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="pagination.pageSizes"
              :small="pagination.small"
              :disabled="pagination.disabled"
              :background="pagination.background"
              :layout="pagination.layout"
              :total="pagination.total"
              :pager-count="pagination.pagerCount"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
</template>