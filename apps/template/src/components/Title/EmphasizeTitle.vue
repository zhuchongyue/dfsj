<script setup lang="ts" name="HeadTitle">
  import { useDesign } from '/@/hooks/web/useDesign';

  const { prefixCls } = useDesign('emphasize-title-wrap');
  interface IProps {
    height?: number | string;
    title: string;
    className?: string;
    border?: boolean;
    isOrnament?: boolean;
    prefix?: boolean;
    margin: string | number;
  }
  const props = withDefaults(defineProps<IProps>(), {
    height: 24,
    title: '',
    className: '',
    border: false,
    isOrnament: false,
    prefix: true,
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
    <div class="flex">
      <div v-if="prefix" class="prefix"></div>
      <div class="main-text">
        {{ props.title }}
      </div>
    </div>
    <slot />
  </div>
</template>
<style lang="scss">
  /* stylelint-disable-next-line scss/dollar-variable-pattern */
  $prefixCls: #{$namespace}-emphasize-title-wrap;
  .#{$prefixCls} {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //align-items: center;
    position: relative;
    vertical-align: bottom;
    width: 100%;
    height: 100%;

    .prefix {
      width: 7px;
      height: auto;
      border-radius: 8px;
      min-height: 0;
      background: $primary-color-11;
      margin-right: 10px;
    }

    .main-text {
      display: flex;
      align-items: center;
      position: relative;
      box-sizing: border-box;
      height: 100%;
      font-family: SourceHanSansCN-Bold;
      font-size: 18px;
      font-weight: bold;
      color: $font-primary-3;
    }
  }
</style>
