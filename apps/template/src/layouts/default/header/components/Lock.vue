<template>
  <div class="lock flex cursor-pointer">
    <Icon
        color="#fff"
        size="20"
        class="cursor-pointer"
        :icon="'material-symbols:lock'"
        @click="handleLock"
    />
  </div>
</template>

<script setup lang="ts">

import {Icon} from "@dfsj/components";
import {defineAsyncComponent} from "vue";
function handleLock() {
  // addDialog({
  //   title:'锁定屏幕',
  //   height:'40vh',
  //   width:'60vh',
  //   contentRenderer:defineAsyncComponent(()=>import("/@/views/sys/lock/LockModal.vue"))
  // });
}
</script>
