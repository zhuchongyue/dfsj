<script setup lang="ts">
// import "@dfsj/components/dist/index.min.css"
// import "@dfsj/echarts/dist/index.min.css"
// import * as ECCesium from '@dfsj/cesium'
import * as ECHooks from '@dfsj/hooks'
import * as ECComponents from '@dfsj/components'
// import * as ECGuest from '@dfsj/guest'
import * as ECEcharts from '@dfsj/echarts'
// import * as ECOl from '@dfsj/ol'
import * as ECUtils from '@dfsj/utils'
import zhCn from 'element-plus/dist/locale/zh-cn.js';
import {computed, reactive, ref} from 'vue';
import AppProvider from '/@/components/Application/src/AppProvider.vue';
import FixedLayout from "./layouts/fixed/FixedLayout.vue";
import DynamicLayout from "./layouts/dynamic/DynamicLayout.vue";
import MapLayout from "./layouts/map/MapLayout.vue";
import UsageLayout from "../layouts/usage/UsageLayout.vue";
import Visual from "@/components/Visual/Visual.vue";
// console.log({ ECCesium })
console.log({ECHooks})
console.log({ECComponents})
// console.log({ ECGuest })
console.log({ECEcharts})
// console.log({ ECOl })
console.log({ECUtils})

const locale = ref(zhCn);
const assemblySize = computed(() => 'default');
const buttonConfig = reactive({autoInsertSpace: false});
</script>

<template>


  <AppProvider>
    <el-config-provider
        :locale="locale"
        :size="assemblySize"
        :button="buttonConfig"
    >
      <!--    todo 左侧大屏-->
      <!--      <FixedLayout/>-->

      <!--    todo 中间地图部分-->
      <!--          <MapLayout/>-->
      <!--    todo 右侧动态面板部分-->

      <!--          <DynamicLayout/>-->


<!--            <UsageLayout/>-->
      <Visual />
<!--      <RouterView/>-->
    </el-config-provider>
  </AppProvider>

</template>

<style scoped>
</style>
