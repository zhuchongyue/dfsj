<template>
  <div class="h-40px overflow-hidden">
    <DatePicker
        v-model="date"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:00"
        format="YYYY-MM-DD HH:mm:00"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        unlink-panels
        :clearable="false"
    />
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue"
import {DatePicker} from "@dfsj/components";
const date =ref()
</script>