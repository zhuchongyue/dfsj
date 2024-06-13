<script setup lang="ts">
import {computed, toRefs} from "vue";
import {useFullscreen} from '@vueuse/core';
import {Icon} from "../../Icon";
import propTypes from '../../../utils/propTypes';

const props = defineProps({
  domRef:propTypes.any,
  stop:propTypes.func,
  play:propTypes.func,
  isPlay:propTypes.bool,
  isFullscreen:propTypes.bool,
  toggleFullscreenFn:propTypes.func,
})
const { domRef , isPlay , isFullscreen} = toRefs(props)
console.log('props',props.domRef)
const { toggle: toggleDom } = useFullscreen(domRef.value);
const getAttr = computed(()=>{
  return {
    color:"#fff",
    size:24
  }
})

function playToggle() {
   if (isPlay.value){
     props.stop?.()
   }else {
     props.play?.()
   }
}
function fullToggle() {
  toggleDom()
  props.toggleFullscreenFn?.()
}


</script>

<template>
  <div class="video-player-toolbar">
    <slot/>
     <Icon  :icon=" !isFullscreen ? 'mdi:fullscreen':'mdi:fit-to-screen'"
            v-bind="getAttr" @click.stop="fullToggle" />
     <Icon  :icon="!isPlay ? 'mdi:play-circle-outline':'mdi:pause-circle'"   @click.stop="()=> playToggle()" v-bind="getAttr" />

  </div>
</template>
