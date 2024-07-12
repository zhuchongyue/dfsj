<script lang="ts" setup>
import {ref} from "vue";
import {useDesign} from "/src/hooks/web/useDesign.ts";
import {Icon} from "@dfsj/components";
import {ActionType} from "@/components/Explorer/src/components/Common/Action/useAction.ts";

const {prefixCls} = useDesign('component-action-page');
const editing = ref(false);
const editable = ref(true);
const emits = defineEmits(['change'])
function onEdit() {
    editing.value = true;
    emits('change',{
       type: ActionType.EDIT,
    })
}
function onCancel() {
  editing.value = false;
  editable.value = true;
  emits('change',{
    type: ActionType.CANCEL,
  })
}
function onSave() {
  editing.value = false;
  editable.value = true;
  emits('change',{
    type: ActionType.SAVE,
  })
}
</script>
<template>
  <div :class="`${prefixCls} absolute`">
    <template v-if="editable && !editing">
      <el-button type="primary" circle size="large" @click="onEdit">
        <template #icon>
          <Icon :size="26" icon="mdi:edit"/>
        </template>
      </el-button>
    </template>
    <template v-if="editing">
      <el-button type="success" circle size="large" @click="onSave">
        <template #icon>
          <Icon :size="26" icon="mdi:content-save-check"/>
        </template>
      </el-button>
      <el-button type="warning" circle size="large" @click="onCancel">
        <template #icon>
          <Icon :size="26" icon="mdi:cancel-bold"/>
        </template>
      </el-button>
    </template>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-action-page;
.#{$prefix-cls} {
  bottom: 10%;
  right: 10%;
  z-index: 1000;
}
</style>