<script setup lang="ts">
import {computed, defineProps} from 'vue';
import {headerProps} from '../props';
import Icon from '../../../Icon/src/Icon.vue';
import {moverClass} from '../config';

const props = defineProps(headerProps);

const getStyle = computed(()=>{
  return {
    background: props.background,
    color:'#fff'
  }
})
</script>

<template>
  <div
    v-if="!!header"
    :class="['component-modal-header', moverClass]"
    :style="getStyle"
    @dblclick="() => onSwitch()"
  >
    <!-- 头部信息-->
    <div
      class="modal-header-main-container-wrap"
      :style="{ 'justify-content': props.titleAlign }"
    >
      <!-- 左侧的信息-->
      <div
        v-if="$slots.headerBefore"
        class="header-before"
      >
        <slot name="headerBefore"> </slot>
      </div>
      <!--图标-->
      <div
        v-if="$slots.icon"
        class="header--icon"
      >
        <slot name="icon"> </slot>
      </div>
      <!--文字-->
      <div
        v-if="$slots.title"
        class="header--title"
      >
        <slot name="title"> </slot>
      </div>
      <!--追加-->
      <div
        v-if="$slots.headerAfter"
        class="header-before"
      >
        <slot name="headerAfter"> </slot>
      </div>
    </div>

    <!--   右侧的按钮-->
    <div class="modal-header-right-control-wrap">
       <template  v-if="!!switcherIcon">
         <Icon
             class="cursor-pointer"
             :size="28"
             color="white"
             @click.stop="onSwitch"
             :icon="switcherIcon?.[props.maximum].image"
         />
       </template>
       <template  v-if="!!closerIcon">
         <Icon
             :size="28"
             color="white"
             class="cursor-pointer"
             @click.stop="onClose"
             :icon="closerIcon.image"
         />
       </template>
    </div>
  </div>
</template>
