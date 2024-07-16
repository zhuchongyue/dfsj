<script lang="ts" setup>
import {computed, defineAsyncComponent, onMounted, ref, toRefs} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {rsvrTabsOptions} from "./config.ts";
import BasicTabs from "/src/components/Tabs/BasicTabs.vue"
import {compProps} from "@/components/Explorer";
import {isEmpty} from "@dfsj/utils";
const {prefixCls} = useDesign('rsvr-baseinfo-page');
const current = ref(1);
const props = defineProps(compProps);
const { target } = toRefs(props)
const { options } = props;
const componentMap = {
  1: defineAsyncComponent(()=> import("./Basic.vue")),
  2: defineAsyncComponent(()=> import("./Eigenvalue.vue")),
  3: defineAsyncComponent(()=> import("./DamPower.vue")),
  // 4: defineAsyncComponent(()=> import("./Basic.vue")),
  5: defineAsyncComponent(()=> import("./Level.vue")),
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
      :options="rsvrTabsOptions"
      v-model="current"
    />
   <template v-if="comp && !isEmpty(details)">
     <component
         :class="`${prefixCls}__content`"
         :is="comp"
         v-bind="getBindValue"
     />
   </template>

  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-rsvr-baseinfo-page;
$height:100%;
.#{$prefix-cls} {
  padding: 10px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100%;
  .el-col{
    display: flex;
  }
  &__content{
    height: 100%;
    overflow: hidden;
    padding: 10px 0;
    }
  .el-form{
     height: 100%;
     overflow-y: scroll;
  }
  .el-form-item--default{
     margin-bottom: 0px;
     height: $height;
  }
}
</style>