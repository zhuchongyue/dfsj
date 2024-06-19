<script lang="ts" setup>
import {computed, ref, toRaw, unref, shallowReactive, onMounted, nextTick} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
import {EMittLayerTitle} from "@/enums/mittTypeEnum.ts";
import {emitter} from "@dfsj/utils" ;
const useStore = useUserStore();
const {prefixCls} = useDesign('component-Visual-page');
//todo
import NodeAxisComponent from '@dfsj/components/src/components/NodeAxis/src/NodeAxis.vue';
import {BasicModal} from "@dfsj/components";

const COLORS = {
  RESET: '#ff0000',
  ABLE: '#1E88E5',
  DISABLE: '#DCDCDC',
};
const iconSize = 30;
import {SvgIcon, Icon} from "@dfsj/components";
import {useVisualPlayer} from "@/components/Visual/hooks/useVisualPlayer.ts";
import {useVisualManager} from "@/components/Visual/hooks/useVisualManager.ts";
import {GisSymbolKey} from "@/core/GisCache.ts";

const props = defineProps({
  playKey: {
    type: Symbol,
    default: GisSymbolKey.default
  },
  offset: {
    type: Object,
    default: () => ({top: '500px', left: '20%'})
  }
})
const {
  controls,
  register,
  load,
  togglePlay,
  onReset,
  onForward,
  onBackward,
  onFrame,
  playing,
  current,
  onChangeInstance,
  player
} = useVisualPlayer(props.playKey);
const {multiContent} = useVisualManager({
  key: props.playKey,
  load,
  current,
  onChangeInstance,
  player
})

const visible = ref(true);
const toggleName = computed(() =>
    playing.value
        ? 'mdi:pause-circle'
        : 'mingcute:play-circle-fill'
);

function onRenderFrameRain(index) {
  const callback = (cur, pvd) => {
    console.log('展示标题了', pvd.format(index, 'title'))
    emitter.emit(EMittLayerTitle.SHOW + props.playKey.toString(), {
      title: pvd.format(index, 'title'),
      long: pvd.format(index, 'long'),
    });
  }
  onFrame(index, callback)
}

onMounted(() => {
  // const content = getVisualContent(target)
  // load(content)
  // console.log('content', content)
})

function onTabClick(tab, ev) {
  console.log({tab, ev});
  const id = tab.props.name;
  console.log('multiContent.value', multiContent.value);
  const content = multiContent.value.find((e) => e.id === id);
  if (content.id === current.value.id) return;
  // current.value = content;
  onChangeInstance(content);
}
</script>
<template>
  <div :class="prefixCls">
    <BasicModal
        :visible="visible"
        :footer="false"
        :header="false"
        @close="visible = false"
        :offset="props.offset"
    >
      <!--时间控制按钮-->
      <template #mover>
        <div class="player-control flex justify-center items-center relative">

          <div class="player-instance">
            <template v-if="multiContent.length && current">
              <el-tabs
                  v-model="current.id"
                  @tab-click="onTabClick"
                  class="instance-tabs"
              >
                <el-tab-pane
                    v-for="item in multiContent"
                    :key="item.id"
                    :label="item.label"
                    :name="item.id"
                />
              </el-tabs>
            </template>
          </div>
          <SvgIcon
              @click="onReset"
              name="device-reset-rounded"
              :color="!controls ? COLORS.DISABLE : COLORS.RESET"
              :class="!controls ? 'cursor-not-allowed' : 'cursor-pointer'"
              :size="iconSize"
          />

          <Icon
              @click="onBackward"
              :class="
            !controls || !controls.prev
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          "
              :color="!controls || !controls.prev ? COLORS.DISABLE : COLORS.ABLE"
              icon="mingcute:skip-previous-fill"
              :size="iconSize"
          />

          <Icon
              @click="togglePlay"
              :class="
            !controls || !controls.play
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          "
              :color="!controls || !controls.play ? COLORS.DISABLE : COLORS.ABLE"
              :icon="toggleName"
              :size="iconSize"
          />

          <Icon
              @click="onForward"
              :class="
            !controls || !controls.next
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          "
              :color="!controls || !controls.next ? COLORS.DISABLE : COLORS.ABLE"
              icon="mingcute:skip-forward-fill"
              :size="iconSize"
          />
        </div>
      </template>
      <div style="width: 500px;height: 70px">
        <NodeAxisComponent
            class="z-10"
            :res="res"
            @register="register"
            @update:frame="onRenderFrameRain"></NodeAxisComponent>
      </div>
    </BasicModal>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-Visual-page;
.#{$prefix-cls} {
  $TAB_HEIGHT: 30px;

  .instance-tabs {
    --el-tabs-header-height: auto;

    max-width: 300px;
    height: inherit;
    cursor: pointer;
    margin: auto 0;
    display: flex;
    align-items: center;
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      // line-height: var(--el-tabs-header-height);
      line-height: unset;
    }

    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      // padding-left: 0;
    }

    .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
      // padding-right: 0;
    }

    .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
      // padding-left: 0;
    }

    .el-tabs__active-bar,
    .el-tabs__nav-wrap::after {
      height: 0 !important;
    }

    .el-tabs__item {
      margin-right: 5px;
      padding: 1px 2px !important;
      background: #e0e0e0;
      border-radius: 10px;
      font-size: 12px;
    }

    .el-tabs__item.is-active {
      color: #fff;
      background: var(--el-color-primary);
    }
    .el-tabs__header {
      margin: 0;
      padding: 0;
    }
  }

  .player-instance {
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    column-gap: 15px;
  }
}
</style>