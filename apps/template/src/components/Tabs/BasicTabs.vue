<script setup lang="ts" name="BasicTabs">
  import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  type Mode = 'Vertical' | 'Horizontal';
  const { prefixCls } = useDesign('component-basic-tab');
  const TypeStyle = {
    secondaryMenu: 'SecondaryMenu',
    tabsCommon: 'TabsCommon',
  };
  interface IOption {
    label: string;
    value: number | string;
    [key: string]: any;
  }
  interface IField {
    value: string;
    label: string;
  }
  interface IProps {
    typeStyle?: string;
    modelValue?: any;
    mode: Mode;
    options: Array<IOption>;
    field: IField;
    className?: string;
    defaultValue?: string | string;
  }
  const emits = defineEmits(['change', 'update:modelValue']);

  const props = withDefaults(defineProps<IProps>(), {
    mode: 'Horizontal',
    options: () => [
      {
        label: '1',
        value: 1,
      },
    ],
    defaultValue: '',
    modelValue: '',
    className: '',
    field: () => ({
      label: 'label',
      value: 'value',
    }),
    typeStyle: () => 'SecondaryMenu',
  });
  const { field } = toRefs(props);
  const curModelValue = ref(props.modelValue ?? props.defaultValue);
  watch(
    () => curModelValue.value,
    () => {
      emits('update:modelValue', curModelValue.value);
    }
  );
  const handleClick = (item: IOption, index: number = 0) => {
    if (curModelValue.value == item?.[field.value.value]) return;
    curModelValue.value = item?.[field.value.value];
    emits('change', curModelValue.value);
  };
  watch(
    () => props.defaultValue,
    (n, o) => {
      if (n != curModelValue.value) {
        curModelValue.value = n;
        emits('change', curModelValue.value);
      }
    }
  );
  watch(
    () => props.modelValue,
    (n, o) => {
      if (n != curModelValue.value) {
        curModelValue.value = n;
        emits('change', curModelValue.value);
      }
    }
  );
</script>
<template>
  <div
    :class="[
      prefixCls,
      props.typeStyle == TypeStyle.tabsCommon ? 'tabs-common' : '',
    ]"
  >
    <div
      v-for="m in props.options"
      :key="m?.value"
      :label="m.value"
      @click="handleClick(m)"
      :class="[
        `${prefixCls}__item flex items-center justify-center cursor-pointer`,
        { active: curModelValue == m?.[field.value] },
      ]"
    >
      {{ m?.label }}
    </div>
  </div>
</template>
<style lang="scss">
  $prefixCls: #{$namespace}-component-basic-tab;
  .#{$prefixCls} {
    position: relative;
    background: #f0f2f5;
    height: 40px;
    border-radius: 4px;
    width: fit-content;
    display: flex;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 99;
    &__item {
      min-width: 100px;
      color:  #0A52CB;
      font-size: 18px;
      box-sizing: border-box;
      padding: 0 16px;
      &:last-child {
        border-right: 0.5px solid transparent;
      }
      &.active {
        background:  #0A52CB;;
        color: white;
        box-sizing: border-box;
        //background: linear-gradient(180deg, #11848F 50%, #0C687A 50%);
        //border-bottom: 4px solid #084f66;
        //border-right: 0.5px solid transparent;
      }
    }
    // 样式覆盖
    &.tabs-common {
      background: transparent !important;
      box-shadow: none !important;
      .#{$prefixCls} {
        &__item {
          background: transparent !important;
          border: none !important;
          color: #757575 !important;
          &.active {
            background-color: #d3eafd;
            color: #2196f3 !important;
            border-bottom: 2px solid #2196f3 !important;
          }
        }
      }
    }
  }
</style>
