<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, unref} from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppStore } from '/@/store/modules/app';
  import {useBaseMapSwitch} from "@/core/adapter/useBaseMapSwitch.ts";
  const { prefixCls } = useDesign('base-map-wrap');
  const props = defineProps({
    basemap: {
      type: Array,
      default: null
    }
  })
  const appStore = useAppStore();
  const activeIndex = computed(() => appStore.mapIndex);
  const { onSwitch } = useBaseMapSwitch();
  const handleSwitchLayer = (config:any, params:any) => {
    console.log(
        config, params
    )
    onSwitch(unref(config), unref(params))
  }
</script>

<template>
  <div :class="`${prefixCls} flex  items-center bg-white`">
    <div
      v-for="(config, index) in basemap"
      :key="config.name"
      :class="['issue-container relative cursor-pointer opacity-50', { actives: activeIndex === index }]"
    >
      <el-image
        :src="config.thumbnail"
        class="basemap--item"
        style="width: 90px; height: 100%"
        @click.stop="handleSwitchLayer(config, { index, type: 'list' })"
      >
      </el-image>
      <span class="label absolute bottom-0 left-0 right-0 text-center">
        {{ config?.name ?? config?.label }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
  $prefixCls: #{$namespace}-base-map-wrap;
  $WRAP_WIDTH: 100px;
  $ITEM_HEIGHT: 48px;
  .#{$prefixCls} {
    pointer-events: auto;
    padding: 5px;
    .issue-container {
      margin-right: 5px;
      cursor: pointer !important;
      border: 1px solid transparent;
      &:last-child {
        margin-right: 0;
      }
      .label {
        height: 20px;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.47);
        color: white;
      }
    }
    .actives {
      opacity: 1;
      border: 1px solid rgba($primary-color-6, 0.3);
    }
  }
</style>
