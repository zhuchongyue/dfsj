<script setup lang="tsx">
import {computed, onMounted, ref} from 'vue';
import {useRootStoreWithOut} from '../../../store/root.ts';
import {Boards} from '@dfsj/components';

const visible = ref(true);
  const root = useRootStoreWithOut();
  const east = computed(() => root.board.state.east);
  const top= computed(() => root.board.state.top);
  const west = computed(() => root.board.state.west);
  const south = computed(() => root.board.state.south);
  const full = computed(() => root.board.state.full);
  const none = computed(() => root.board.state.none);

  function open() {
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }
  let i = 1;
  function mutil(b) {
    // useRootStoreWithOut()
    useRootStoreWithOut().board.show({
      position:b.label,
      id: 'feedback-detail' + i,
      label: '测试面板' + i,
      sizes: ['40rem', '40rem'],
      content: () => import('./ProcessFeedback.vue'),
      props: {
        responseId: 'xxx',
        title: '测试面板' + i
      },
    });
    i++;
  }

  const boards = [
    {
      position:'右东',
      label:'east'
    },
    // {
    //   position:'上北',
    //   label:'top'
    // },
    {
      position:'左西',
      label:'west'
    },
    // {
    //   position:'下南',
    //   label:'south'
    // }, {
    //   position:'全',
    //   label:'full'
    // },
    // {
    //   position:'无',
    //   label:'none'
    // }
  ]


  onMounted(()=>{
    boards.forEach((e)=>{
       mutil(e)
    })
  })


</script>

<template>
  <el-button
       v-for="(b) in boards"
       :key="b.position"
      @click="mutil(b)"> 打开{{b.label}}【{{b.position}}】弹窗(多个)</el-button>
  <!-- 右东-->
  <Boards
    :board="east"
    position="east"
  />
  <!-- 左西-->
  <Boards
      :board="west"
       position="west"
  />
  <!-- 上北-->
  <Boards
      :board="top"
      position="top"
  />
  <!-- 下南-->
  <Boards
      :board="south"
      position="south"
  />
  <!-- 全-->
  <Boards
      :board="full"
      position="full"
  />
  <!-- 无-->
  <Boards
      :board="none"
      position="none"
  />
</template>
