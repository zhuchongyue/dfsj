<script lang="ts" setup>

import SecondlyMenuLayout from "/@/layouts/default/menu/SecondlyMenuLayout.vue";
</script>
<template>
    <div class="layout-content">
<!--       <SecondlyMenuLayout />-->
       <RouterView/>
    </div>
</template>
<style lang="scss">

.layout-content{
  height: calc(100% - $HEADER_HEIGHT);
  overflow: hidden;
  box-sizing: border-box;
  //& > div{
  //  @apply h-full;
  //}
}
</style>
