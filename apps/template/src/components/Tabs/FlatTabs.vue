<script setup lang="ts" name="FlatTabs">
import dayjs from 'dayjs';
type Mode = 'Vertical' | 'Horizontal'

interface IOption {
  label: string,
  value: number | string,
  [key: string]: any
}
interface IField {
  value:string,
  label:string
}


interface IProps {
  mode: Mode,
  options: Array<IOption>,
  field:IField,
  className: string,
  defaultValue:string | string
}
const emits  = defineEmits(['change'])

const props = withDefaults(defineProps<IProps>(), {
  mode: 'Horizontal',
  options: () => [{
    label: '1',
    value: 1
  }],
  defaultValue: '',
  className: '',
  field:()=>({
    label:'label',
    value:'value'
  })
})
const {  field } = toRefs(props)

const state = reactive({
   active:null
})

const handleClick = (item:IOption ,index:number = 0)=>{
  if (state.active?.[field.value.value] == item?.[field.value.value]) return;
  state.active = {...item,index}
  emits('change' ,state.active)
}
onMounted(()=>{
   if (props.defaultValue){
     state.active = props?.defaultValue;
   }else{
     state.active = props?.options[0]
   }
})

watch(()=>state.active , (n)=>{
  // console.log({n, o})
  // console.log('state.active',state.active)
    // emits('change' ,n)
  if (n?.id != state.active?.id ){
    emits('change' ,n)
  }
})
watch(()=>props.defaultValue,(n,o)=>{
  console.log({n, o})
  // console.log('state.active',state.active)
  if (n?.id != state.active?.id ){
    state.active = n;
  }
})

// watch(()=>props.options,(n,o)=>{
//   console.log({n, o})
//   // console.log('state.active',state.active)
//   if (n?.length > 0 ){
//     state.active = n[0];
//   }
// })

defineExpose({
  state
})

</script>
<template>
  <div :class="[props.className , 'flat-tabs-wrap']">
       <div v-for="(item , index) in props.options" :key="item?.[field.value] + index"
         :class="['flat-tabs-item flex flex-col flex-nowrap',
         {'flat-tabs-item-active':state.active?.[field.value] == item?.[field.value]}]"
         @click="handleClick(item,index)"
       >
        <div class="tab-info flex flex-row"><span class="info-time mr-2">{{ dayjs(item.updateTime).format('YYYY/MM/DD HH:mm')}}</span>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="item.updateBy"
            placement="top-start"
          > 
            <span class="info-name flex-1">{{item.updateBy}}</span>
          </el-tooltip>
        </div>
        <div class="tab-name">{{item?.[field.label]}}</div>
       </div>
  </div>
</template>
<style lang="scss">
.flat-tabs-wrap {
   width: 100%;
   display: flex;
   overflow: auto;
   flex-direction: column;
   .info-name, .tab-name {
    overflow: hidden;
    white-space: nowrap; 
    text-overflow: ellipsis; 
   }
  .flat-tabs-item{
    color: #3C485C;
    padding: 4px;
    border-radius: 4px;
    background: linear-gradient(178deg, #DAE2EB 11%, #FFFFFF 91%);
    box-shadow: -1px -1px 2px 0px #FFFFFF,1px 1px 2px 0px rgba(0, 0, 0, 0.3);
    margin-bottom: 12px;
    cursor: pointer;
  }
  .flat-tabs-item-active{
    background: linear-gradient(179deg, #0C76D6 8%, #5CA8ED 94%);
box-shadow: -1px -2px 2px 0px #FFFFFF,1px 1px 2px 0px rgba(0, 0, 0, 0.3);
    color: white;
  }
}
</style>