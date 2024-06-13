<script lang="ts" setup>
  import { computed } from 'vue';
  import {usePermissionStore} from "/@/store/modules/permission";
  const permissionStore = usePermissionStore();
  const menus = computed(() => permissionStore.getBackMenuList ?? []);
  function handler() {}
</script>
<template>
  <div class="flex items-center justify-end h-full">
  </div>
</template>

<style lang="scss">
</style>
