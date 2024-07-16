<script lang="ts" setup>
import {reactive, toRefs} from "vue";
import {Descriptions, Form, useForm} from "@dfsj/components";
import {Action, compProps, updateRsvrProject, useAction} from "@/components/Explorer";
import {useDamPower} from "./tsx/useDamPower.tsx";
const { formRegister, formMethods } = useForm();
const props = defineProps(compProps);
const {target} = toRefs(props)
const form = reactive(target.value)
//接口信息
const callback = {
  refresh:()=>props?.refresh({target:target.value}),
  edit:updateRsvrProject
}
const {disabled, hander} = useAction(form, formMethods,callback)
const { rules ,schema } = useDamPower(form,disabled)
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
