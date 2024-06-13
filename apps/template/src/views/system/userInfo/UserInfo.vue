<script setup lang="ts">

import PersonInfo from "/@/views/system/userInfo/components/PersonInfo.vue";
import ModuleConfig from "/@/views/system/userInfo/components/ModuleConfig.vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import UserPsw from "/@/views/system/userInfo/components/UserPsw.vue";
import Setting from "/@/components/Setting/src/Setting.vue";
import AppDarkModeToggle from "/@/components/Application/src/AppDarkModeToggle.vue";
import AppGrayModeToggle from "/@/components/Application/src/AppGrayModeToggle.vue";
import AppColorWeekToggle from "/@/components/Application/src/AppColorWeekToggle.vue";


const {prefixCls} = useDesign('system-userinfo-page');

</script>

<template>
  <div :class="prefixCls">
    <PersonInfo/>
<!--    <ModuleConfig/>-->
<!--    <UserPsw/>-->
   <div>
     <Setting/>
     <AppDarkModeToggle/>
     <AppGrayModeToggle/>
     <AppColorWeekToggle/>
     <div class="h-80px w-80px bg-blue-500">2222</div>
   </div>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-system-userinfo-page;
.#{$prefix-cls} {
  display: grid;
  height: 100%;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  grid-template-columns: repeat(2,1fr);
}
</style>