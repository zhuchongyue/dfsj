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
import {useRootStoreWithOut} from "@/store/root.ts";
function handleLock() {
  useRootStoreWithOut().window.open({
    id:'lock-modal-page',
    title:'锁定屏幕',
    sizes:['60vh','40vh'],
    content:()=>import("/@/views/sys/lock/LockModal.vue")
  })
}
</script>
