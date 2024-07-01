<script setup lang="ts" name="IconPicker">
import {computed, reactive} from "vue";
import icons from './importIcon'
import {useDesign} from "@/hooks/web/useDesign.ts";
const state = reactive({
  name: '',
  selected: null,
  icons: icons
})
const {prefixCls} = useDesign('plot-icon-picker');
const emits = defineEmits(['selected'])
const selectedObj = computed(() => (icons as Array<any>).find((item: any) => item?.name == state.selected))
/** 前端搜索*/
const filterIcons = () => {
  state.icons = icons
  if (state.name) {
    state.icons = state.icons.filter((item: any) => item.name.includes(state.name))
  }
}
/** 选中图标*/
const setSelectIcon = (value: any) => {
  if (value == state.selected) return;
  state.selected = value
  emits('selected', value)
}
/** 重置状态*/
const reset = () => {
  state.name = ''
  state.selected = null
  state.icons = icons
}

defineExpose({
  state,
  selectedObj,
  setSelectIcon,
  reset
})

</script>


<template>
  <div :class="prefixCls">
    <div class="icon-list">
      <div
          class="svg-box"
          v-for="(item, index) in state.icons" :key="index"
          :style="{border: state.selected && item.name == state.selected ? ' 2px solid #6395f9': '2px solid  transparent'}"
          @click="setSelectIcon(item?.name)">
        <img :src="item.src" alt="">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

$prefix-cls: #{$namespace}-plot-icon-picker;
.#{$prefix-cls} {
  width: inherit;
  padding: 10px;
  box-sizing: border-box;

  .icon-list {
    max-height: 300px;
    overflow-y: scroll;
    padding-top: 5px;
    display: grid;
    grid-template-columns: repeat(8, 40px);
  }

  .icon-list span {
    display: inline-block;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .svg-box {
    /*height: 40px;*/
    /*width:40px;*/
    height: 30px;
    width: 30px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    border: 3px solid transparent;
    margin: 2px;
    color: transparent;
  }

  .svg-box img {
    height: 24px;
    width: auto;
    max-width: 24px;
  }

  .icon-list::-webkit-scrollbar {
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 0px;
  }

  .icon-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  .icon-list::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.1);
  }

}


</style>
