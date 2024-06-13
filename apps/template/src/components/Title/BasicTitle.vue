<script setup lang="ts" name="BasicTitle">
  import { useDesign } from '/@/hooks/web/useDesign';
  const { prefixCls } = useDesign('basic-title-wrap');
  interface IProps {
    height?: number | string;
    title?: string;
    className?: string;
    border?: boolean;
    isOrnament?: boolean;
    margin?: string | number;
  }
  const props = withDefaults(defineProps<IProps>(), {
    height: 24,
    title: '',
    className: '',
    border: false,
    isOrnament: false,
    margin: '12px 0',
  });
  const style = computed(() => {
    return {
      height: props.height
        ? typeof props.height === 'string'
          ? props.height
          : props.height + 'px'
        : 'auto', // 如果是string类型则直接使用，如果是number类型则需拼接px
      borderBottom: props.border ? `1px solid #8B8B8B` : null,
      margin: props?.margin ?? 0,
    };
  });
  const slots = useSlots();
</script>

<template>
  <div
    :class="[
      prefixCls,
      props.className,
      props.isOrnament ? 'title-symbol' : '',
    ]"
    :style="style"
  >
    <div v-if="!slots.default" class="main-text">
      {{ props.title }}
    </div>
    <div v-if="slots.default" class="main-text">
      <slot />
    </div>
    <slot v-if="slots.right" name="right" />
  </div>
</template>
<style lang="scss">
  $prefixCls: #{$namespace}-basic-title-wrap;
  .#{$prefixCls} {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;
    padding-left: 16px;
    font-family: SourceHanSansCN-Regular;
    letter-spacing: 0px;
    background: url('/images/title-bg.png') left bottom no-repeat;
    background-size: contain;

    .main-text {
      display: flex;
      align-items: center;
      position: relative;
      box-sizing: border-box;
      height: 100%;
      font-family: SourceHanSansCN-Bold;
      font-size: 20px;
      font-weight: bold;
      color: $font-primary-3;

      // padding-left: 5px;
    }
  }
</style>
