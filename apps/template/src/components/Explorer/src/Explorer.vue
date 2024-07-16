<script setup lang="ts">
import {computed, onMounted, Ref, ref, shallowRef, toRaw, unref, watch} from 'vue';
import {useDesign} from '/@/hooks/web/useDesign';
import {LinearProgress} from "@/components/LinearProgress";
import {compProps, usePropsLoader} from "@/components/Explorer";
import {toReactive} from "@vueuse/core";
import {isEmpty} from "@dfsj/utils";
import {Stateful} from "@dfsj/components";

const props = defineProps({
  ...compProps,
  active: {
    type: Number | String
  }
})
const {prefixCls} = useDesign('explorer-wrap');
const {target} = toReactive(props);
const options: Ref<any> = shallowRef(null);
const loading: Ref = ref(false);
const renders: Ref = shallowRef(null);
const sizer: Ref<number> = ref(0);
const active: Ref<number> = ref(props.active ?? 0);
const renderer = computed(() => {
  return renders.value?.[active.value] ?? undefined;
});
const {data, statefulValue} = usePropsLoader(target, props);

function handleTabsClick() {
}

watch(() => data.value, (value) => {
  if (!isEmpty(value)) {
    options.value = value;
    renders.value = (value?.renders).map((item) => ({
      ...item,
      value: item?.name,
    }));
  }
})


const getBindValues = computed(() => {
  const _props = toRaw(unref(renderer));
  if(Reflect.has(_props,'value')) delete _props['value']
  return {
    target: toRaw(unref(target)),
    sizer: sizer.value,
    ..._props,
  }
})

</script>

<template>
  <Stateful :value="statefulValue">
    <div :class="`${prefixCls} h-full w-full`">
      <div :class="`${prefixCls}__content relative`">
        <template v-if="renders?.length > 1">
          <!--        <HotTab v-model="curTab" :options="renders" />-->
          <el-tabs
              v-model="active"
              @tab-change="handleTabsClick"
              :class="`${prefixCls}__content-tabs relative`"
          >
            <el-tab-pane
                v-for="(renderPane, i) in renders"
                :key="renderPane.label"
                :label="renderPane.label"
                :name="i"
            >
            </el-tab-pane>
          </el-tabs>
          <div class="absolute linear-progress-container">
            <LinearProgress
                :percent="100"
                active
                :visible="loading"
                color-flow
                :color="['#f5af19', '#f12711', '#9254de', '#40a9ff', '#5cdbd3']"
            />
          </div>
          <keep-alive>
            <div :class="`${prefixCls}__component`">
              <template v-if="renderer?.content">
                <component
                    :is="renderer.content"
                    @update:loading="($event) => (loading = $event)"
                    v-bind="getBindValues"
                >
                </component>
              </template>
            </div>
          </keep-alive>
          <!--  </div>-->
        </template>
        <template v-if="renders?.length === 1">
          <div :class="`${prefixCls}__component`">
            <template v-if="renders?.[0]?.content">
              <component
                  :is="renders[0].content"
                  @update:loading="($event) => (loading = $event)"
                  v-bind="getBindValues"
              >
              </component>
            </template>
          </div>
        </template>
      </div>
    </div>
  </Stateful>
</template>

<style lang="scss">
/* stylelint-disable-next-line scss/dollar-variable-pattern */
$prefixCls: #{$namespace}-explorer-wrap;
.#{$prefixCls} {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  //padding-top: 10px;
  background: transparent;
  //box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.26);
  .linear-progress-container {
    top: 0;
    right: 0;
    left: 0;
    width: auto;
    z-index: 10;
  }

  &__content {
    display: flex;
    flex-direction: column;
    //grid-template-rows: auto 1fr;
    flex: 1;
    width: 100%;
    min-width: 0;
    height: 100%;
    min-height: 0;

    &-tabs {
      width: 100%;
      min-width: 0;
      height: 50px;
      .el-tabs__active-bar {
        display: none;
      }

      .el-tabs__nav-wrap::after {
        height: 1px;
        background-color: #dcdcdc;
      }



      .el-tabs__item {
        height: 50px;
        color: #757575;
        font-size: 16px;

        &.is-top:nth-child(2) {
          padding-left: 20px!important;
        }

        &.is-top:last-child {
          padding-right: 20px!important;
        }
      }

      .el-tabs__item.is-active {
        background: #d3eafd;
        color: #2196f3;
        font-family: SourceHanSansCN-Bold;
        position: relative;

        &:before {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          content: '';
          height: 2px;
          background: #2196f3;
        }
      }
    }
  }

  &__component {
    height: 100%;
    min-height: 0;
    padding: 10px;
  }
}
</style>
