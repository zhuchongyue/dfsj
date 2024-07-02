<script lang="ts" setup>
import {computed, ref, toRaw, unref, watch, watchEffect} from "vue";
import {SvgIcon} from "@dfsj/components"
import {findPath} from "@dfsj/utils";
import PropEditor from "./components/index.vue"
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {PlotPrimaryType} from '@/components/Plot/src/enum/typeEnmu.ts'
import {IPlot, PlotEventConfig, PlotToolBoxConfig, PlotType} from "@/components/Plot/src/config";
import PropFactory from "@/components/Plot/src/class/PropFactory.ts";
import {usePlot} from "@/components/Plot/src/usePlot.ts";
import {GisSymbolKey} from "@/core/GisCache.ts";
import IconPicker from "@/components/Plot/src/components/IconPicker/IconPicker.vue";
import {EventEnum} from "@/components/Plot/src/enum/eventEnum.ts";
const {prefixCls} = useDesign('component-plot-page');
const svgPrefix = `plot-`;
const selected  = ref(null);
const category  = ref(null);
const propEditRef = ref(null);//操作属性编辑器的
const iconPickerRef = ref(null)
const lable = ref(null)

const { stop ,
  clearPlot,
  delPlot,startPlot,getPlotOverlays,setStyle} = usePlot(
    GisSymbolKey.default,
    {},
    {
      editable: true,
      propEditRef: propEditRef
    }
)
/**
 * 外层类型点击
 */
function onCategory(item:IPlot,index:number) {
  console.log('点击外层的操作',item,index);
  if (item.type == EventEnum.CLEAN){
    clearPlot()
  }else if(item.type == EventEnum.SAVE){
    const overlay = getPlotOverlays();
    console.log('当前所有绘制的',overlay)
  }
}
/**
 * 内部具体的标绘类型
 */
function onPlotType(item:IPlot) {
  selected.value = item.type;
  startPlot(item.type)
}


watch(()=>selected.value, (value)=>{
  const func = (node)=>{
     return node.type == value
  }
  const path = findPath(PlotToolBoxConfig,func,{
    id: 'type',
    children: 'children',
  });
  console.log('ddd',path,value)
  if (path.length > 0) {
    category.value = path?.[0]?.type;
    return
  }
  category.value = null;
})
const wholePlotToolBoxConfig = PlotToolBoxConfig.concat(PlotEventConfig)

//设置样式
function onOperation(type: 'del' | 'apply') {
  if (type === 'apply') {
    const { props = {} } = propEditRef?.value?.graph
    const propEditor = PropFactory.create(props?.type, props)
    const style = propEditor.getStyle()
    setStyle(style)
  } else if (type === 'del') {
    delPlot()
  }
}

// TODO 图标的上图标绘
const pickerHandle = (icon: string) => {
  const ref = iconPickerRef.value?.[0] as any
  const { selectedObj } = ref;
  let symbolProp = PropFactory.create(PlotType.BILLBOARD, {
    image: selectedObj?.src,
  })
  const style = symbolProp.getStyle();
  startPlot(PlotType.BILLBOARD ,{
    style
  })
}

watch(()=>lable.value , (value)=>{
   if (value){
     category.value = PlotType.TEXT
   }else{
     category.value = null
   }
},{
  deep: true,
})

watch(()=>category.value,(value, oldValue, onCleanup)=>{
  if (value == PlotType.TEXT){

  }
})
</script>
<template>
  <teleport to="body">
     <PropEditor  ref="propEditRef"  @operation="onOperation" />
  </teleport>
  <div :class="prefixCls">
    <el-popover v-for="(pt, index) in wholePlotToolBoxConfig"
                :key="`first-pt-${pt.id}}`"
                placement="left-start"
                :trigger="pt?.trigger ?? ''"
                :width="pt?.width ?? 300">
      <div  :class="`${prefixCls}__content`">
      <!--展示的内容-->
      <!-- 符号-->
      <div v-if="pt.type == PlotPrimaryType.BILLBOARD">
        <IconPicker ref="iconPickerRef" @selected="pickerHandle"/>
        <!-- <IconSelect ref="iconSelectRef" @selected="selected" />-->
      </div>
      <!-- 文字-->
      <div v-else-if="pt.type == PlotPrimaryType.TEXT">
        <el-input placeholder="请输入文本（无文本则无法绘制）"  v-model="lable"  clearable>
        </el-input>
      </div>
      <!--  其它图案-->
      <div v-else-if="pt?.children && pt?.children?.[0]?.children">
        <!-- 3层children-->
        <div v-for="(child, index) in pt.children"
             :key="child.type"
              class="box-btn">
          <div class="sub-title">{{ child.label }}</div>
          <div class="sub-btn-wrap flex">
            <div v-for="(ptc, cIndex) in child.children" :key="`children-pt-${cIndex}`"
                 @click.stop="onPlotType(ptc)"
                 :class="['sub-btn',{active:ptc.type == selected}]"
            >
              <SvgIcon slot="prefix" :name="svgPrefix + ptc.type"
                       :size="22"/>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="pt?.children" class="second">
        <div class="sub-title">{{ pt.label }}</div>
        <div class="sub-btn-wrap flex">
          <div v-for="(arrow, i) in pt?.children"
               :key="`children-arrow-${arrow?.name}`"
               @click.stop="onPlotType(arrow)"
               :class="['sub-btn',{active:arrow.type == selected}]">
            <SvgIcon :key="`arrow-${arrow?.name}`" :name="svgPrefix + arrow.type"
                     :size="22"/>
            <!--                  <span>{{ arrow?.name }}</span>-->
          </div>
        </div>
      </div>
      </div>
      <template #reference>
        <div :class="[`${prefixCls}__category`,{active: pt.type == category},pt?.class ??'']"
             @click.stop="onCategory(pt,index)">
          <SvgIcon slot="prefix"
                   :name="svgPrefix + pt.type"
                   style="height: 24px; width: 24px"/>
          <div class="title">{{ pt.label }}</div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-plot-page;
.#{$prefix-cls} {
  position: fixed;
  z-index: 999;
  left: 10px;
  bottom: 20px;
  width: 48px;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0px 3px 6px rgb(0 0 0 / 16%);
  opacity: 0.9;
  border-radius: 4px;
  color: white;
  &__category {
    width: 95%;
    margin: 0 auto;
    height: 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    color: #82899c;
    svg {
      color: #81889c;
      fill: #81889c;
    }
    &:hover ,&.active{
      color: #39d6fe;
      svg {
        fill: #39d6fe;
      }
    }
    &.clean{
      svg,.title {
        color: red;
        fill: red;
      }
    }
    &.save{
      color: green;
      svg {
        fill: green;
      }
    }
  }
  &__content{
    .sub-title{
       font-size: 14px;
       font-weight: bolder;
    }
    .sub-btn-wrap{
      align-items: center;
      gap: 5px;
       .sub-btn{
         width: 25px;
         height: 25px;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         border-radius: 4px;
         cursor: pointer;
         &.active{
           background: #e4e6e8;
         }
       }
    }
  }

}
</style>