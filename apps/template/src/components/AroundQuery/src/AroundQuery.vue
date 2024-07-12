<script lang="ts" setup>
import {computed, ref, toRaw, unref, watchEffect,h, Ref, reactive} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
import {Mock} from "@/components/AroundQuery/src/mock.ts";
import {groupBy} from "lodash-es";
import {Icon} from "@dfsj/components";
import {AroundQueryProps} from "@/components/AroundQuery/src/props.ts";
import {getter} from "@dfsj/utils";
import {toReactive} from "@vueuse/core";
import {GisSymbolKey} from "@/core/GisCache.ts";
import {getLayerManage} from "@/core/adapter/class";
import BasicTabs from "/@/components/Tabs/BasicTabs.vue"
import getLayerConfig from "@/core/adapter/config/layer.feature.config.ts";
import {getAroundQueryLayerConfig} from "@/components/AroundQuery/feature.config.ts";
const {prefixCls} = useDesign('component-around-query-page');
const catagory = "catagory";
const data = ref(Mock);
const props = defineProps(AroundQueryProps);
const { options, narrow ,sizer  } = toReactive(props)
const active: Ref = ref(null),
    selectable: Ref = ref(false),
    checks = reactive({}),
    select = reactive(new Set());
const collapseNames = ref([]);
function setCollapse(){
    const content = unref(content)
   // const totalName = unref()
}
//复选框
const checkAlls = reactive({})
const checkIsIndeterminates = reactive({});

const condition: any = reactive(getter(options.condition) || {});
const control = options.control || {};

function load() {

}

function onSelectable() {
  selectable.value = !selectable.value;
}

function onClear() {

}

function onExport() {
  console.log('选择的', checks)
}

function onSummary() {

}

function handleCheckedGroupChange(value, item) {
  console.log('选择', value, item);
  const checkedCount = value.length;
  const all = item?.children.map(c => c?.id);
  checkAlls[item.id] = checkedCount === all.length
  checkIsIndeterminates[item.id] = checkedCount > 0 && checkedCount < all.length

}


//根据结果分组  确定tab个数
const content = computed(() => {
  // Object.keys(checks).forEach(key => delete checks[key]);
  let list = data.value?.details;
  if (list?.length) {
    list.forEach(e => onCheck(e, true));
    active.value = list[0][catagory];
    console.log('groupBy(list, catagory)', groupBy(list, catagory))
    return groupBy(list, catagory);
  }
  return null;
});
const curTab = ref(null)
const tabOptions = computed(()=>{
   let arr = Object.keys(content.value).map((key,index)=>{
       return {
         value:key,
         label:key
       }
   }) ?? [];
  arr.push({ value:'救援力量',
    label:'救援力量'})
   if (arr.length) {
     curTab.value = arr?.[0].value
   }
  return arr
})

function onCheck(checked: boolean) {
  console.log('onCheck', checked)
}

function handleCheckAllChange(checked, item) {
  const all = item?.children.map(c => c?.id);
  checks[item.id] = checked ? all : []
  checkIsIndeterminates[item.id] = false
  console.log('handleCheckAllChange', checked, item, all)
}

function hasMore(item) {
  return !!(item.uuid && item.count);
}

function onDetails(item) {
  console.log('打开详情',item)
  options.handlers.details?.(item)
}
//加载图层信息
function onToggleSelect(item){
  console.log('加载到地图信息',item)
  if (item?.loadMap != 1) return;
  const manager = getLayerManage(GisSymbolKey.default)
  const selected = select.has(item);
  const config = getAroundQueryLayerConfig(item);
  if (!selected  && item.count > 0) {
    console.log('获取信息',config)
    manager.addition(config)
    // caches.set(item, layer)
    select.add(item)
  } else if (selected) {
    manager.remove(config)
    // caches.delete(item)
    select.delete(item)
  }
}

const suffixUnit = ()=> h('span',control.preset.units)

