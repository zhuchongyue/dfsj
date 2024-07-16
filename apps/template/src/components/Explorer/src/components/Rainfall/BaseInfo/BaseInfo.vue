<script lang="ts" setup>
import {computed, onMounted, ref, toRefs} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {compProps} from "@/components/Explorer";
import {isEmpty} from "@dfsj/utils";
import Basic from "./Basic.vue";

const {prefixCls} = useDesign('rain-baseinfo-page');
const props = defineProps(compProps);
const { target } = toRefs(props)
const { options } = props;
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
   <template v-if="!isEmpty(details)">
     <Basic
         :class="`${prefixCls}__content`"
         v-bind="getBindValue"
     />
   </template>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-rain-baseinfo-page;
$height:100%;
.#{$prefix-cls} {
  padding: 10px;
  box-sizing: border-box;
  min-height: 100%;
  &__content{
    height: 100%;
    //overflow:auto;
  }
  .el-form-item--default{
     margin-bottom: 0px;
     height: $height;
  }
}
</style>