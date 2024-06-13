<script lang="ts" setup>
import {onMounted, getCurrentInstance, PropType, defineProps, nextTick, defineComponent, ref, unref} from "vue";
import NodeRender from "./NodeRender";
import NodeModel from "./NodeModel";
import CanvasNodeRender from "./CanvasNodeRender";
import {NodeAxis} from "./types";
import NullLayerProvider from "./NullLayerProvider";
import NodePlayer from "./interface/NodePlayer";
import TimerNodePlayer from "./TimerNodePlayer";
const def:NodeAxis.NodeOptions ={
  height: 40,
  width: "100%",
  track: {top: "20%"},
  label: {top: "55%"},
}
const props = defineProps({
  // 具体渲染节点的接口
  // render: Object as PropType<NodeRender>,
  config:Object,
  res:{
    type:Object
  }
})
const emits = defineEmits(['update:frame','register']);
const model: NodeModel = new NodeModel({...def, ...props.config});
const renderer: NodeRender = new CanvasNodeRender(model);
const player: NodePlayer = new TimerNodePlayer(model, renderer);
const container = ref()
const accept = (index: number | any) => emits("update:frame", index);
onMounted(() => {
  nextTick(() => {
    renderer.initialize(container.value as HTMLElement, accept);
    renderer.render();
    emits('register', {renderer,player});
  })
});
function update(provider:any) {
  renderer.update(provider);
  renderer.render();
}

defineExpose({
  renderer,
  update
})


</script>

<template>
  <div ref="container" class="component node-axis">

  </div>
</template>
