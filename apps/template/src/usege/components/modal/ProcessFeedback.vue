<script setup lang="ts">
import {computed} from 'vue'

const ram = computed(() => Math.floor(Math.random() * 21))
</script>

<template>
	<div  > 测试的 {{ ram }} </div>
</template>