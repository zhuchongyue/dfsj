<script lang="ts" setup>
import {ref,computed,nextTick} from "vue"
import {useToggle} from "@dfsj/hooks";
import {Icon} from "@dfsj/components";
const props = defineProps({
  width: {
    type: String,
    default: "20%",
    required: true,
  },
  reverse: {
    type: Boolean,
    default: false,
    required: true,
  },
  gap: {
    type: String,
    default: "10px",
  },
  drawOpen: {
    type: Boolean,
    default: true,
  },
  alwaysHide: {
    type: Boolean,
    default: false,
  }
})
const [toggleState,[useDrawerToggle]] = useToggle(props.drawOpen, !props.drawOpen);
const draggableWidth = ref(props.width);
const container = ref(null);
const computedWidth = computed(() => {
  if(props.alwaysHide){
    return {
      min: "0%",
      max: "100%"
    }
  }
  let max;
  let min = `${draggableWidth.value}`;
  if(toggleState.value){
    max =  `calc(100% - ${min})`
    max = `calc(${max} - ${props.gap})`
  }else{
    max = "100%"
  }
  return {
    min,
    max,
  }
})
function startDragging(){
  container.value.style= "z-index: 100001"
  nextTick(() => {
    container.value.addEventListener("mousemove",dragging);
    document.body.addEventListener("mouseup", stopDragging);
  })
}
function dragging(e){
  if(props.reverse){
    draggableWidth.value = `calc(100% - ${e.offsetX}px)`
  }else{
    draggableWidth.value = `${e.offsetX}px`
  }
}
function stopDragging(){
  container.value.style= "z-index: 0"
  container.value.removeEventListener("mousemove",dragging);
  document.body.removeEventListener("mouseup", stopDragging);
}
</script>
<template>
  <div class="telescopic-container">
    <div ref="container" class="relative h-full w-full cursor-ew-resize" style="z-index: 0"></div>
    <div :class="['left-wrapper',toggleState || reverse ? 'open' : 'close']" :style="{width: reverse ? computedWidth.max : computedWidth.min, zIndex: reverse? 2 : 3}" v-if="!alwaysHide || reverse">
      <div class="h-full w-full overflow-hidden">
        <slot name="left"></slot>
      </div>
      <template v-if="!reverse">
        <div class="toggle-btn" @click="useDrawerToggle">
          <Icon
              :icon="'mdi:chevron-left'"
              color="#fff"
              v-if="toggleState"
          />
          <Icon
              :icon="'mdi:chevron-right'"
              color="#fff"
              v-else
          />
        </div>
        <div class="draggable-line" @mousedown="startDragging" v-if="toggleState"></div>
      </template>
    </div>
    <div :class="['right-wrapper',toggleState || !reverse ? 'open' : 'close']" :style="{width: reverse ? computedWidth.min : computedWidth.max, zIndex: reverse ? 3 : 2}" v-if="!alwaysHide || !reverse">
      <div class="h-full w-full overflow-hidden">
        <slot name="right"></slot>
      </div>
      <template v-if="reverse">
        <div class="toggle-btn" @click="useDrawerToggle">
          <Icon
              :icon="'mdi:chevron-left'"
              color="#fff"
              v-if="!toggleState"
          />
          <Icon
              :icon="'mdi:chevron-right'"
              color="#fff"
              v-else
          />
        </div>
        <div class="draggable-line" @mousedown="startDragging" v-if="toggleState"></div>
      </template>
    </div>
  </div>
</template>
<style lang="scss">
.telescopic-container{
  display: flex;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .left-wrapper, .right-wrapper{
    background-color: #fff;
    transition: all 0.1s linear;
    overflow: visible;
    height: 100%;
    position: absolute;
    top: 0;
    &.open{
      transform: translateX(0);
    }
    .toggle-btn{
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      cursor: pointer;
      top: 50%;
      width: 18px;
      height: 80px;
      background: rgba(3, 19, 78, 0.12);
      backdrop-filter: blur(2px);
      box-shadow: 2px 1px 1px 0px rgba(0, 0, 0, 0.3), -2px -2px 2px 0px #FFFFFF;
    }
    .draggable-line{
      position: absolute;
      top: 0;
      height: 100%;
      width: 10px;
      cursor: ew-resize;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after{
        content: "";
        display: block;
        border-left: 1px #ccc dashed;
        height: 100%;
      }
    }
  }
  .left-wrapper{
    left: 0;
    .toggle-btn{
      right: 0;
      transform: translate(100%, -50%);
      clip-path: polygon(100% 18%, 100% 82%, 0% 100%, 0% 0%);
    }
    .draggable-line{
      right: 0;
      transform: translateX(50%);
    }
    &.close{
      transform: translateX(-100%);
    }
  }
  .right-wrapper{
    right: 0;
    .toggle-btn{
      left: 0;
      transform: translate(-100%, -50%);
      clip-path: polygon(100% 0%, 100% 100%, 0 82%, 0 18%);
    }
    .draggable-line{
      left: 0;
      transform: translateX(-50%);
    }
    &.close{
      transform: translateX(100%);
    }
  }
}
</style>