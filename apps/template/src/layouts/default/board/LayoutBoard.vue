<script lang="ts" setup>
import {Boards} from "@dfsj/components";
import {useRootStoreWithOut} from "/@/store/root";
import {computed} from "vue";

const root = useRootStoreWithOut();
const east = computed(() => root.board.state.east)
const west = computed(() => root.board.state.west)
const top = computed(() => root.board.state.top)
const south = computed(() => root.board.state.south)
const full = computed(() => root.board.state.full)

const westStyle = {
  fixed:['84px','','0',''],
  margin:'10px'
}
const eastStyle = {
  fixed:['84px','','0',''],
  margin:'10px'
}

const southStyle = {
  fixed:['','','',''],
  margin:'10px'
}
const topStyle = {
  fixed:['84px','','',''],
  margin:'10px',
  color:'red'
}
</script>
<template>
  <Boards
      :board="west"
      position="west"
      :customStyle="westStyle"

  />
  <Boards
      :board="east"
      position="east"
      :customStyle="eastStyle"
  />

    <Boards
        :board="south"
        position="south"
        :customStyle="southStyle"
    />

  <Boards
      :board="top"
      position="top"
      :customStyle="topStyle"
  />


<!--  <Boards-->
<!--      :board="full"-->
<!--      position="full"-->
<!--  />-->
</template>
<style lang="scss">


</style>
