<script lang="ts" setup>
import {computed, ref, toRaw, unref, shallowReactive, onMounted, nextTick} from "vue";
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
import {ResolvableLayerProvider} from "@dfsj/components"
import {play,dbz} from "./data"
const useStore = useUserStore();
const {prefixCls} = useDesign('component-Visual-page');
console.log('时间轴信息',play)
let res = new ResolvableLayerProvider(null , play);
let _dbz = new ResolvableLayerProvider(null , dbz);
console.log('解析的结果',res)
//todo
import {BasicModal} from "@dfsj/components";
import VisualPlayer from "@/components/Visual/VisualPlayer.vue";
import {emitter} from "@dfsj/utils";
import {EMittLayerPlayable} from "@/enums/mittTypeEnum.ts";
import {GisSymbolKey} from "@/core/GisCache.ts";
import {players, rsvrPlayer} from "@/components/Visual/mock";
import LayerTitle from "@/components/Layer/LayerTitle.vue";
import Point from "@/components/Graph/Point.vue";
const target = players[0]
// const model: NodeModel = new NodeModel({...def});
// // const chips: VisualContent[] = shallowReactive([]);
// const renderer: NodeRender = new BCanvasNodeRender(model);
// // const player: NodePlayer = new TimerNodePlayer(model, renderer);


let rendererRain:any = null;
let rendererDbz:any = null;
function registerRain(r) {
  rendererRain = r
}
function registerBdz(r) {
  rendererDbz = r
}
onMounted(()=>{
   nextTick(()=>{
     setTimeout(()=>{
       // rendererRain.update(res)
       // rendererRain.render();
       //
       //
       // rendererDbz.update(_dbz)
       // rendererDbz.render();

     },1000)
   })
})
const visible = ref(true);


function onRenderFrameRain(index) {
  console.log('降水',index)
}
function onRenderFrameDbz(index) {
  console.log('雷达回波',index)
}

const click = (origin,key:Symbol)=>{
  emitter.emit(EMittLayerPlayable.VISUAL_PLAYABLE_ATTACH + key?.toString(), origin);
}

</script>
<template>
  <div :class="prefixCls">
     <Point/>
    <BasicModal
        :visible="true"
        :footer="false"
        :header="false"
        @close="visible = false"
        :offset="{ top: '400px', right: '15%' }"
    >
      <LayerTitle  :layer-title-key="GisSymbolKey.default"/>
    </BasicModal>
<!--    <BasicModal-->
<!--        :visible="true"-->
<!--        :footer="false"-->
<!--        :header="false"-->
<!--        @close="visible = false"-->
<!--        :offset="{ top: '400px', left: '15%' }"-->
<!--    >-->
<!--    <LayerTitle  :layer-title-key="GisSymbolKey.deriveDemo"/>-->
<!--    </BasicModal>-->
    <div>
      <span>{{GisSymbolKey.default}}</span>
      <el-button
          v-for="(origin,index) in players.concat(rsvrPlayer)"
          :key="origin.id"
          @click="click(origin,GisSymbolKey.default)">{{ origin.label }}</el-button>
    </div>

<!--    <span>{{GisSymbolKey.deriveDemo}}</span>-->
<!--    <el-button-->
<!--        v-for="(origin,index) in players"-->
<!--        :key="origin.id"-->
<!--        @click="click(origin,GisSymbolKey.deriveDemo)">{{ origin.label }}</el-button>-->
    <VisualPlayer :offset="{ bottom: '50px', left: '20%' }" :play-key="GisSymbolKey.default"/>

<!--    <VisualPlayer :play-key="GisSymbolKey.deriveDemo"/> />-->

  </div>
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-Visual-page;
.#{$prefix-cls} {
  position: fixed;
  z-index: 100;
}
</style>