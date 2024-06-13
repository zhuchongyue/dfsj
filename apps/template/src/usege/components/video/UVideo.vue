<script setup lang="ts">
import {VideoPlayer} from "@dfsj/components"
import {computed} from "vue";

const getDaHuaConfig  = computed(()=>({
  ip: '172.168.1.247',
  port: 80,
  username: 'admin',
  password: 'admin123',
  channel:1,
  streamType:0,
  videoType:'DaHua'
}))

const getHikvisionConfig  = computed(()=>({
  ip: '172.168.1.247',
  port: 80,
  username: 'admin',
  password: 'admin123',
  channel:1,
  streamType:0,
  videoType:'Hikvision'
}))
</script>

<template>
  <div  >
    <div style="width: 600px;height: 400px">
      <VideoPlayer
         v-bind="getDaHuaConfig"
      />
    </div>

    <div style="width: 600px;height: 400px">
      <VideoPlayer
          v-bind="getHikvisionConfig"
      />
    </div>
  </div>
</template>