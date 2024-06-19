<script setup lang="ts">
import {computed, ref, toRefs, unref} from 'vue';
import {useDesign} from '/@/hooks/web/useDesign';
import {useBaseMapSwitch} from "@/core/adapter/useBaseMapSwitch.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
import {platformBasicProps} from "@/layouts/map/props.ts";
import {usePlatformStoreWithOut} from "@/store/modules/platform.ts";

const {prefixCls} = useDesign('base-map-wrap');
const props = defineProps({
  ...platformBasicProps,
})
const {platform} =toRefs(props)
const basemap = computed(()=>{
  return props.options?.[platform.value]?.baseLayers ?? []
})
const activeIndex = computed(() => {
  return usePlatformStoreWithOut().getGisKeyInstance(props.gisKey)?.mapIndex
});
const {onSwitch} = useBaseMapSwitch(props.gisKey);
const handleSwitchLayer = (config: any, params: any) => {
  onSwitch(unref(config), unref(params))
}
const curPlatform = ref(props.platform)
const platformOption = [
  {
    name: "2D",
    icon: "",
    platform: GisPlatformEnum.OPENLAYERS
  },
  {
    name: "3D",
    icon: "",
    platform: GisPlatformEnum.CESIUM
  }
];

function toggle(item: any) {
  if (curPlatform.value === item.platform) return;
  curPlatform.value = item.platform;
  //需要缓存起来
  usePlatformStoreWithOut().setInstance(props.gisKey,{
    platform:curPlatform.value,
  })
  setTimeout(()=>{
    location.reload();
  },1000)
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
    <div :class="`${prefixCls}__platform flex  flex-col items-center bg-white`">
      <div
          v-for="(item,i) in platformOption"
          :key="`platform-${i}`"
          class="item"
          :class="{active:curPlatform === item.platform}"
          @click="toggle(item)">
        {{ item.name }}
      </div>
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

  &__platform {
    gap: 5px;

    .item {
      width: 68px;
      display: flex;
      padding: 1px 0;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      font-weight: bold;
      background: $neutral-color-1;

      &.active {
        color: white;
        background: $primary-color-6 !important;
      }
    }
  }
}
</style>
