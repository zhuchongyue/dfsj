<script lang="ts" setup  name="">
import {onMounted, ref, watch} from 'vue';
import {get} from 'lodash-es';
import RenderFormByCfgVue from "/@/components/RenderFormByCfg.vue";
import StationFormCfg from "./details";
import {findRsvrStation,} from "../../api";

interface IProps {
  disabled: Boolean,
  target: Object,
  actionType: String,
}
const props = withDefaults(defineProps<IProps>(), {
  disabled: () => true,
  target: () => ({}),
  actionType: () => 'modify'
})

const emit = defineEmits(['close'])
const config = ref(StationFormCfg)
const requiredColums = ref([])   

// 将配置数据转换为响应式表单对象
const tranferCfgToFormData = (config) => {
  const obj = {}
  requiredColums.value = []
  for (let i = 0; i < config.configs.length; i++) {
    let level1 = config.configs[i]
    for (let i1 = 0; i1 < level1.configs.length; i1++) {
      let level2 = level1.configs[i1]
      for (let i2 = 0; i2 < level2.length; i2++) {
        // 赋值
        obj[level2[i2].mapColumn] = level2[i2]?.defaultValue || ''
        // const path = level2[i2].mapColumn;
        // const value = level2[i2].defaultValue || null
        // set(obj, path, value)
        if (level2[i2].isRequred) {  //把需要做校验的必填字段存起来
          requiredColums.value.push({
            label:level2[i2].label,
            field:level2[i2].mapColumn
          })
        }
      }
    }
  }
  return obj
}

const initFormObj = tranferCfgToFormData(config.value)
const formObj: any = ref(initFormObj)

const reportTypeChange = ()=>{
    validFailList.value.length = 0
    config.value = StationFormCfg//moduleMapping[val] // 没有其他类型的数据
    if(config.value){
      const initFormObj = tranferCfgToFormData(config.value)
      resetFormObj(initFormObj)
    }
   
}

// 切换上报类型   重置表单对象   不可直接赋值  会失去响应式
const resetFormObj = (initFormObj)=>{
  for(let key in formObj.value){
       delete formObj.value[key]
    }
  for(let key in initFormObj){
        formObj.value[key] = initFormObj[key]
      }
}


/* 校验相关 */
const validFailList = ref([])


// 获取上报详情
const getReportDetail = () => {
  // reportTypeChange()  
  // setFormValue(target)
  findRsvrStation({ stcd: props.target.stcd }).then(res => {
    if(res){
      reportTypeChange()  
      setFormValue(res)
    }
  })
}


const setFormValue = (res)=>{
  // 设置初始值
  Object.keys(formObj.value).forEach(path => {
    if (path == 'type') {
      formObj.value[path] = String(get(res, path, ''))
    } else {
      formObj.value[path] = get(res, path, '')
    }
  })

}

watch(() => props.target, () => {
  // 查询信息-->回填
  if (props.actionType == 'modify' && props.target != null) {
    getReportDetail()
  }
}, {
  deep: true
});

onMounted(()=>{
  // 查询信息-->回填
  if (props.actionType == 'modify' && props.target != null) {
    getReportDetail()
  }
})

</script>

<template>
  <div class="station-report-form  w-full h-full flex flex-col overflow-hidden">
    <el-form :form="formObj" v-if="config" class="flex-1 pb-5 overflow-auto"  :disabled="disabled">
      <RenderFormByCfgVue :isEdit="props.actionType == 'modify'" :config="item" :formObj="formObj" v-for="(item, index) in config.configs"  :reportMode="formObj.reportMode" 
        :key="index" />
    </el-form>
  </div>
  
</template>

<style lang="scss">
.station-report-form{
  height: 100%;
  .el-form-item{
    align-items: center;
  }
  .render-form-by-cfg {
    border-top: none !important;
  }
  .render-form-by-cfg-col {
    width: 50%;
    display: flex;
    flex-direction: column;
    .col-label {
      // width: 185px !important;
      margin-bottom: 4px;
      justify-content: flex-start !important;
    }
    .col-content {
      // width: 40% !important;
      flex-grow: 0 !important;
    }
  }
  .title-subtitle {
    background: none !important;
    padding: 0px 0px 20px !important;
    position: relative;
    .main-text {
      color: #11848F;
      font-size: 18px;
    }
    &:after {
      position: absolute;
      content: '';
      bottom: 0px;
      left: -20px;
      right: -20px;
      border-bottom: 1px solid #DCDCDC;
    }
  }
}
.station-report-error-info {
  width: 500px;
}

</style>
