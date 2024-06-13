<script lang="ts" setup>
import SvgIcon from "/@/components/Icon/src/SvgIcon.vue";
import {PageEnum} from "/@/enums/pageEnum";
</script>
<template>
   <div class="h-full w-full flex justify-center items-center flex-col">
     <SvgIcon  :name="'status-develop'" size="600"/>
     <div class="flex justify-center items-center">
         <el-button
           type="primary"
           link
       >
         功能开发中...
         </el-button>
     </div>
    </div>
</template>
<style>

</style>
