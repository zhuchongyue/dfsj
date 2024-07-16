<script setup lang="ts">
import {getCurrentInstance, reactive, Ref, ref, onMounted, onBeforeUnmount, toRefs, computed, unref, toRaw} from 'vue';
import {Icon, SvgIcon} from '@dfsj/components';
import {useDesign} from '/@/hooks/web/useDesign';
import LatLngPosition from '/@/layouts/map/components/ToolBox/components/LatLngPosition.vue';
import SearchPanelWrap from '/@/layouts/map/components/ToolBox/components/SearchPanelWrap.vue';
import {GisSymbolKey} from "@/core/GisCache.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
import {platformBasicProps} from "@/layouts/map/props.ts";
import {usePlatformStoreWithOut} from "@/store/modules/platform.ts";
import MapTools from "@/layouts/map/components/ToolBox/components/MapTools.vue";
import SimpleMeasure from "@/layouts/map/components/ToolBox/components/SimpleMeasure.vue";

const props = defineProps({
  ...platformBasicProps,
  toolboxCfg: {
    type: Array<any>,
    default: () => [],
  },

})
const active: Ref = ref();
const {prefixCls} = useDesign('tool-box-wrap');
const {toolboxCfg} = toRefs(props)
const vm = getCurrentInstance();
const offset = reactive({left: '0', bottom: '0'});
const Status = {SPREAD: 'spread', MINIFY: 'minify'};
const Classify = {MAPBOX: 'mapbox', SEARCH: 'search', NONE: '-1'};
const classify = ref(Classify.NONE);
const status: Ref = ref(Status.MINIFY);

function onItemClick(item, index, event) {

  console.log({item, index, event})
  const menu = vm.refs.menus[index];
  if (item.click instanceof Function) {
    return item.click();
  }
  if (active.value === index) {
    if (menu === event.target) {
      active.value = -1;
    }
  } else {
    const bound = menu?.getBoundingClientRect();
    offset.left = bound.width + 'px';
    active.value = index;
    console.log({bound});
  }
}

function onHidden(index) {
  active.value = -1;
}

function handleToggle(cl) {
  if (classify.value == cl) {
    classify.value = Classify.NONE;
    status.value = Status.MINIFY;
    return;
  }
  classify.value = cl;
  status.value = Status.SPREAD;
}

function setBlur(event) {
  console.log('vm', vm)
  // debugger
  return
  if (!document.getElementsByClassName(prefixCls)[0].contains(event.target)) {
    classify.value = Classify.NONE;
    active.value = -1;
    status.value = Status.MINIFY;
  }
}

const getAttr = computed(() => {
  const cachePlatform = usePlatformStoreWithOut().getGisKeyInstance(props.gisKey)?.platform;
  const platform = cachePlatform ?? props.platform;
  console.log({...unref(props)}, platform)
  return {
    ...unref(props),
    platform
  }
})

onMounted(() => {
  // document.documentElement.addEventListener('click', setBlur);
});
onBeforeUnmount(() => {
  // document.documentElement.removeEventListener('click', setBlur);
});
</script>
<template>
  <div :class="`${prefixCls} select-none absolute box-border`">
    <!-- 地图工具-->
    <transition
        enter-active-class="animate__animated animate__fadeInLeft animate__veryFaster"
        leave-active-class="animate__animated animate__fadeOutLeft animate__veryFaster"
        appear
    >
      <div v-if="status == Status.SPREAD">
        <div
            class="list shadow-xl"
            v-if="status == Status.SPREAD && classify == Classify.MAPBOX"
        >
          <template v-for="(e, i) in toolboxCfg" :key="i + e.label">
            <div
                :class="[
                'item flex justify-center items-center cursor-pointer relative',
                {
                  focus: active == i,
                },
              ]"
                ref="menus"
                @click="onItemClick(e, i, $event)"
            >
              <div class="focus-helper" v-show="active === i"></div>
              <div
                  class="section pointer-events-none"
                  style="margin-right: 5px"
              >
                <Icon :icon="e?.image" size="22"/>
              </div>
              <div class="section h-full flex justify-center items-center pointer-events-none">{{ e?.label }}</div>
              <transition
                  enter-active-class="animate__animated animate__fadeIn"
                  leave-active-class="animate__animated animate__fadeOut"
                  appear
              >
                <div
                    class="item--submenu  shadow-xl pointer-events-none"
                    v-if="active === i"
                    :style="offset"
                >
                  <component
                      :active="active === i"
                      v-bind="getAttr"
                      :key="e?.label + e?.image"
                      :is="e.component"
                      @hidden="onHidden"
                  ></component>
                  <!--              <CompositeLocator />-->
                  <!--              <BaseMap />-->
                  <!--                                <MapTools/>-->
                  <!--                  <SimpleMeasure/>-->
                  <!--               <StaticVisualResource />-->
                </div>
              </transition>
            </div>
          </template>
        </div>
        <div v-if="status == Status.SPREAD && classify == Classify.SEARCH">
          <SearchPanelWrap/>
        </div>
      </div>
    </transition>
    <!-- 收起-->
    <div class="tb-action-wrap flex items-center">
      <div
          @click="handleToggle(Classify.MAPBOX)"
          :class="[
          'tb-action-btn flex items-center justify-center pointer-events-auto cursor-pointer',
          { focus: classify == Classify.MAPBOX },
        ]"
      >
        <SvgIcon color="#fff" :size="24" :name="'tool-box-maner'"/>
      </div>
      <div
          @click="handleToggle(Classify.SEARCH)"
          :class="[
          'tb-action-btn flex items-center justify-center  pointer-events-auto cursor-pointer',
          { focus: classify == Classify.SEARCH },
        ]"
      >
        <Icon size="24" color="#fff" icon="mdi:search"/>
      </div>
      <!-- 经纬度位置-->
      <teleport to="body">
        <LatLngPosition/>
      </teleport>
    </div>
  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-tool-box-wrap;
$WRAP_WIDTH: 100px;
$ITEM_HEIGHT: 48px;
.#{$prefixCls} {
  bottom: 10px;
  left: 10px;
  z-index: 200;
  color: black;
  border-radius: 4px;

  .list {
    width: $WRAP_WIDTH;
    background: white;

    .item {
      height: $ITEM_HEIGHT;
      transition: color 0.3s,
      background-color 0.3s;
      .section {
        &:first-child {
          margin-right: 5px;
        }
      }



      &:hover {
        .focus-helper {
          background: currentColor;
          opacity: 0.15;
        }
      }
    }
  }

  .focus-helper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: inherit;
    transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1),
    opacity 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
    background: currentColor;
    opacity: 0.15;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.1;
      border-radius: inherit;
      background: #000;
      transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1),
      opacity 0.6s cubic-bezier(0.25, 0.8, 0.5, 1);
    }

    &:after {
      opacity: 0.4;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1),
      opacity 0.6s cubic-bezier(0.25, 0.8, 0.5, 1);
    }
  }

  .item--submenu {
    position: absolute;
    z-index: -1;
    max-height: 60vw;
    background: white;
    border-radius: 3px;
    margin-left: 8px;
  }

  .item-section {
    height: $ITEM_HEIGHT;
    display: flex;
    align-items: center;
    padding: 0 12px;
    .item-section-icon {
      margin-right: 5px;
    }
  }

  .tb-action-wrap {
    margin-top: 10px;

    .tb-action-btn {
      height: 40px;
      width: 40px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);
      transition: all ease-in-out 0.5s;
      margin-right: 5px;

      &:hover,
      &.focus {
        background-color: #027be3;
      }

      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>
