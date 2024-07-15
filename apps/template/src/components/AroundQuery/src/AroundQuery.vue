<script lang="ts" setup>
import {computed, h, reactive, Ref, ref, unref, watch} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {Icon, Stateful} from "@dfsj/components"
import {groupBy} from "lodash-es";
import {AroundQueryProps, defaultOptions} from "@/components/AroundQuery/src/props.ts";
import {toReactive} from "@vueuse/core";
import {GisSymbolKey} from "@/core/GisCache.ts";
import {getLayerManage} from "@/core/adapter/class";
import BasicTabs from "/@/components/Tabs/BasicTabs.vue"
import {getAroundQueryLayerConfig} from "@/components/AroundQuery/src/feature.config.ts";
import {useRootStoreWithOut} from "@/store/root.ts";
import {usePropsLoader} from "@/components/Explorer/src/usePropsLoader.ts";
import {LinearProgress} from "@/components/LinearProgress";
const {prefixCls} = useDesign('component-around-query-page');
const catagory = "catagory";
const props = defineProps(AroundQueryProps);
const {options, narrow, sizer,target,title} = toReactive(props)
const active: Ref = ref<any>(null),
    selectable: Ref = ref(false),
    checks = reactive<any>({}),
    select = reactive<any>(new Set());

const size = computed(()=>select.size ?? 0)
const collapseNames = ref([]);
//TODO 使用统一的方法请求
const {data,condition,statefulValue,stateful} = usePropsLoader(target,props);
//复选框
const checkAlls = reactive<any>({})
const checkIsIndeterminates = reactive<any>({});
const control = options.control || {};
function onSelectable() {
  selectable.value = !selectable.value;
  setAllChecked(selectable.value)
}
function onClear() {
  if (select.size){
    const manager = getLayerManage(GisSymbolKey.default)
    select.forEach((item)=>{
      const config = getAroundQueryLayerConfig(toRaw(unref(item)));
      manager.remove(config)
    })
    select.clear()
  }
}

/**
 * 勾选导出
 */
function onExport() {
  const motypes = Object.values(checks).reduce((acc, curr) => acc.concat(curr), []);
  options.handlers.export(unref(data),motypes)
}

/**
 * 查看汇总
 */
function onSummary() {
  useRootStoreWithOut().window.open({
    id: 'impact-briefing',
    title: `影响风险简报`,
    sizes: ['40vw', '35vh'],
    content: () => import('./BriefingBrowser.vue'),
    props: {
      data: data.value,
    },
  })
}

function handleCheckedGroupChange(value, item) {
  const checkedCount = value.length;
  const all = item?.children.map(c => c?.id) ?? [item.id];
  checkAlls[item.id] = checkedCount === all.length
  checkIsIndeterminates[item.id] = checkedCount > 0 && checkedCount < all.length

}


//根据结果分组  确定tab个数
const content = computed(() => {
  let list = data.value?.details ?? [];
  if (list?.length) {
    active.value = list[0][catagory];
    return groupBy(list, catagory);
  }
  return null;
});

//设置全部展开
function setCollapse() {
  const ct = unref(content);
  let ids: any = []
  for (const ctKey in ct) {
    ct[ctKey]?.forEach((ctv: any) => {
      ids.push(ctv?.id)
    })
  }
  collapseNames.value = ids;
}

//设置全部勾选
function setAllChecked(value = true) {
  const ct = unref(content);
  for (const ctKey in ct) {
    ct[ctKey]?.forEach((ctv: any) => {
      checkAlls[ctv.id] = value
      handleCheckAllChange(value, ctv)
    })
  }
}
const curTab = ref<any|string>(null)
const tabOptions = computed(() => {
  if (!content.value){
    curTab.value = '影响分析'
    return [{
      value:'影响分析',
      label:'影响分析',
    }];
  }
  let arr = Object.keys(content.value)?.map((key) => {
    return {
      value: key,
      label: key
    }
  }) ?? [];
  if (arr.length) {
    curTab.value = arr?.[0].value
  }
  return arr
})
function handleCheckAllChange(checked, item) {
  const all = item?.children?.map(c => c?.id) ?? [item.id];
  checks[item.id] = checked ? all : []
  checkIsIndeterminates[item.id] = false
}
function hasMore(item) {
  return !!(item.uuid && item.count);
}
function onDetails(item) {
  options.handlers.details?.(item)
}
//加载图层信息
function onToggleSelect(item) {
  if (item?.loadMap != 1) return;
  const manager = getLayerManage(GisSymbolKey.default)
  const selected = select.has(item);
  const config = getAroundQueryLayerConfig(item);
  if (!selected && item.count > 0) {
    manager.addition(config)
    // caches.set(item, layer)
    select.add(item)
  } else if (selected) {
    manager.remove(config)
    // caches.delete(item)
    select.delete(item)
  }
}
const suffixUnit = () => h('span', control.preset.units)

