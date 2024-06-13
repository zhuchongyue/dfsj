<script lang="ts" setup>
import {computed, ref, toRaw, unref, watchEffect} from "vue";
const menuStore = useMenuStore();
const secondlyMenu = computed(() => menuStore?.primary?.subs ?? []);
const activeName = ref(secondlyMenu.value?.[0]?.name);
import SliderMenuLayout from "/@/layouts/default/menu/slider/SliderMenuLayout.vue";
import {useMenuStore} from "/@/store/modules/menu.ts";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {ComponentsMap} from "/@/views/system/componentsMap.ts";
const {prefixCls} = useDesign('module-system-page');

const renderComponent =  computed(()=>{
  return ComponentsMap?.[toRaw(unref(activeName))] ?? null
})
watchEffect(()=>{
  console.log('异步组件',renderComponent.value)
})
</script>
<template>
  <div :class="prefixCls">
    <!-- 侧边的二级菜单-->
    <SliderMenuLayout
        :menu-items="secondlyMenu"
        v-model="activeName"
    />

    <div  :class="`${prefixCls}__component-wrapper`">
      <div class="h-full right-part">
        <template v-if="renderComponent">
          <component
              :is="renderComponent"
          />
        </template>
        <div v-else>{{ activeName?.label }}相应组件匹配，请设置</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-module-system-page;
.#{$prefix-cls} {
  display: grid;
  height: 100%;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  grid-template-columns: minmax(0, 236px) minmax(0, 1fr);
  &__component-wrapper{
     @apply h-full;
  }
}
</style>