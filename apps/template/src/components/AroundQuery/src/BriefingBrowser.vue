<script lang="ts" setup>
import {useDesign} from "/@/hooks/web/useDesign.ts";
import BasicTitle from "/@/components/Title/BasicTitle.vue"
const {prefixCls} = useDesign('briefing-browser-page');
interface Briefing {
  briefIntroduction: string;
  briefKeyObject: string;

  [key: string]: any
}
const props = defineProps({
  data: {
    type: Object as PropType<Briefing>,
    default: () => ({
      briefIntroduction: '',
      briefKeyObject: '',
    })
  }
})
</script>
<template>
  <div :class="prefixCls">
    <BasicTitle :title="'行政区与人口'"/>
    <div :class="`${prefixCls}__description`">
      {{ props.data?.briefIntroduction }}
    </div>
    <BasicTitle :title="'重点防洪对象'"/>
    <div  :class="`${prefixCls}__description`">
      {{ props.data?.briefKeyObject }}
    </div>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-briefing-browser-page;
.#{$prefix-cls} {
  height: 100%;
  width: 100%;
  min-height: 0;
  padding: 10px;
  box-sizing: border-box;
  &__description{
    text-indent: 30px;
    line-height: 24px;
    font-size: 16px;
  }
}
</style>