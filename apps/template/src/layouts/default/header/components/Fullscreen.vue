<template>
  <div class="fullscreen cursor-pointer flex">
    <Icon
        color="#fff"
        size="20"
        @click="handleFullScreen"
        :icon="!isFullscreen ? 'material-symbols:fit-screen':'icon-park-outline:off-screen'"
    />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import screenfull from "screenfull";
import {Icon} from "@dfsj/components";

const isFullscreen = ref(screenfull.isFullscreen);

onMounted(() => {
  screenfull.on("change", () => {
    if (screenfull.isFullscreen) isFullscreen.value = true;
    else isFullscreen.value = false;
  });
});

const handleFullScreen = () => {
  if (!screenfull.isEnabled) ElMessage.warning("当前您的浏览器不支持全屏 ❌");
  screenfull.toggle();
};
</script>
