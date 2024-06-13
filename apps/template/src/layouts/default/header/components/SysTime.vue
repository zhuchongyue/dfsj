<template>
  <div :class="prefixCls">
    <div class="text-white"> {{ year }}-{{ month }}-{{ day }}  {{ hour }}:{{ minute }}</div>
    <div class="text-white"> {{ week }}  <span class="mr-2"/>  {{calendarJson}}</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import {useI18n} from '/@/hooks/web/useI18n';
import {useDesign} from '/@/hooks/web/useDesign';
import {useNow} from "/@/views/sys/lock/useNow";
import   lunisolar from 'lunisolar'
const {prefixCls} = useDesign('sys-time');
const {hour, month, minute, meridiem, year, day, week} = useNow(true);
const calendarJson = computed(()=>{
  // console.log('lunisolar',lunisolar)
  let  lun = lunisolar().format('lMlD');
  // console.log({lun})
  return lun
});
const {t} = useI18n();
</script>
<style lang="scss">
$prefix-cls: #{$namespace}-sys-time;

.#{$prefix-cls} {
   //position: absolute;
   bottom: 10px;
   left: 10px;
   font-size: 16px;
   margin-left: 20px;
  *{
    font-family: SourceHanSansCN-Bold;
  }
  &__unlock {
    transform: translate(-50%, 0);
  }

  &__hour,
  &__minute {
    display: flex;
    font-weight: 700;
    color: #bababa;
    background-color: #141313;
    border-radius: 30px;
    justify-content: center;
    align-items: center;
  }

}
</style>
