<template>
	<div class="w-full h-full overflow-hidden">
		<div id="vr-wrapper"></div>
	</div>
</template>
<script lang="ts" setup>
import {PhotoSphereViewer} from '@dfsj/twins'
import {onMounted} from 'vue'

onMounted(() => {
	let instance = new PhotoSphereViewer()
	console.log({ instance })
})
</script>

<style lang="scss">
#vr-wrapper {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
}
</style>