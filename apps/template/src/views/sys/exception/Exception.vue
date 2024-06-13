<script lang="ts" setup>
import {SvgIcon} from "@dfsj/components";
import {PageEnum} from "/@/enums/pageEnum";
function reload() {
  window.location.reload()
}
</script>
<template>
   <div class="h-full w-full flex justify-center items-center flex-col">
     <SvgIcon  :name="'error-except'" size="700"/>

     <div class="flex justify-center items-center">

         <el-button
           type="primary"
           link
       >  <router-link :to="PageEnum.BASE_LOGIN">
         重新登录

       </router-link>
         </el-button>
       <el-button
           type="primary"
           link
           @click="reload"
       >刷新</el-button>
     </div>

    </div>
</template>
<style>

</style>
