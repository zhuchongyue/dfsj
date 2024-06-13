<script lang="ts" setup>
import {emitter} from "@dfsj/utils";
import {EMittLayerTitle} from "@/enums/mittTypeEnum.ts"
import {GisSymbolKey} from "@/core/GisCache.ts";

const props = defineProps({
  layerTitleKey: {
    type: Symbol,
    default: () => GisSymbolKey.default
  }
})
const content = reactive({
  title: '',
  long: ''
})

function setTile({title = null, long = null}) {
  content.long = long
  content.title = title
}

function hideTitle() {
  content.title = null;
  content.long = null;
}

onMounted(() => {
  emitter.on(EMittLayerTitle.SHOW + props.layerTitleKey.toString(), setTile)
  emitter.on(EMittLayerTitle.HIDE + props.layerTitleKey.toString(), hideTitle)
})
onBeforeUnmount(() => {
  emitter.off(EMittLayerTitle.SHOW + props.layerTitleKey.toString(), setTile)
  emitter.off(EMittLayerTitle.HIDE + props.layerTitleKey.toString(), hideTitle)
})
</script>

<template>
  <Transition
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
      appear
  >
    <div class="component layer-title" v-if="content.long || content.title">
      <div class="content">
        <div class="main" :data-content="content.title">{{ content.title }}</div>
        <div class="subs" v-if="!!content?.long" :data-content="content?.long">
          {{ content?.long }}
        </div>
      </div>
    </div>
  </Transition>
</template>
<style lang="scss">
.component.layer-title {
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  pointer-events: none;
  font-family: SourceHanSansCN-Bold;
  .content {
    position: relative;
    justify-content: center;
    padding: 2px 10px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    flex-direction: column;
    min-width: 600px;
    box-shadow: 0 0 10px 3px #4048bf03;
  }
  .main {
    font-family: SourceHanSansCN-Bold;
    font-size: 30px;
    font-weight: bold;
    text-shadow: 0px 0px 10px #ffffff;
    text-stroke: 8px #ffffff;
    -webkit-text-stroke: 8px #ffffff;

    &:before {
      content: attr(data-content);
      position: absolute;
      color: #0d47a1;
      text-stroke: 0px #ffffff;
      -webkit-text-stroke: 0px #ffffff;
    }
  }

  .subs {
    font-family: SourceHanSansCN-Bold;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0em;
    text-shadow: 0px 0px 6px #ffffff;
    text-stroke: 3px #ffffff;
    -webkit-text-stroke: 3px #ffffff;

    &:before {
      content: attr(data-content);
      text-stroke: 0px #ffffff;
      -webkit-text-stroke: 0px #ffffff;
      position: absolute;
      color: #000;
    }
  }
}
</style>
