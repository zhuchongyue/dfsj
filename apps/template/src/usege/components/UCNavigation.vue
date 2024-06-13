<script lang="ts" setup>
import {ref} from 'vue'
import {menusConfig} from "./config.ts"
import {Icon} from "@dfsj/components";

const isCollapse = ref(false);

const emits  = defineEmits(['select'])
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleSelect = (index,indexPath,item,routeResult)=>{
  console.log('选则', {index, indexPath, item, routeResult});
  emits('select' , index)
}
</script>

<template>
  <div class="h-full">
    <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
    >

      <template v-for="(m ,index) in menusConfig " :key="m?.id">
        <el-sub-menu :index="m?.id"   v-if="m.children?.length">
          <template #title>
             <Icon :icon="m.icon" :size="26" />
            <span class="menu-item-title">{{m.title}}</span>
          </template>

          <template v-for="(mc ,cindex) in m.children" :key="mc?.id">
            <el-menu-item    :index="mc.id">{{mc.title}}</el-menu-item>
          </template>
        </el-sub-menu>

        <template v-else>
          <el-menu-item    :index="m.id">
            <template #title>
              <Icon :icon="m.icon" :size="26" />
              <span class="menu-item-title">{{m.title}}</span>
            </template>
          </el-menu-item>
        </template>


      </template>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.menu-item-title{
  margin-left: 12px;
}
</style>