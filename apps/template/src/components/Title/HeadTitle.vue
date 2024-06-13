<script setup lang="ts" name="HeadTitle">
  import { useDesign } from '/@/hooks/web/useDesign';

  const { prefixCls } = useDesign('head-title-wrap');
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
    margin: '10px 0',
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
    <div class="main-text">
      {{ props.title }}
    </div>
    <slot />
  </div>
</template>
<style lang="scss">
  /* stylelint-disable-next-line scss/dollar-variable-pattern */
  $prefixCls: #{$namespace}-head-title-wrap;
  .#{$prefixCls} {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;

    .main-text {
      display: flex;
      align-items: center;
      position: relative;
      box-sizing: border-box;
      height: 100%;
      font-family: SourceHanSansCN-Bold;
      font-size: 18px;
      font-weight: bold;
      color: $font-pr2;

      // padding-left: 5px;
    }
  }
</style>
