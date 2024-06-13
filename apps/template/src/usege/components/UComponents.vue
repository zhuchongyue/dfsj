<script lang="ts" setup>
import {ref} from 'vue'
import UCNavigation from "/@/usege/components/UCNavigation.vue";
import {findNode} from "@dfsj/utils";
import "@dfsj/components/src/themes/index.ts"
import {menusConfig} from "/@/usege/components/config.ts";

const comp = ref()

const handleSelect = (id)=>{
 const node = findNode(menusConfig , (ele)=>ele.id == id);
  console.log('node',node)
  if (node) comp.value = node.components
}

</script>

<template>
   <div class="usages-component-page-wrap">
     <UCNavigation  @select="handleSelect" />
     <div class="usages-component-container">
       <component
           :is="comp"
       />
     </div>
   </div>
</template>

<style scoped lang="scss">
.usages-component-page-wrap{
   width: 100%;
   height: 100%;
   display: grid;
   grid-template-columns: 200px 1fr;
}
.usages-component-container{
  width: 100%;
  height: 100%;
  min-width: 0;
  position: relative;
  overflow: hidden;
}
</style>