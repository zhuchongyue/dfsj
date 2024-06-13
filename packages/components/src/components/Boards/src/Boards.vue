<script setup lang="ts">
import {computed, defineAsyncComponent, markRaw, nextTick, onMounted, watch, ref, toRefs, unref} from 'vue';
import {BoardPosition, BoardProps} from './props';
import {Icon} from "../../Icon";
import {useElementBounding} from '@vueuse/core'
import {isString} from "../../../utils/is";
const prefixCls = `ec-component-board-container-page-wrap`;
const cache = new Map();
const props = defineProps(BoardProps);
const {position, board, customStyle} = toRefs(props)
const isAsyncComponent = (component) => {
  return !!(component && component.__asyncLoader);
};
const el = ref(null)
const {x, y, top, right, bottom, left, width, height} = useElementBounding(el)
const color = computed(()=>customStyle.value.color ?? '#11848f')
function resolve(source) {
  let component = cache.get(source);
  if (component == null) {
    if (isAsyncComponent(source)) {
      cache.set(source, (component = source));
    } else {
      cache.set(source, (component = defineAsyncComponent(source)));
    }
  }
  return component;
}
function tabClick(id) {
  board.value.index = id?.index;
}
const toggle = () => {
  board.value.state = board.value.state === 'spread' ? 'minify' : 'spread';
};
const icon = computed(() => {
  if (board.value.state == 'hidden') return null;
  return 'ic:round-chevron-right';
});
const tabPosition = computed(()=>{
  const mapping ={
    [BoardPosition.EAST]: 'right',
    [BoardPosition.WEST]: 'left',
    [BoardPosition.SOUTH]: 'top',
    [BoardPosition.TOP]: 'top',
  }
  return mapping?.[position.value]
})
const transform = computed(() => {
  let _transform = '';
  if (board.value.state == 'spread') {
    _transform = ''
  } else {
    if (position.value == BoardPosition.WEST) {
      _transform = `translateX(-${right.value}px)`
    } else if (position.value == BoardPosition.EAST) {
      _transform = `translateX(${window.innerWidth - left.value}px)`
    } else if (position.value == BoardPosition.SOUTH) {
      _transform = `translateY(${window.innerHeight - top.value}px)`
    } else if (position.value == BoardPosition.TOP) {
      _transform = `translateY(-${bottom.value}px)`
    }
  }
  return _transform
})
const getStyle = computed(() => {
  let fixed = {};
  let margin = '';
  //赋默认值
  if (customStyle.value.fixed?.length != 4) {
    customStyle.value.fixed = [0, 0, 0, 0]
  }
  if (isString(customStyle.value.margin)) {
    margin = customStyle.value.margin;
  } else {
    if (customStyle.value.margin?.length != 4) {
      customStyle.value.margin = [0, 0, 0, 0]
      margin = [...unref(customStyle).margin].join(' ')
    }
  }
  //判断方向
  const [t, r, b, l] = customStyle.value.fixed;
  //'east', 'top', 'west', 'south', 'full'
  /** 右和左时  上下可以调整*/
  //@ts-ignore
  if ([BoardPosition.EAST, BoardPosition.WEST].includes(position.value)) {
    fixed = {
      top: t || 0,
      bottom: b || 0,
    }
    /** 全屏时全部可以调整*/
    //@ts-ignore
  } else if ([BoardPosition.FULL].includes(position.value)) {
    fixed = {
      top: t || 0,
      bottom: b || 0,
      left: l || 0,
      right: r || 0,
    }
    /** 上时*/
    //@ts-ignore
  }else if ([BoardPosition.TOP].includes(position.value)) {
    fixed = {
      top: t || 0,
      left: l || 0,
      right: r || 0,
    }
    /** 下时*/
  }
  else {
    fixed = {
      left: l || 0,
      right: r || 0,
    }
  }
  return {
    ...fixed,
    margin: margin,
    transform: transform.value
  }
})
onMounted(()=>{
  el?.value?.style?.setProperty('--board-tab-color', color.value);
})
watch(()=>customStyle.value.color , ()=>{
  el?.value?.style?.setProperty('--board-tab-color', color.value);
},{deep:true})
</script>

<template>
  <div
      :class="[prefixCls, board.state , position, 'p-2']"
      :style="getStyle"
      ref="el"
  >
    <span
        @click.stop="toggle"
        :class="['board--wing', { hidden: !icon }]"
    >
      <Icon :size="26" :icon="icon"/>
    </span>
    <div :class="`${prefixCls}__layout h-full flex`">
      <template v-if="board.items.length > 1">
        <div>
          <el-tabs
              class="multiple-toggle-tab"
              v-model="board.value"
              @tab-click="tabClick"
              :tab-position="tabPosition"
              :data-content="customStyle.color"
          >
            <el-tab-pane
                v-for="(b, i) in board.items"
                :key="b?.id"
                :name="b.id"
                :label="b.label"
            >
              <template #label>
                <div class="custom-label">
                  {{ b.label }}
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="board--panels flex-1 w-full min-w-0">
          <template
              v-for="item in board?.items"
              :key="item.id"
          >
            <div
                class="board--panel-container"
                :class="{ active: board.value === item.id }"
            >
              <component
                  v-show="board.value === item.id"
                  :is="markRaw(resolve(item.content))"
                  v-bind="item.props"
              >
              </component>
            </div>
          </template>
        </div>
      </template>
      <div
          v-else
          class="component board-none flex-1 w-full min-w-0"
      >
        <template
            v-for="item in board.items"
            :key="item.id"
        >
          <component
              v-show="board.value === item.id"
              :is="markRaw(resolve(item.content))"
              v-bind="item.props"
          >
          </component>
        </template>
      </div>
    </div>
  </div>
</template>

