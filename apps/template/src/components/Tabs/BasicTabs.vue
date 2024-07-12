<script setup lang="ts" name="BasicTabs">
import {computed, onMounted, reactive, ref, toRefs, watch} from 'vue';
import {useDesign} from '/@/hooks/web/useDesign';

type Mode = 'vertical' | 'horizontal';
type StyleType = 'block' | 'linear';
const {prefixCls} = useDesign('component-basic-tab');

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
  type?: StyleType;
  modelValue?: any;
  mode: Mode;
  options: Array<IOption>;
  field: IField;
  className?: string;
  defaultValue?: string | string;
}

const emits = defineEmits(['change', 'update:modelValue']);

const props = withDefaults(defineProps<IProps>(), {
  mode: 'horizontal',
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
  type: () => 'block',
});
const {field} = toRefs(props);
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
      `${props.type}__style`,
      `${props.mode}__style`,
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
  height: 40px;
  border-radius: 4px;
  width: fit-content;
  display: flex;
  box-sizing: border-box;
  //overflow: hidden;
  z-index: 99;
  &__item {
    font-family: SourceHanSansCN-Bold;
    font-weight: bolder;
    min-width: 100px;
    font-size: 18px;
    box-sizing: border-box;
    padding: 0 16px;
  }
//水平
 &.horizontal__style{
   //块状
   &.block__style {
     background: #f0f2f5;
     .#{$prefixCls}__item {
       color: $primary-color;
       &:last-child {
         border-right: 0.5px solid transparent;
       }
       &.active {
         background: $primary-color;
         color: white;
         box-sizing: border-box;
       }
     }

   }
   //线状
   &.linear__style {
     .#{$prefixCls}__item{
       position: relative;
       color: white;
       &:after {
         content: "";
         position: absolute;
         bottom: -4px;
         left: 50%;
         width: 50%;
         height: 4px;
         background: transparent;
         border-radius: 10px;
         transform: translateX(-50%);
       }
       &.active {
         position: relative;
         color: $primary-color;
         box-sizing: border-box;
         &:after {
           background: $primary-color;
         }
       }

     }
   }
 }

  //竖直
 &.vertical__style{
    display: block;
   .#{$prefixCls}__item{
     writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
     writing-mode: tb-lr;/*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
     height: max-content;
     min-width: unset;
     padding: 16px 5px;
   }
   //块状
   &.block__style {
     background: #f0f2f5;
     .#{$prefixCls}__item {
       color: $primary-color;
       &:last-child {
         border-right: 0.5px solid transparent;
       }
       &.active {
         background: $primary-color;
         color: white;
         box-sizing: border-box;
       }
     }

   }
   //线状
   &.linear__style {
     .#{$prefixCls}__item{
       position: relative;
       color: white;
       &:after {
         content: "";
         position: absolute;
         left: 0px;
         top: 50%;
         height: 50%;
         width: 4px;
         background: transparent;
         border-radius: 10px;
         transform: translateY(-50%);
       }
       &.active {
         position: relative;
         color: $primary-color;
         box-sizing: border-box;
         &:after {
           background: $primary-color;
         }
       }

     }
   }
 }




}
</style>
