<script lang="ts" setup>
import Dynamic from "../../../views/dynamic/Dynamic.vue";
import Dashboard from "../../../views/dynamic/dashboard/Dashboard.vue";
</script>
<template>
    <div class="dynamic-layout-content h-full w-full min-w-0">
         <Dynamic />
         <Dashboard/>
    </div>
</template>
<style lang="scss">

.dynamic-layout-content{
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 20%;
}
</style>
