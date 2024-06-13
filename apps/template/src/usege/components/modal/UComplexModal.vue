<script setup lang="tsx">
// import { BasicModal } from '@dfsj/components/src/components/Modal';
import {computed, h, ref} from 'vue';
import {useRootStoreWithOut} from '../../../store/root.ts';
// import Windows from '../../../components/WindowsContainer/Windows.vue';
import {Windows} from '@dfsj/components';

const visible = ref(true);
  const root = useRootStoreWithOut();
  const windows = computed(() => root.window.state);

  function open() {
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  let i = 1;

  const titleAfter = () => {
    return h('div', { class: 'version-desc' }, `发布时间：`);
    // return <TitleAfter />;
  };

  function mutil() {
    useRootStoreWithOut().window.open({
      id: 'feedback-detail' + i,
      title: '响应反馈详细',
      sizes: ['40vw', '50vh'],
      content: () => import('./ProcessFeedback.vue'),
      titleAfter: titleAfter,
      props: {
        responseId: 'xxx',
      },
    });
    i++;
  }
</script>

<template>
  <el-button @click="mutil"> 打开弹窗(多个)</el-button>
<!--  <el-button @click="open"> 打开弹窗</el-button>-->
<!--  <el-button @click="close"> 关闭</el-button>-->


  <Windows
    :items="windows.items"
    :front="windows.front"
    :layer="windows.layer"
  />
</template>
