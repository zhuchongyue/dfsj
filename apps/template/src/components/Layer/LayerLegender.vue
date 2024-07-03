<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, shallowRef} from 'vue';
import {Icon} from '@dfsj/components';
import Legend from '/src/components/Legend/src/Legend';
import {EMittLayerLegend, EMittLayerPlayable} from '/@/enums/mittTypeEnum';
import {useDesign} from '/@/hooks/web/useDesign';
import {emitter} from '@dfsj/utils';
import {platformBasicProps} from "@/layouts/map/props.ts";
const {prefixCls} = useDesign('legend-wrap');
const show = ref(true);
const active = shallowRef<any>(null);
const props = defineProps({
  ...platformBasicProps,
  toolboxCfg: {
    type: Array<any>,
    default: () => [],
  },
})
/**
 * 图例变化
 * */
function onLegendChange(index, item, item1) {
  emitter.emit(EMittLayerPlayable.VISUAL_PLAYABLE_FILTER + props.gisKey.toString(), {
    legend: item?.value ?? null,
  });
}
function onLegendShow(legend) {
  if (!legend) return;
  active.value = legend;
}
function onLegendHide() {
  active.value = null;
}
onMounted(() => {
  emitter.on(EMittLayerLegend.SHOW + props.gisKey.toString(), onLegendShow);
  emitter.on(EMittLayerLegend.HIDE + props.gisKey.toString(), onLegendHide);
});
onBeforeUnmount(() => {
  onLegendHide();
  emitter.off(EMittLayerLegend.SHOW + props.gisKey.toString(), onLegendShow);
  emitter.off(EMittLayerLegend.HIDE + props.gisKey.toString(), onLegendHide);
});
</script>
<template>
  <transition
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
      appear
  >
    <!-- 常见的单个可以过滤的图例-->
    <div :class="`${prefixCls}  flex flex-col`" v-if="active">
      <div class="legend-content" v-if="show">
        <div class="legend-img" v-if="active?.styletype == 'img'">
          <img :src="active?.img"/>
        </div>
        <Legend
            v-else
            :model-value="active.index"
            :items="active?.items"
            :title="active?.name"
            @change="(index, item) => onLegendChange(index, item, active)"
        ></Legend>
      </div>
      <div class="legend-toggle w-full cursor-pointer flex justify-center items-center select-none"
           @click="show = !show">
        <span style="margin-right: 2px">图例</span>
        <Icon size="22" :icon="!show ? 'mdi:chevron-up' : 'mdi:chevron-down'"/>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-legend-wrap;
$LEGEND_WIDTH: 126px;
.#{$prefixCls} {
  position: absolute;
  bottom: 16px;
  width: $LEGEND_WIDTH;
  z-index: 100;
  //left: - calc($LEGEND_WIDTH + 20px);
  right: 20px;

  .legend-toggle {
    height: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.16);
    color: #757575;
    font-size: 16px;
    margin-top: 6px;
  }

  .legend-content {
    background: white;
    color: black;

    .legend-img {
      text-align: center;

      img {
        background-size: 100% 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
