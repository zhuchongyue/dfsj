<script lang="ts" setup>
import {computed, onMounted, ref, toRaw, unref, watchEffect} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
const useStore = useUserStore();
const {prefixCls} = useDesign('component-left-page');

onMounted(()=>{

})

</script>
<template>
  <div :class="prefixCls">
    左侧的内容
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-left-page;
.#{$prefix-cls} {
}
</style>