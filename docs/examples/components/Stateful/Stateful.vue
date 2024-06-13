<template>
  <div class="h-150px w-full overflow-hidden">
    <Stateful
        class="h-full"
        :value="error.stringify"
    >
      <div class="w-100px h-100px">xxx</div>
    </Stateful>
  </div>
  <el-divider></el-divider>
  <div class="h-150px w-full overflow-hidden">
    <Stateful
        class="h-full"
        :value="completedEmpty.stringify"
    >
      <div class="w-100px h-100px">xxx</div>

    </Stateful>
  </div>
  <el-divider></el-divider>
  <div class="h-150px w-full overflow-hidden">
    <Stateful
        class="h-full"
        :value="loading.stringify"
    >
      <div class="w-100px h-100px">xxx</div>
    </Stateful>
  </div>
</template>
<script setup lang="ts">

import {State, StateEnum, Stateful} from "@dfsj/components";
const error = new State(StateEnum.NONE)
error.error();
const completedEmpty = new State(StateEnum.NONE)
completedEmpty.completed(true);
const completed = new State(StateEnum.NONE)
completed.completed(false);
const loading = new State(StateEnum.NONE)
loading.loading();

</script>
