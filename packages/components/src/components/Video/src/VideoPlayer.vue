<script setup lang="ts">
import {getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, toRaw, unref} from "vue"
import VideoPlayerToolbar from "./VideoPlayerToolbar.vue"
import {EventEnum} from "./enums/CommonEnum";
import VideoFactory from "./control/VideoFactory";
import propTypes from '../../../utils/propTypes';

let instance = null;
const wrapEl = ref()
const isPlay = ref(false);
const isFullscreen =ref(false)
const props = defineProps({
  host:propTypes.string,
  port:propTypes.string,
  channel:propTypes.string,
  username:propTypes.string,
  password:propTypes.string,
  streamType:propTypes.string,
  videoType:propTypes.string.def('Hikvision'),
})
const componentId = getCurrentInstance()?.uid;
onMounted(()=>{
 nextTick(()=>{
   instance = VideoFactory.create(props.videoType,{
     wrapEl:wrapEl.value,
     elId:componentId,
     ...toRaw(unref(props))
   })
   instance.on(EventEnum.PLAY,(ev)=>{
     console.log('开始播放',{ev})
     isPlay.value = true;
   })
   instance.on(EventEnum.PAUSE,(ev)=>{
     console.log('结束播放',{ev})
     isPlay.value = false;
   })
 })
})
function stop() {
  console.log('props.control',instance)
  instance?.stop?.()
}

function play() {
  console.log('props.control',instance)
  instance?.play?.()
}

function toggleFullScreen() {
  isFullscreen.value = !isFullscreen.value
  instance.fullScreen(isFullscreen.value)
}

onBeforeUnmount(()=>{
  instance?.dispose?.();
  instance= null;
})

function downloadFile() {
  const fileUrl = 'libs/hikvision/WebComponentsKit.exe'; // 文件的相对路径
  console.log('fileUrl',fileUrl)
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = 'WebComponentsKit.exe'; // 下载文件的名称
  link.click();
}


</script>
<template>
  <div  ref="wrapEl" class="wrap-el">
    
    <VideoPlayerToolbar
           v-if="wrapEl"
           :stop="stop"
           :play="play"
           :isPlay="isPlay"
           :isFullscreen="isFullscreen"
           :toggle-fullscreen-fn="toggleFullScreen"
           :dom-ref="wrapEl" >
        <span style="color: white">
          
          <span @click.stop="downloadFile">下载插件</span>
          
          {{componentId}}</span>
      
      </VideoPlayerToolbar>

  </div>
</template>