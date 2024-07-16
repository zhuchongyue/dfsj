<script lang="ts" setup>
import {ref, watch} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {Descriptions} from "@dfsj/components";
import {
  AttacheFiled,
  getFormPickModel,
  getFormSchema
} from "@/components/Explorer/src/components/Common/Attache/fields.ts";
import {isEmpty} from "@dfsj/utils";

const {prefixCls} = useDesign('component-attache-page');
const props = defineProps({
  target: {
    type: Object,
    default: () => ({})
  },
  fields: {
    type: Array as PropType<AttacheFiled[]>,
    default: () => ([])
  }
})
const schema = getFormSchema(props.fields)
const model = ref({});
watch(() => props.target, (value) => {
  if (!isEmpty(value)) {
    const values = getFormPickModel(props.fields, props.target)
    model.value = values;
  }
}, {
  immediate: true,
  deep: true,
})
</script>
<template>
  <div :class="prefixCls">
    <Descriptions
        :schema="schema"
        :data="model"
        :size="'small'"
    />
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-attache-page;
.#{$prefix-cls} {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;
  .el-col{
    display: flex;
  }
}
</style>