<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, toRaw, unref, watchEffect} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
import {useRootStoreWithOut} from "@/store/root.ts";

const useStore = useUserStore();
const {prefixCls} = useDesign('module-main-page');

onMounted(() => {
  useRootStoreWithOut().board.show({
    position: 'west',
    id: 'main-left-board',
    label: '首页左侧面板',
    content: () => import('./LeftBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });
  useRootStoreWithOut().board.show({
    position: 'west',
    id: 'main-left-board2',
    label: '首页左侧面板',
    content: () => import('./LeftBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });


  useRootStoreWithOut().board.show({
    position: 'east',
    id: 'main-left-board',
    label: '首页左侧面板',
    content: () => import('./RightBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });
  useRootStoreWithOut().board.show({
    position: 'east',
    id: 'main-left-board2',
    label: '首页左侧面板',
    content: () => import('./RightBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });

  useRootStoreWithOut().board.show({
    position: 'top',
    id: 'main-top-board',
    label: '上侧面板',
    content: () => import('./LeftBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });
  useRootStoreWithOut().board.show({
    position: 'top',
    id: 'main-top-board2',
    label: '上侧面板',
    content: () => import('./LeftBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });

  useRootStoreWithOut().board.show({
    position: 'south',
    id: 'main-south-board',
    label: '下侧面板',
    content: () => import('./RightBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });
  useRootStoreWithOut().board.show({
    position: 'south',
    id: 'main-south-board2',
    label: '下侧面板',
    content: () => import('./RightBorde.vue'),
    props: {
      responseId: 'xxx',
    },
  });
})

onBeforeUnmount(() => {
  useRootStoreWithOut().board.clear()
})

</script>
<template>
  <div :class="prefixCls">
    index 组件
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-module-main-page;
.#{$prefix-cls} {
}
</style>