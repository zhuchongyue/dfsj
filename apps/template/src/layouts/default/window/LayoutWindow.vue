<script lang="ts" setup>
import {Boards, Windows} from "@dfsj/components";
import {useRootStoreWithOut} from "/@/store/root";
import {computed} from "vue";

const root = useRootStoreWithOut();
const windows  = computed(()=>root.window.state)
console.log('windows',windows)
</script>
<template>
  <Windows
      :items="windows.items"
      :front="windows.front"
      :layer="windows.layer"
  />
</template>
<style lang="scss">


</style>
