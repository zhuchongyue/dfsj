<script lang="ts" setup>
import {computed, defineAsyncComponent, onMounted, ref, toRefs} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {riverTabsOptions} from "./config.ts";
import BasicTabs from "/src/components/Tabs/BasicTabs.vue"
import {compProps} from "@/components/Explorer";
import {isEmpty} from "@dfsj/utils";

const {prefixCls} = useDesign('component-baseinfo-page');
const props = defineProps(compProps);
const { target } = toRefs(props)
const { options } = props;
const current = ref(1);
const componentMap = {
  1: defineAsyncComponent(()=> import("./Basic.vue")),
  2: defineAsyncComponent(()=> import("./Eigenvalue.vue")),
}
const comp = computed(()=>componentMap?.[current.value] ?? null);
const emits = defineEmits(['update:loading']);
const details = ref({})
onMounted(()=>{
  emits('update:loading', true);
  try {
    options?.loader({target:target.value}).then((data)=>{
      if (data)details.value = data;
    }).finally(()=>{
      emits('update:loading', false);
    })
  }catch (e){
    details.value = {};
  }
})

const getBindValue = computed(()=>{
  return {
    target: details.value,
    refresh:props.options?.loader
  }
});

</script>
<template>
  <div :class="`${prefixCls} h-full w-full`">
    <BasicTabs
      :options="riverTabsOptions"
      v-model="current"
    />
   <template v-if="comp && !isEmpty(details)">
     <component
         v-bind="getBindValue"
         :is="comp"
     />
   </template>

  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-baseinfo-page;
//$height:40px;
$height:100%;
.#{$prefix-cls} {
  padding: 10px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100%;
  //.el-form-item{
  //  &.headline{
  //    .el-form-item__label{
  //      color: $primary-color-6;
  //      font-size: 20px;
  //      font-weight: bolder;
  //    }
  //  }
  //}
  .el-form-item--default{
     margin-bottom: 0px;
     height: $height;
    .el-input__wrapper{
      //box-shadow: none;

    }
  //  .el-form-item__label{
  //    height: $height;
  //    border-right: .0625rem solid #ebeef5;
  //    border-top: .0625rem solid #ebeef5;
  //    font-size: .875rem;
  //    font-weight: 700;
  //    //text-align: right;
  //    word-wrap: break-word;
  //    color: #606266;
  //    background-color: rgba(205, 205, 205, .247);
  //  }
  }
}
</style>