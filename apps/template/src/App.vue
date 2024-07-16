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
import {findRsvrStation} from "@/components/Explorer";

console.log({
  utils,
components
})
const locale = ref(zhCn);
const assemblySize = computed(() => 'default');
const buttonConfig = reactive({autoInsertSpace: false});

useLinkEvent()


onMounted(()=>{
  // useRootStoreWithOut().window.open({
  //   title: '周边查询',
  //   id:'BaseInfo',
  //   offset:{top:0,left:0},
  //   sizes:['400px', '100vh'],
  //   content:() => import('/@/components/AroundQuery/src/AroundQuery.vue'),
  //   props:{
  //     narrow:true,
  //     title: '周边查询',
  //     target:{
  //       "around": {"type": 1, "radius": 1, "lgtd": 105.1963, "lttd": 27.0625},
  //       "adcd": "520000000000000",
  //       "stcd": "60804375",
  //       "lgtd": 105.1963,
  //       "lttd": 27.0625
  //     }
  //   }
  // })
const target =
        {
          "mocd": "RR_60805809",
          "monm": "百花湖水库",
          "motype": 1,
          "stcd": "60805809",
          "stnm": "百花湖水库",
          "sttype": 2,
          "lgtd": 106.541425,
          "lttd": 26.691695,
          "address": "贵阳市观山湖区朱昌镇长冲村",
          "eacId": "modelcj_10654116002668695",
          "exparams": null,
          "adcd": "520115000000000",
          "adnm": "观山湖区",
          "wscd": "1631000000",
          "wsnm": "乌江水系",
          "padcd": null,
          "padnm": null,
          "datasource": null,
          "source": null,
          "remark": null,
          "sttp": "RR",
          "province": null,
          "city": "贵阳市",
          "county": "观山湖区",
          "town": null,
          "village": null,
          "geom": null,
          "rivercode": null,
          "rivername": null,
          "question": null,
          "toper": null,
          "dsj": null,
          "dsj_tel": null,
          "zr": null,
          "zr_tel": null,
          "fgj_zrr": null,
          "fgj_tel": null,
          "fyb_zrr": null,
          "fyb_tel": null,
          "citytype": null,
          "bldarea": null,
          "population": null,
          "mainriver": null,
          "wsarea": null,
          "stdyear": null,
          "ctrlnm": null,
          "zz": null,
          "qq": null,
          "fx_zrr": null,
          "duties": null,
          "wscdnm": null,
          "mgname": null,
          "ttcps": null,
          "damshape": null,
          "dssafe": null,
          "damheight": null,
          "floodsafe": null,
          "outwatersafe": null,
          "ismakesafe": null,
          "isemergency": null,
          "isempty": null,
          "isrefer": null,
          "isbuildingsafe": null,
          "iswarningtip": null,
          "isclean": null,
          "othersafe": null,
          "rivers": null,
          "orgnm": null,
          "yearbuild": null,
          "volume": null,
          "supplywater": null,
          "benefits": null,
          "actarea": null,
          "isnormbenefit": null,
          "notreason": null,
          "isreinforcement": null,
          "isrenovate": null,
          "isexpansion": null,
          "seqno": null,
          "len": null,
          "paths": null,
          "phase": null,
          "location": null,
          "defenseDepart": null,
          "defensePerson": null,
          "defensePhone": null,
          "buildCompany": null,
          "buildPerson": null,
          "buildPhone": null,
          "constructionCompany": null,
          "constructionPerson": null,
          "constructionPhone": null,
          "supervisorCompany": null,
          "supervisorPerson": null,
          "supervisorPhone": null,
          "company": null,
          "way": null,
          "type": null,
          "fixed": null,
          "personnels": null,
          "status": null,
          "person": null,
          "phone": null,
          "jdtype": null,
          "jdlevel": null,
          "communicationInfos": [],
          "sign": null,
          "altitude": 1191.0,
          "rvnm": null,
          "hnnm": null,
          "dangerRegionPopulation": null,
          "dangerRegionFamilyCount": null,
          "familyCount": null,
          "stnm_rel": null,
          "flood_cap": null,
          "riskLevelStr": null,
          "riskLevel": null,
          "riskTypeStr": null,
          "riskType": null,
          "damtypenm": null,
          "sttypenm": null,
          "is_automatic": null,
          "isautomatic": null,
          "xingzhengzrr": null,
          "technologzrr": null,
          "xunbazrr": null,
          "monitorzrr": null,
          "trasferzrr": null,
          "collectId": null,
          "latestW": null,
          "wlevel": null,
          "warning": null,
          "rotate": null,
          "personality": null,
          "tm": null,
          "drp": null,
          "dyp": null,
          "drp12": null,
          "drp24": null,
          "z": null,
          "q": null,
          "rz": null,
          "w": null,
          "tifValue": null,
          "tifLevel": null,
          "tifLevelName": null,
          "foreDrp": null,
          "count": null,
          "supNumber": null,
          "frgrd": null
        }
  useRootStoreWithOut().window.open({
    title: '周边查询',
    id:'BaseInfo2',
    offset:{top:0,right:0},
    sizes:['700px', '100vh'],
    // content:() => import('/@/components/AroundQuery/src/AroundQuery.vue'),
    content:() => import('/@/components/Explorer/src/components/Reservoir/BaseInfo/BaseInfo.vue'),
    props:{
      target,
      options: {
        //@ts-ignore
        loader: ({ target }) => {
          const params = {
            stcd: target?.stcd ?? target?.mocd,
          };
          return findRsvrStation(params);
        },
      },
    }
  })
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
