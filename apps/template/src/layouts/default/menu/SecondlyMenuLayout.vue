<script lang="ts" setup>
import {computed, ref, watchEffect} from 'vue';
import {useMenuStore} from "/@/store/modules/menu.ts";
import SliderMenuLayout from "/@/layouts/default/menu/slider/SliderMenuLayout.vue";
const menuStore = useMenuStore();
const secondlyMenu = computed(() => menuStore?.primary?.subs ?? []);
const activeName = ref(secondlyMenu.value?.[0]?.name);
watchEffect(()=>{
  console.log('secondlyMenu',secondlyMenu.value)
})
function handler() {}
</script>
<template>
  <div class="h-full" style="max-width: 300px">
<!-- 侧边的二级菜单-->
    <SliderMenuLayout
      :menu-items="secondlyMenu"
      v-model="activeName"
    />
  </div>
</template>

<style lang="scss">
</style>