watch(()=>data.value , (value, oldValue, onCleanup)=>{
    setCollapse()
})
</script>
<template>
  <div :class="[prefixCls , {narrow}]">
    <template v-if="narrow">
      <!--窄的时候-->
      <BasicTabs mode="vertical" v-model="curTab" :options="tabOptions"/>
    </template>
    <!--头部-->
    <div :class="['renderer--container', {narrow}]">
      <div :class="['renderer--container-adapt relative' , {narrow}]">
        <div class="absolute around-linear-progress">
          <LinearProgress
              :percent="100"
              active
              :visible="stateful.isLoading"
              color-flow
              :color="['#f5af19', '#f12711', '#9254de', '#40a9ff', '#5cdbd3']"
          />
        </div>
        <div class="renderer--actions">
          <div v-if="narrow" class="flex items-center renderer--title ">{{ title }}</div>
          <div class="flex items-center">
            <el-button type="primary" @click="onSelectable" title="选择导出">
              <template #icon>
                <Icon size="26" icon="mdi:playlist-check"/>
              </template>
            </el-button>
            <el-button type="success" @click="onExport" v-show="selectable" title="立即导出">
              <template #icon>
                <Icon size="26" icon="mdi:file-export"/>
              </template>
            </el-button>
            <el-button type="warning" @click="onSummary" title="生成汇总">
              <template #icon>
                <Icon size="26" icon="mdi:microsoft-excel"/>
              </template>
            </el-button>
            <el-button type="danger" @click="onClear" title="清除">
              <template #icon>
                <Icon size="26" icon="mdi:broom"/>
              </template>
              {{size || ''}}
            </el-button>
          </div>
        </div>
        <div class="renderer--control">
          <el-radio-group v-model="condition[control.preset.names]">
            <el-radio-button
                v-for="(item , index ) in control.preset.items"
                :label="item.label"
                :value="item.value"/>
          </el-radio-group>
          <el-input
              v-model="condition[control.preset.names]"
              :suffix-icon="suffixUnit"
          />
        </div>
      </div>
      <!--宽的时候-->
      <template v-if="!narrow">
        <BasicTabs mode="horizontal" v-model="curTab" :options="tabOptions"/>
      </template>
      <!--渲染内容-->
      <template v-for="(item) in tabOptions"
                :key="item.value">
        <Stateful :value="statefulValue">
        <div class="renderer--content" :key="`tab${item.value}`" v-if="curTab == item.value">
          <el-collapse :accordion="false" v-model="collapseNames">
            <template
                v-for="(e , index) in content?.[item.value]">
              <el-collapse-item
                  v-if="!!e?.children"
                  :name="e?.id"
                  :title="e?.name">
                <template #title>
                  <el-checkbox
                      @click.stop=""
                      v-if="selectable"
                      v-model="checkAlls[e.id]"
                      :indeterminate="checkIsIndeterminates[e.id]"
                      @change="(ev)=>handleCheckAllChange(ev,e)"
                  >
                  </el-checkbox>
                  <img @click.stop="" class="item--image" :src="`/images/layer/${e.id}/431.png`" alt=""/>
                  <label @click.stop="" class="item--label">{{ e.name }}</label>
                  <label class="item--space flex-1"></label>
                </template>
                <el-checkbox-group
                    v-model="checks[e.id]"
                    @change="(ev)=>handleCheckedGroupChange(ev,e)"
                >
                  <template v-for="(sub,j) in e?.children" :key="j">
                    <div class="second"
                         @click.stop="onToggleSelect(sub)"
                         :class="{
                          clickable:hasMore(sub),
                          select:select.has(sub)}">
                      <el-checkbox :value="sub.id"
                                   @click.stop="()=>{}"
                                   v-if="selectable"
                      ></el-checkbox>
                      <img class="item--image" :src="`/images/layer/${sub.id}/431.png`" alt=""/>
                      <label class="item--label" :title="sub.name">{{ sub.name }}</label>
                      <Icon icon="mdi:earth" color="darkgray" v-if="select.has(sub)"></Icon>
                      <label class="item--space flex-1"></label>
                      <label class="item--value"> {{ sub.count ?? "--" }}</label>
                      <label class="item--units" v-if="!!sub.unit">（{{ sub.unit }}）</label>
                      <label class="item--mores">
                        <Icon :size="22" v-if="hasMore(sub)" @click.stop="onDetails(sub)" icon="mdi:view-headline"/>
                      </label>
                    </div>
                  </template>
                </el-checkbox-group>
              </el-collapse-item>
              <template v-else>
                <div class="el-collapse-item">
                  <el-checkbox
                      style="position: absolute;left: -999px;opacity: 0"
                      @click.stop=""
                      v-if="selectable"
                      v-model="checkAlls[e.id]"
                      :indeterminate="checkIsIndeterminates[e.id]"
                      @change="(ev)=>handleCheckAllChange(ev,e)"
                  />
                  <div class="el-collapse-item__header box-border"
                       @click.stop="onToggleSelect(e)"
                       :class="{
                          clickable:hasMore(e),
                          select:select.has(e)}">
                    <el-checkbox-group
                        v-model="checks[e.id]"
                        @change="(ev)=>handleCheckedGroupChange(ev,e)"
                    >
                      <el-checkbox :value="e.id"
                                   @click.stop="()=>{}"
                                   v-if="selectable"
                      ></el-checkbox>
                      <img class="item--image" :src="`/images/layer/${e.id}/431.png`" alt=""/>
                      <label class="item--label" :title="e.name">{{ e.name }}</label>
                      <Icon icon="mdi:earth" color="darkgray" v-if="select.has(e)"></Icon>
                      <label class="item--space flex-1"></label>
                      <label class="item--value"> {{ e.count ?? "--" }}</label>
                      <label class="item--units" v-if="!!e.unit">（{{ e.unit }}）</label>
                      <label class="item--mores">
                        <Icon :size="22" v-if="hasMore(e)" @click.stop="onDetails(e)" icon="mdi:view-headline"/>
                      </label>
                    </el-checkbox-group>
                  </div>
                </div>
              </template>
            </template>

          </el-collapse>
        </div>

                </Stateful>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-around-query-page;
