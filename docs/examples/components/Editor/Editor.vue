<template>
  <div class="h-200px overflow-hidden">
    <Editor v-model="defaultHtml" ref="editorRef" @change="change" />
  </div>
</template>
<script setup lang="ts">
import { Editor } from '@dfsj/components'
import { ref} from 'vue'

const defaultHtml = ref('<p>hello <strong>world</strong></p>')

const change = (html: string) => {
  console.log(html)
}
</script>