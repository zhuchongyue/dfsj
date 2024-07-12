<script setup lang="ts">
  import { computed, onMounted, ref, toRefs } from 'vue';
  import {buildShortUUID,propTypes} from "@dfsj/utils";

  const props = defineProps({
    percent: propTypes.number.def(0).validate((val) => val >= 0 && val <= 100),
    showText: propTypes.bool.def(false),
    visible: propTypes.bool.def(true),
    active: propTypes.bool.def(false),
    bgColor: propTypes.string.def('#ebeef5'),
    cutColor: propTypes.string.def('#ebeef5'),
    cutWidth: propTypes.number.def(1),
    type: propTypes.oneOf(['line', 'lump']).def('line'),
    border: propTypes.bool.def(true),
    status: propTypes.oneOf(['success', 'warning', 'error', '']).def(''),
    lineHeight: propTypes.number.def(2),
    color: propTypes.oneOfType([
      propTypes.string,
      propTypes.array,
      propTypes.func,
    ]),
    colorFlow: propTypes.bool.def(true),
    flowSecond: propTypes.oneOf([1, 2, 3, 4, 5, 6]).def(5),
    activeColor: propTypes.oneOfType([propTypes.string, propTypes.array]),
    format: propTypes.func,
  });
  const { status } = toRefs(props);
  const items = ref([]);
  const idNow = ref('');
  const getOuterStyle = computed(() => {
    let result = '';
    result += `background: ${props.bgColor};`;
    result += `height: ${props.lineHeight}px;`;
    return result;
  });

  const getLineStyle = computed(() => {
    let result = '';
    result += `width: ${props.percent}%;`;
    result += `height: ${props.lineHeight}px;margin-top: -${props.lineHeight}px;`;
    if (props.color) {
      if (typeof props.color === 'string') {
        result += `background: ${props.color};`;
      } else if (Array.isArray(props.color) && props.color.length < 7) {
        // 只取 6 种颜色
        let colors = '';
        let i = props.color.length;
        props.color.map((co, index) => {
          index === i - 1 ? (colors += co) : (colors += co + ', ');
        });
        result += `background: linear-gradient(to right, ${colors});`;
      } else if (typeof props.color === 'function') {
        result += `background: ${props.color(props.percent)};`;
      }
    }
    if (!props.border) {
      result += `border-radius: 0px`;
    }
    if (props.colorFlow) {
      result += `animation: lp-flow ${props.flowSecond}s linear infinite`;
    }
    return result;
  });

  const getActiveStyle = computed(() => {
    let result = '';
    if (props.activeColor) {
      if (typeof props.activeColor === 'string') {
        result = `background: ${props.activeColor};`;
      }
    }
    return result;
  });

  const getCutStyle = computed(() => {
    let result = '';
    result += `height: ${props.lineHeight}px; margin-top: -${props.lineHeight}px;`;
    return result;
  });

  const getCutBarStyle = computed(() => {
    let result = '';
    result += `width: ${props.lineHeight}px;`;
    result += `border-right: ${props.cutWidth}px solid ${props.cutColor};`;
    return result;
  });

  const countCut = () => {
    let kpl = document.getElementById(`linear-progress-line-${idNow.value}`);
    let kplSet = setInterval(() => {
      kpl = document.getElementById(`linear-progress-line-${idNow.value}`);
      if (kpl) {
        clearInterval(kplSet);
        //@ts-ignore
        let lno = parseInt(
          kpl.offsetWidth / (props.lineHeight + props.cutWidth)
        );
        items.value = [...Array(lno).keys()];
      }
    }, 1);
  };

  onMounted(() => {
    if (props.type == 'lump') {
      countCut();
    }
    idNow.value = buildShortUUID();
  });
</script>
<template>
  <div class="linear-progress" v-if="visible">
    <div class="linear-progress-outer">
      <div
        class="linear-progress-outer-bg"
        :class="border ? 'linear-progress-outer-bg-border' : ''"
        :style="getOuterStyle"
      ></div>
      <div
        :id="`linear-progress-line-${idNow}`"
        class="linear-progress-outer-line"
        :class="status ? 'linear-progress-outer-line-' + status : ''"
        :style="getLineStyle"
      >
        <div
          v-if="active"
          class="linear-progress-outer-line-active"
          :style="getActiveStyle"
        ></div>
      </div>
      <div
        v-if="type === 'lump'"
        class="linear-progress-outer-cut"
        :style="getCutStyle"
      >
        <div v-for="item in items" :key="item" :style="getCutBarStyle"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  $default-color: #409eff;
  $success-color: #67c23a;
  $warning-color: #e6a23c;
  $error-color: #f56c6c;

  .linear-progress {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: #606266;
    font-size: 14px;
    display: flex;
    align-items: center;
    &-outer {
      width: 100%;
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      //margin-right: -55px;
      //padding-right: 50px;
      &-bg {
        width: 100%;
        position: relative;
        &-border {
          border-radius: 100px;
        }
      }
      &-line {
        position: relative;
        background: $default-color;
        border-radius: 100px;
        transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
        &-success {
          background: $success-color;
        }
        &-warning {
          background: $warning-color;
        }
        &-error {
          background: $error-color;
        }
        &-active {
          background: #fff;
          height: inherit;
          border-radius: 10px;
          opacity: 0;
          animation: lp-active 1.54s cubic-bezier(0, 0, 0.2, 1) infinite;
          content: '';
        }
      }
      &-cut {
        position: relative;
        display: flex;
      }
    }

    &-text {
      margin-left: 10px;
      display: inline-block;
      vertical-align: middle;
      text-align: left;
      word-break: keep-all;
    }
  }

  @keyframes lp-active {
    0% {
      width: 0;
      opacity: 0.2;
    }
    30% {
      width: 0;
      opacity: 0.6;
    }
    100% {
      width: 100%;
      opacity: 0;
    }
  }

  @keyframes lp-flow {
    from {
      filter: hue-rotate(0deg);
    }
    to {
      filter: hue-rotate(360deg);
    }
  }
</style>
