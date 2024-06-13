<script setup lang="tsx">
import {ref} from 'vue';
import {BasicModal} from '@dfsj/components';

const visible = ref(true);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}


</script>

<template>
  <el-button @click="open"> 打开弹窗</el-button>
  <el-button @click="close"> 关闭</el-button>

  <BasicModal
      :header="true"
      :visible="visible"
      :footer="false"
      @close="visible = false"
      :offset="{ top: '200px', left: '20%' }"
  >
    <template #titleAfter>
      <div> ssss</div>
    </template>
    <!--    <template #mover>-->
    <!--      <div> 拖拽的自定义头部 </div>-->
    <!--    </template>-->
    <div class="w-200px h-200px">
      fsdkjfhsfj
    </div>
  </BasicModal>
</template>