$second_height: 40px;
$icon_width: 32px;
.#{$prefix-cls} {
  padding: 5px;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  display: grid;
  //grid-template-rows: auto auto 1fr;
  .el-radio-button__inner {
    padding-left: 5px;
    padding-right: 5px;
  }
  .el-input__inner {
    text-align: center;
    font-weight: bolder;
  }
  .block__style, .linear__style {
    background: #ecf0f2;
  }
  .renderer--title {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    text-indent: 15px;
    color: $primary-color;
  }
  &.narrow {
    grid-template-columns: auto 1fr;
    grid-template-rows:unset;
    gap: 5px;
  }

  .renderer--content {
    height: 100%;
    min-height: 0;
    overflow-y: scroll;
    padding-bottom: 30px;
    box-sizing: border-box;
    width: 100%;
  }

  .around-linear-progress {
    bottom: 0;
    right: 0;
    left: 0;
    width: auto;
    z-index: 10;
  }
  .renderer--container {
    display: grid;
    grid-template-rows: 50px 50px 1fr;
    height: 100%;
    min-height: 100%;

    .renderer--container-adapt {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;

      .renderer--control {
        flex: 1;
        display: grid;
        grid-template-columns: auto 30%;
        gap: 16px;
        justify-content: start;
      }
    }

    &.narrow {
      grid-template-rows: auto 1fr;

      .renderer--container-adapt {
        display: grid;
        grid-template-rows: repeat(2, 40px);
      }

      .renderer--actions {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .renderer--control {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 16px;
      }
    }

  }

  .el-checkbox {
    margin: 0 !important;
  }

  .el-collapse {
    border-bottom: none;
    border-top: none;

    .el-collapse-item__header {
      border-bottom: 1px solid rgba(142, 152, 168, 0.4);
      padding-left: 12px;

      .item--label {
        font-size: 18px;
      }
    }

    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }

  .el-collapse-item {
    margin: 1px 0 10px 0;
    box-sizing: border-box;
    background: #fff;
    border-left: 1px solid #DCDCDC;
    border-right: 1px solid #DCDCDC;
    border-radius: 4px;
    box-shadow: 0 0.0625rem 0.3125rem 0 rgb(0 0 0 / 20%), 0 0.125rem 0.125rem 0 rgb(0 0 0 / 14%), 0 0.1875rem 0.0625rem -0.125rem rgb(0 0 0 / 12%);

  }

  .el-collapse-item__content {
    padding-bottom: 0;

    .second {
      transition: all .5s ease-in-out;
      margin-left: 30px;
      padding-right: 10px;
      height: $second_height;
      display: flex;
      align-items: center;
      position: relative;

      .item--value {
        font-size: 1rem;
        font-weight: bold;
      }

      .item--label {
        padding: 0 5px;
        text-overflow: ellipsis;
        cursor: pointer;
      }

      .item--units {
        font-size: 0.7rem;
      }

      label {
        display: block;

        &.el-checkbox {
          height: auto;
        }
      }

      .item--mores {
        width: 2rem;
        cursor: pointer;
        margin-left: 5px;
      }

      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px dashed #DCDCDC;
      }

      &:last-child {
        &:after {
          box-shadow: none;
          background: none;
          border-bottom: none;
        }
      }

      &.clickable {
        &:hover {
          background: rgba(2, 123, 227, 0.1);
        }
      }
    }

    .item--label {
      font-size: 16px;
    }
  }

  .item--image {
    width: 21px;
    height: 21px;
    margin-right: 5px;
    margin-left: 10px;

    img {
      object-fit: contain !important;
    }
  }

}
</style>