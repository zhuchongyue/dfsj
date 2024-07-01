<template>
  <div class="propeditor" v-show="isShow" :style="props.style">
    <div v-for="(value, key) in graph.propDefs" :key="value.name">
      <div v-if="value.show === undefined || value.show === true" class="propItem">
        <span class="propName">{{ value.title }}:</span>
        <component
            :is="comps[value.type]"
            :value="getValue(value.name)"
            @input="(e) => (graph.props[value.name] = e)"
            :disabled="value.editable === false"
            :min="value.min"
            :max="value.max"
            :step="value.step"
            class="propValue"
        ></component>
      </div>
    </div>
    <div class="operation-btn">
      <el-button type="primary" @click="handleOperation('apply')">应用</el-button>
      <el-button type="danger" @click="handleOperation('del')">删除</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineExpose, ref, watch} from "vue";
import BooleanCheck from "./BooleanCheck.vue";
import ColorEditor from "./ColorEditor.vue";
import NumberEditor from "./NumberEditor.vue";
import TextEditor from "./TextEditor.vue";
const props=defineProps(['style'])
const emits = defineEmits(['operation'])
export type IOperation = 'del' | 'apply'
const isShow = ref(false);
const graph = ref<any>([]);
const comps = {
  number: NumberEditor,
  string: TextEditor,
  color: ColorEditor,
  boolean: BooleanCheck,
};

function getValue(name: any) {
  return graph.value.props[name];
}

function show(isShow0: boolean, graph0: any) {
  isShow.value = isShow0;
  if (isShow0) {
    // // 这里如果不将props置空，直接更新props
    // // 会导致vue复用之前的组件，导致编辑界面的组件不更新
    // // 所以用timeout异步更新props
    graph.value = {};
    setTimeout(() => {
      graph.value = graph0
    }, 0)
  }
}

const handleOperation = (type: IOperation) => {
  emits('operation', type)
}

watch(() => graph.value, (n, o) => {
  console.log('更改的属性发生变化了~', n, o)
}, {
  deep: true
})

defineExpose({
  show,
  graph
});
</script>

<style lang="scss">
.propeditor {
  position: absolute;
  float: right;
  top: 100px;
  left: calc(20px +  2.5vw);
  z-index: 99;
  background: black;
  max-width: 300px;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0px 3px 6px rgb(0 0 0 / 16%);
  //opacity: 0.9;
  border-radius: 4px;
  display: grid;
  gap: 5px;
  padding: 5px;

  .el-input__wrapper {
    background: transparent !important;
    background-color: transparent !important;

    .el-input__inner {
      color: white !important;
    }
  }

  .propItem {
    display: grid;
    grid-template-columns: minmax(0, 90px) minmax(0, 1fr);
    gap: 10px;
    grid-template-rows: 35px;

    .propName {
      color: #ddd;
      font-size: 14px;
      justify-content: flex-end;
      display: flex;
      align-items: center;
    }

    .propValue {
      border-radius: 2px;
      flex-grow: 2;
      color: #eee;
    }

    .propValue:disabled {
      color: #aaa;
      border-width: 0px;
    }
  }

  .operation-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}


</style>
