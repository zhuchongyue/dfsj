<script lang="ts" setup>
import {useDesign} from '/@/hooks/web/useDesign';
import ToolBarRight from '/@/layouts/default/header/ToolBarRight.vue';
import SysTime from '/@/layouts/default/header/components/SysTime.vue';
import {useUserStore} from "/@/store/modules/user";
import PrimaryMenuLayout from "/@/layouts/default/menu/PrimaryMenuLayout.vue";

const {prefixCls} = useDesign('basic-header-layout');
const store = useUserStore()

function reload() {
  location.reload(true); // 深度刷新
}

const appIcon = window.globalEnvs?.appIcon;
</script>
<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__appName`" class="sys-name h-full relative">
      <img
          @click.stop="reload"
          class="cursor-pointer"
          title="刷新系统页面"
          :src="appIcon" style="border: none"/>
    </div>
    <SysTime/>
    <PrimaryMenuLayout/>
    <ToolBarRight/>
  </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-basic-header-layout;

[data-theme-name='flood'] .#{$prefixCls} {
  @include set-ratio-bg-image('/@/assets/images/theme/flood/header_bg');
}

[data-theme-name='four'] .#{$prefixCls} {
  @include set-ratio-bg-image('/@/assets/images/theme/four/header_bg');
}

.#{$prefixCls} {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  height: $HEADER_HEIGHT;
  background-size: cover;
  border-width: 0px 0px 2px 0px;
  border-style: solid;
  border-color: #23d4be;

  &__appName {
    display: flex;
    height: $HEADER_HEIGHT;
    overflow: hidden;
    flex-direction: column;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
