<template name="secondary">
  <div class="components secondary-title" :class="{ 'border-bottom': props.isBorder }">
    {{ props.title }}
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from "vue"

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  isBorder: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss">
.components.secondary-title {
  height: 48px;
  line-height: 48px;
  font-size: 20px;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &.border-bottom {
    border-bottom: 1px solid $neutral-7;
  }
}
</style>