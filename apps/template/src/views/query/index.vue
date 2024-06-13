<script setup lang="ts">
import {usePermissionStore} from "/@/store/modules/permission.ts";
import {computed, toRaw, unref, shallowRef, watchEffect, ref, watch} from "vue";
import {findNode} from "@dfsj/utils";
import {useRouter} from "vue-router";
import {getRawRoute} from "/@/utils/route.ts";
import SliderMenu from "/@/views/query/components/SliderMenu.vue";
import {ComponentsMap} from "/@/views/query/componentsMap.ts";
import {useDesign} from "/@/hooks/web/useDesign.ts";
const permissionStore = usePermissionStore();
const backMenuList = computed(() => permissionStore.getBackMenuList ?? []);
const router = useRouter()
const {prefixCls} = useDesign('module-query-page');
const metaName = computed(()=>{
  const {name ,meta} = getRawRoute(unref(router.currentRoute));
  return name
})
const moduleSliderMenus = computed(()=>{
  const node = findNode(toRaw(unref(backMenuList)), (item:any) => item.name == metaName.value, {
    children: 'subs'
  })
  return node?.subs ?? []
})
// const activeName = ref(moduleSliderMenus.value?.[0]?.name);
const activeName = ref('listen_id_463');

function handleToggleMenu() {

}

const renderComponent =  computed(()=>{
  return ComponentsMap?.[activeName.value] ?? null
})
watch(()=>activeName.value , (value, oldValue, onCleanup)=>{
  console.log('ddddd',value)
},{
  deep:true
})

</script>


<template>
  <div :class="prefixCls">
    <SliderMenu
        @toggle-menu="handleToggleMenu"
        v-model="activeName"
        :menu-items="moduleSliderMenus"
    />
    <div class="h-full right-part">
      <component
          v-if="renderComponent"
          :is="renderComponent"
      />
      <div v-else>{{ activeName?.label }}相应组件匹配，请设置</div>
    </div>
  </div>

</template>

<style lang="scss">
$prefix-cls: #{$namespace}-module-query-page;
.#{$prefix-cls} {
  display: grid;
  height: 100%;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  grid-template-columns: 300px 1fr;
}
</style>