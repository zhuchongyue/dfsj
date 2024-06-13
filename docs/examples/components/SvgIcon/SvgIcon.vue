<template>
  <div class="h-40px">
    <Highlight
        :tag="state.tag"
        :keys="state.keys"
        @click="handle"
        :color="state.color"
    >
  {{state.text}}
    </Highlight>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {Highlight} from "@dfsj/components"
function handle(key:string) {
  console.log('handle', key)
}
const state = reactive({
   text:'我是一段需要高亮的文字，这里将会有很多需要高亮的关键字，并且可以绑定高亮文字的点击事件...',
   keys:['高亮','点击事件'],
   tag:'div',
   color:'red'
})
</script>