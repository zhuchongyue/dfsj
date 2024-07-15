<script setup lang="ts">
import '@dfsj/cesium/src/themes/index.js';
import "@dfsj/echarts/src/themes/index.ts"
import zhCn from 'element-plus/dist/locale/zh-cn.js';
import {computed, onMounted, reactive, ref} from 'vue';
import AppProvider from '/@/components/Application/src/AppProvider.vue';
import {useLinkEvent} from "@/core/useLinkEvent.ts";
import DefaultLayout from "@/layouts/default/DefaultLayout.vue";
import * as utils from "@dfsj/utils"
import * as components from "@dfsj/components"
import {useRootStoreWithOut} from "@/store/root.ts";
import UsageLayout from "../layouts/usage/UsageLayout.vue";

console.log({
  utils,
components
})
const locale = ref(zhCn);
const assemblySize = computed(() => 'default');
const buttonConfig = reactive({autoInsertSpace: false});

useLinkEvent()


onMounted(()=>{
  useRootStoreWithOut().window.open({
    title: '周边查询',
    id:'BaseInfo',
    offset:{top:0,left:0},
    sizes:['400px', '100vh'],
    content:() => import('/@/components/AroundQuery/src/AroundQuery.vue'),
    props:{
      narrow:true,
      title: '周边查询',
      target:{
        "around": {"type": 1, "radius": 1, "lgtd": 105.1963, "lttd": 27.0625},
        "adcd": "520000000000000",
        "stcd": "60804375",
        "lgtd": 105.1963,
        "lttd": 27.0625
      }
    }
  })

  // useRootStoreWithOut().window.open({
  //   title: '周边查询',
  //   id:'BaseInfo2',
  //   offset:{top:0,right:0},
  //   sizes:['700px', '100vh'],
  //   content:() => import('/@/components/AroundQuery/src/AroundQuery.vue'),
  //   props:{
  //     narrow:false
  //   }
  // })
})
</script>

<template>
  <AppProvider>
    <el-config-provider
        :locale="locale"
        :size="assemblySize"
        :button="buttonConfig"
    >
<!--      <UsageLayout/>-->
<!--      <RouterView/>-->
<!--      <MapLayout />-->
      <DefaultLayout/>
    </el-config-provider>
  </AppProvider>

</template>

<style scoped>
</style>
