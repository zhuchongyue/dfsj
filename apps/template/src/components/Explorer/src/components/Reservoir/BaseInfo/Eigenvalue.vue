<script lang="ts" setup>
import {reactive, ref, toRefs} from "vue";
import {Descriptions, Form, useForm} from "@dfsj/components";
import {useEigenvalue} from "./tsx/useEigenvalue.tsx";
import {Action, compProps, updateStRsvrFcchB, useAction} from "@/components/Explorer";
const { formRegister, formMethods } = useForm();
const props = defineProps(compProps);
const {target} = toRefs(props)
const form = reactive(target.value)
const formRef = ref(null);
//接口信息
const callback = {
  refresh:()=>props?.refresh({target:target.value}),
  edit:updateStRsvrFcchB
}
const {disabled, hander} = useAction(form, formMethods,callback)
const { rules ,schema } = useEigenvalue(form,disabled)
</script>
<template>
  <div :class="`box-border h-full w-full`">
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