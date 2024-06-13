<script setup lang="ts">
import {computed} from 'vue';
import {isObject} from '../../../utils/is';
import Icon from '../../Icon/src/Icon.vue';
import {statefulProps} from './props';
const props = defineProps(statefulProps);
const state = computed(() => {
    if (isObject(props.value)) {
      return props.value;
    }
    return props.value ? props.states[props.value] : null;
  });

const getStyle = computed(() => {
  return {
    color:state.value?.color,
  }
})
</script>
<template>
  <div class="component stateful h-full w-full">
    <div
      class="stateful--content h-full w-full"
      :class="[contentClass, { cover: !!state }]"
    >
      <slot></slot>
    </div>
    <div
      v-if="state"
      class="stateful--cover"
    >
      <div class="cover--box">
        <component
          :is="state?.tag == 'Icon' ? Icon : state?.tag"
          class="cover--icon"
          :icon="state?.image"
          :color="state?.color"
          :size="state?.size || '28'"
        ></component>
        <div
          class="cover--text"
          :style="getStyle"
          >{{ state?.label }}</div
        >
      </div>
    </div>
  </div>
</template>


