<script setup lang="ts">
import {DatePicker} from "@dfsj/components"
import dayjs from "dayjs"
import {reactive} from "vue"

const condition = reactive({
  date:null,
  // dayjs().add(-7, "d").format("YYYY-MM-DD HH:mm:00")
  end:dayjs().format("YYYY-MM-DD HH:mm:00"),
  caseId: ''
})
function dateChangeHandle(d) {
  console.log('变化了',d)
  // forecastStore.dataForeTime = d
}
</script>

<template>
  <div class="h-full w-full">
    时间选择
    <DatePicker
        v-model="condition.date"
        type="daterange"
        range-separator="~"
        value-format="YYYY-MM-DD HH:mm:00"
        format="YYYY-MM-DD HH:mm:00"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        class="forecast-timer"
        unlink-panels
        @change="dateChangeHandle"
    />
  </div>
</template>