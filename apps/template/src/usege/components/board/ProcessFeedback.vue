<script setup lang="ts">
import {propTypes} from "@dfsj/utils"

const props= defineProps({
    title:propTypes.string.def('')
  })
</script>

<template>
  <div class="h-full flex justify-center items-center"> {{ title }} </div>
</template>
