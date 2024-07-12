<script lang="ts" setup>
import {reactive, toRefs} from "vue";
import {useDesign} from "/src/hooks/web/useDesign.ts";
import {Descriptions, Form, useForm} from "@dfsj/components";
import {useEigenvalue} from "./tsx/useEigenvalue.tsx";
import {Action, compProps, updateStRvFcchB, useAction} from "@/components/Explorer";

const {prefixCls} = useDesign('component-baseinfo-page');
const { formRegister, formMethods } = useForm();
const props = defineProps(compProps);
const {target} = toRefs(props)
const form = reactive(target.value)//接口信息
const callback = {
  refresh:()=>props?.refresh({target:target.value}),
  edit:updateStRvFcchB
}
const {disabled, hander} = useAction(form, formMethods,callback)
const { rules ,schema } = useEigenvalue(form,disabled)

</script>
<template>
  <div :class="`${prefixCls} h-full w-full`">
    <Form
        ref="formRef"
        @register="formRegister"
        :model="form"
        is-custom
        :rules="rules"
        :show-message="false"
    >
      <Descriptions
          :size="'small'"
          :schema="schema"
      />
    </Form>
    <Action @change="hander"/>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-baseinfo-page;
$height:40px;
.#{$prefix-cls} {
  padding: 10px;
  box-sizing: border-box;

}
</style>