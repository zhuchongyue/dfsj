<!--密码强度组件-->
<template>
  <div class="h-40px">
    <InputPassword strength  v-model="password"/>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref} from 'vue'
import {InputPassword} from "@dfsj/components"

const  password = ref('')
</script>