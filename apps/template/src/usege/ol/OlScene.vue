<template>
	    <Plot/>
<!--	<Typhoon />-->
<!--	  <Measure />-->
</template>

<script setup lang="ts">
import Plot from "/src/usege/ol/components/Plot.vue";
</script>
<style lang="scss">
#ec-ol-map-container {
	height: 100vh;
	width: 100vw;
	background: #f2f2f2;
}

.ecol-container {
	height: 100vh;
	width: 100vw;
}

.layer-manage {
	display: flex;
	gap: 5px;

	img {
		height: 40px;
		width: 70px;
		cursor: pointer;
		background: transparent;
	}
}
</style>