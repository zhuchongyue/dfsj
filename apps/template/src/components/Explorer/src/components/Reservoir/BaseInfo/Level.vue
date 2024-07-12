<script lang="ts" setup>
import {computed, reactive} from "vue";
import {useDesign} from "/src/hooks/web/useDesign.ts";
import {Table, TableColumn} from "@dfsj/components";

const {prefixCls} = useDesign('component-baseinfo-page');
const model = reactive({
  "stcd": "60800520",
  "stnm": "乌江渡电站",
  "rvnm": "乌江",
  "hnnm": "思南以上",
  "bsnm": "长江流域",
  "lgtd": 106.760973,
  "lttd": 27.319963,
  "stlc": "遵义市播州区乌江镇",
  "addvcd": "520304",
  "addvcd_2": null,
  "dtmnm": "黄海高程",
  "dtmel": null,
  "dtpr": null,
  "sttp": "RR",
  "frgrd": null,
  "esstym": null,
  "bgfrym": null,
  "atcunit": null,
  "admauth": null,
  "locality": null,
  "stbk": null,
  "stazt": null,
  "dstrvm": null,
  "drna": null,
  "incp": null,
  "phcd": null,
  "usfl": null,
  "comments": "水利厅2022年12月水库（数量2692座）",
  "moditime": null,
  "withPptn": null,
  "datasource": "水利厅2022年12月水库（数量2692座）",
  "updatetime": null,
  "createtime": null,
  "delFlag": null,
  "createtimeStr": null,
  "updatetimeStr": null,
  "rsvrtp": "1",
  "damel": null,
  "ckflz": 762.8,
  "dsflz": null,
  "normz": 760.0,
  "ddz": 720.0,
  "actz": null,
  "ttcp": 2300.0,
  "fldcp": null,
  "actcp": null,
  "ddcp": 780.0,
  "hhrz": null,
  "hmxw": null,
  "hhrztm": null,
  "hmxinq": null,
  "rstdr": null,
  "hmxinqtm": null,
  "hmxotq": null,
  "hmxotqtm": null,
  "hlrz": null,
  "hlrztm": null,
  "hmninq": null,
  "hmninqtm": null,
  "laz": null,
  "sfq": null,
  "fsl": [
    {
      "stcd": "60800520",
      "bgmd": "0501",
      "edmd": "0930",
      "fsltdz": 760.0,
      "fsltdw": null,
      "fstp": "1",
      "moditime": "2021-05-26 00:00:00",
      "datasource": null,
      "updatetime": null
    }
  ],
  "materialtp": "1",
  "materialtpName": "混凝土坝",
  "structuretp": "1",
  "structuretpName": "重力坝",
  "resCode": "60800520",
  "resName": "乌江渡电站",
  "lowLeftLong": 0.0,
  "lowLeftLat": 0.0,
  "upRightLong": 0.0,
  "upRightLat": 0.0,
  "resLoc": "遵义市播州区乌江镇",
  "resType": "1",
  "engGrad": "1",
  "engScal": "1",
  "watShedArea": 27790.0,
  "daadMulAverRuof": null,
  "uppLevFlco": null,
  "normWatLev": 760.0,
  "normPoolStagArea": 47.5,
  "normPoolStagCap": null,
  "flLowLimLev": 762.8,
  "flLowLimLevCap": null,
  "deadLev": 720.0,
  "totCap": 230000.0,
  "storFlCap": null,
  "flcoCap": null,
  "benResCap": null,
  "deadCap": 78000.0,
  "engStat": "3",
  "runStat": null,
  "startDate": null,
  "compDate": null,
  "admDep": null,
  "damCode": "60800520",
  "damName": "乌江渡电站",
  "startLong": null,
  "startLat": null,
  "endLong": null,
  "endLat": null,
  "damLoc": "遵义市播州区乌江镇",
  "ifMainDam": "1",
  "damGrad": "Ⅰ",
  "damMaxHeig": 165.0,
  "damTopLen": 395.0,
  "damTopWid": null,
  "damTypeMat": "1",
  "damTypeStr": "1",
  "auxiliaryDamNum": null,
  "auxiliaryDamLen": null,
  "auxiliaryDamMaxHeight": null,
  "inqa": null,
  "factoryForm": null,
  "mwrtbdtp": "1",
  "dmbsspms": null,
  "dscncltp": null,
  "fhgcDscnList": null,
  "plmvppqn": null,
  "mvppqn": null,
  "prodpop": null,
  "irrigatedArea": null,
  "protectedObj": null,
  "admAuth": 2,
  "videoDevice": 1,
  "waterLevelDevice": 1,
  "floodType": 1,
  "taskIrrigate": 0,
  "taskFlood": 0,
  "taskWater": 0,
  "taskPower": 0,
  "topRsvr": null,
  "riskRsvr": null,
  "barrage": 2,
  "fsltdzDesc": null,
  "normw": 2140.0,
  "established": 1,
  "rsvrTasks": [
    99
  ],
  "registrationNo": null,
  "formerStnm": null,
  "category": null,
  "projectOverview": null,
  "unitManage1": null,
  "unitManage2": null,
  "sdstcp": null,
  "dsflst": null,
  "chflst": null,
  "dsflfl": null,
  "chflfl": null,
  "dflmd": null,
  "cflmd": null,
  "dwchsfds": null,
  "storageDate": null,
  "supplyTown": null,
  "supplyVillage": null,
  "province": "贵州省",
  "city": "遵义市",
  "county": "播州区",
  "town": "乌江镇",
  "riverCodeMo": null,
  "riverSegCode": null,
  "riverName": null,
  "eacid": null,
  "motype": 1,
  "inbtcgel": null,
  "fsltdz": 760.0
});
const columns: TableColumn[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    field: '',
  },
  {
    label: '开始日月',
    field: 'bgmd',
    align: 'center',
  },
  {
    label: '结束日月',
    field: 'edmd',
    align: 'center',
  },
  {
    label: '汛限水位',
    field: 'fsltdz',
    align: 'center',
  },
  {
    label: '汛限库容',
    field: 'fsltdw',
    align: 'center',
  },
  {
    label: '汛期类别',
    field: 'fstp',
    align: 'center',
  },
  {
    label: '操作',
    field: 'action',
    align: 'center',
  },
];
function sureRemove(row) {

}

const dataList = computed(() => model.fsl)
</script>
<template>
  <div :class="`${prefixCls} h-full w-full`">
    <Table
        :height="'100%'"
        :header-align="'center'"
        stripe
        :columns="columns"
        :data="dataList"
        :pagination="null"
    >
      <template #action="{ row }">
            <span class="flex items-center justify-center">
              <el-button text link type="danger" @click="sureRemove(row)">删除</el-button>
            </span>
      </template>
    </Table>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-baseinfo-page;
.#{$prefix-cls} {

}
</style>