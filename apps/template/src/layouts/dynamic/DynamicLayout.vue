<script setup lang="ts">

import LayoutWindow from "../default/window/LayoutWindow.vue";
import LayoutBoard from "../default/board/LayoutBoard.vue";
import LayoutContent from "./content/LayoutContent.vue";
</script>

<template>
  <div class="h-full w-full min-h-0 overflow-hidden">
    <LayoutContent/>
    <LayoutBoard/>
    <LayoutWindow/>
  </div>
</template>

<style scoped lang="scss">

</style>