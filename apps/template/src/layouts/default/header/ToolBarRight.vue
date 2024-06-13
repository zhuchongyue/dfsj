<template>
  <div class="tool-bar-ri h-full">
    <div class="avatar-wrap">
          <Avatar/>
          <div class="absolute flex flex-col items-center justify-evenly  right-0 top-0 toolbar-page-wrap" >
            <Lock/>
            <Fullscreen id="fullscreen"/>
          </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import Lock from "./components/Lock.vue";
</script>
<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  //padding-right: 15px;
  margin-left: 35px;
}
.avatar-wrap{
  height: 100%;
  //width: 105px;
  width: 119px;
  background-image: url('/@/assets/images/avatar_1.png');
  display: flex;
  justify-content: center;
  padding-right: 20px;
  align-items: center;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  &:after{
    content: '';
    height: 100%;
    position: absolute;
    top: 0;
    left: -15px;
    width: 33px;
    bottom: 0;
    background-image: url('/@/assets/images/avatar_3.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
  &:before{
    content: '';
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -7px;
    width:123px ;
    background-image: url('/@/assets/images/avatar_2.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.toolbar-page-wrap{
  bottom: 20px;
  border-radius: 16px 0px 16px 16px;
  width: 26px;
  background: rgba(0, 0, 0, 0.15);
}
</style>