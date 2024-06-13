<script lang="ts" setup>
import {watchEffect,ref,computed} from "vue";
import {propTypes} from "@dfsj/utils";
import {useDesign} from "/@/hooks/web/useDesign.ts";
const {prefixCls} = useDesign('component-slider-menu-page');
const props = defineProps({
  menuItems:propTypes.array.def([]),
  modelValue: propTypes.string.def(''),
});
const defaultActive = ref();
watchEffect(() => {
  defaultActive.value = props.modelValue;
});
const emit = defineEmits(['toggle-menu', 'update:model-value']);
const defaultOpeneds = computed(() => {
  return props.menuItems
      .filter((item) => {
        if (item.subs && item.isOpen) return true;
        return false;
      })
      .map((ele) => ele.name);
});

function selectMenu(index) {
  console.log(index, 'zqj log index');
  const selectItem = props.menuItems.find((item) => item.name === index);
  emit('toggle-menu', selectItem, index);
  emit('update:model-value', selectItem?.name);
}
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <div :class="prefixCls">
    <el-menu
        @select="selectMenu"
        :default-openeds="defaultOpeneds"
        :default-active="defaultActive"
    >
      <template v-for="item in props.menuItems">
        <el-sub-menu
            v-if="item.subs?.length"
            :key="item.name"
            :index="item.name"
        >
          <template #title>
            <span>{{ item.label }}  </span>
          </template>
          <el-menu-item
              v-for="ele in item.subs"
              :key="ele.name"
              :index="ele.name"
          >
            <span>{{ ele.label }} （{{item.name}}） </span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :key="item.name" :index="item.name">
          <span>{{ item.label }} （{{item.name}}）</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-component-slider-menu-page;
.#{$prefix-cls} {
  min-height: 100%;
  overflow-y: auto;
  border-right: solid 0.0625rem var(--el-menu-border-color);
  background-color: var(--el-menu-bg-color);
  padding:10px;
  :deep(.el-menu) {
    border-right: 0;
    --el-menu-item-height: 3rem;
    --el-menu-item-font-size: 1.125rem;
    .el-sub-menu{
      background:#f0f2f5 ;
      margin-bottom: 10px;
      .el-menu-item{
        &:first-child{
          margin-top: 10px;
        }
      }
    }
    .el-menu-item{
       background:#f0f2f5 ;
       margin-bottom: 10px;
       border-radius: 4px;
       color: #000;
      font-size: 16px;
      &.is-active{
        background: #11848f;
        span{
          color: white;
        }
      }
    }
    .el-sub-menu {
      .el-sub-menu__title {
        font: {
          weight: 700;
        }
      }
    }
  }
}
</style>
