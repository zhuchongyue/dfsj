<script lang="tsx" setup>
import {reactive, ref, toRefs} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {Descriptions, Form, useForm} from "@dfsj/components";
import {Action, compProps, updateStStbprpB, useAction} from "@/components/Explorer";
import {useBasic} from "./tsx/useBasic.tsx";

const {prefixCls} = useDesign('component-baseinfo-page');
const {formRegister, formMethods} = useForm();
const props = defineProps(compProps);
const {target} = toRefs(props)
const form = reactive(target.value)
//接口信息
const callback = {
  refresh:()=>props?.refresh({target:target.value}),
  edit:updateStStbprpB
}
const {disabled, hander} = useAction(form, formMethods,callback)
const formRef =ref(null)
const { schema ,rules} = useBasic(form , disabled)
</script>
<template>
  <div :class="`${prefixCls} h-full w-full relative`">
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

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-component-baseinfo-pages;
.#{$prefix-cls} {

}
</style>