</script>
<template>
  <div :class="[prefixCls , {narrow}]">
    <!--窄的时候-->
    {{narrow}}
    <BasicTabs  type="linear" mode="vertical" v-model="curTab"  :options="tabOptions"  />


    <!--头部-->
    <div class="renderer--container">


      <div class="renderer--control">
        <div class="h-full flex items-center">
<!--          查询半径：-->
          <el-radio-group v-model="condition[control.preset.names]">
            <el-radio-button
                v-for="(item , index ) in control.preset.items"
                :label="item.label"
                :value="item.value"/>
          </el-radio-group>
<!--          自定义({{ control.preset.units }})：-->
          <el-input
              v-model="condition[control.preset.names]"
              :suffix-icon="suffixUnit"
          />


<!--          <el-button>-->
<!--            查询-->
<!--            <template #icon>-->
<!--              <Icon icon="mdi:magnify"/>-->
<!--            </template>-->
<!--          </el-button>-->
        </div>
        <div class="renderer--actions">
<!--          <el-button type="primary" @click="onSelectable" title="选择导出">-->
<!--            <template #icon>-->
<!--              <Icon size="26" icon="mdi:playlist-check"/>-->
<!--            </template>-->
<!--          </el-button>-->
<!--          <el-button type="success" @click="onExport" v-show="selectable" title="立即导出">-->
<!--            <template #icon>-->
<!--              <Icon size="26" icon="mdi:file-export"/>-->
<!--            </template>-->
<!--          </el-button>-->
<!--          <el-button type="warning" @click="onSummary" title="生成汇总">-->
<!--            <template #icon>-->
<!--              <Icon size="26" icon="mdi:microsoft-excel"/>-->
<!--            </template>-->
<!--          </el-button>-->
<!--          <el-button type="danger" @click="onClear" title="清除">-->
<!--            <template #icon>-->
<!--              <Icon size="26" icon="mdi:broom"/>-->
<!--            </template>-->
<!--          </el-button>-->
        </div>
      </div>

    </div>

    <el-tabs v-if="false" v-model="active" class="demo-tabs">
      <el-tab-pane v-for="(item , index) in content"
                   :label="index"
                   :name="index">
        <el-collapse :accordion="false" v-model="collapseNames">
          <template
              v-for="(e , index) in item">
            <el-collapse-item
                v-if="!!e?.children"
                :name="index"
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
                <label  @click.stop="" class="item--label">{{ e.name }}</label>
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
              <span>不存在子节点</span>
            </template>
          </template>

        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-around-query-page;
$second_height: 40px;
$icon_width: 32px;
.#{$prefix-cls} {
  padding: 0 5px;
  .el-radio-button__inner{
    padding: 0.5rem 0;
  }
  .el-tabs__nav-scroll{
    background: #ecf0f2;
     .el-tabs__item{
       color: $primary-color;
     }
    .el-tabs__item.is-active{
      color: white;
      background: $primary-color;
    }
  }

  .el-checkbox {
    margin: 0 !important;
  }
  .renderer--control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
  }
  .el-collapse{
    border-bottom: none;
    border-top: none;
    .el-collapse-item__header{
      border-bottom: 1px solid rgba(142, 152, 168, 0.4);
    }
    .el-collapse-item__wrap{
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

  .el-collapse-item__header {
    padding-left: 12px;
    .item--label {
      font-size: 18px;
    }
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
        // width: 100%;
        //background: repeating-linear-gradient(
        //        to right,
        //        #313E58 0,
        //        #313E58 10px,
        //        rgba(142, 152, 168, 0.4) 0,
        //        rgba(142, 152, 168, 0.4) 15px,
        //);

        border-bottom: 1px dashed #DCDCDC;
      }
      &:last-child{
        &:after{
          box-shadow: none;
          background: none;
          border-bottom: none;
        }
      }

      &.clickable{
        &:hover{
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