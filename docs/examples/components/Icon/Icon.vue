<template>
  <div class="h-40px flex gap-15px">
     <template v-for="(icon , index) in iconsName" :key="index">
       <Icon
         :icon="icon"
         :size="40"
       />
     </template>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {Icon} from "@dfsj/components"
const iconsName =[
    'logos:android-vertical',
    'logos:apache-spark',
    'logos:firefox',
    'logos:google-icon',
    'skill-icons:nestjs-light',
    'skill-icons:github-light',
    'skill-icons:vscode-light',
    'skill-icons:html',
    'skill-icons:graphql-light',
    'skill-icons:jenkins-light',
    'skill-icons:react-light',
    'skill-icons:npm-light',
    'mdi:application-brackets',
    'mdi:application-variable',
]
</script>