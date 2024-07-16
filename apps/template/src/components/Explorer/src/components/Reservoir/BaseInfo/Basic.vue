<script lang="tsx" setup>
import {reactive, ref, toRefs} from "vue";
import {Descriptions, Form, useForm} from "@dfsj/components";
import {Action, compProps, updateStStbprpB} from "@/components/Explorer";
import {useBasic} from "./tsx/useBasic.tsx";
import {useAction} from "@/components/Explorer/src/components/Common/Action/useAction.ts";
const {formRegister, formMethods} = useForm();
const props = defineProps(compProps);
const {target} = toRefs(props)
const form = reactive(target.value)
const formRef = ref(null);
//接口信息
const callback = {
  refresh:()=>props?.refresh({target:target.value}),
  edit:updateStStbprpB
}
const {disabled, hander} = useAction(form, formMethods,callback)
const {schema, rules} = useBasic(form, disabled)
</script>
<template>
  <div :class="`box-border h-full w-full relative`">
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
