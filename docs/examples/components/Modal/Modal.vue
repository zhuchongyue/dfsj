<template>
  <div class="h-20px ">
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
        内容
      </div>
    </BasicModal>
    <el-button @click="open">打开弹窗</el-button>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import {BasicModal} from '@dfsj/components';

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}
</script>