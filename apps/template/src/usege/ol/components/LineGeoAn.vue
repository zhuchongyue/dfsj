<template>
	{{ base.length }}
	<div class="layer-manage">
		<div v-for="(item, index) in base">
			<div @click="() => handleChange(item)">
				<img width="70" height="30" :src="item.thumbnail" alt="" />
			</div>
		</div>
	</div>
	<div id="ec-ol-map-container"> </div>
</template>

<script setup lang="ts">
import * as ol from '@dfsj/ol'
import {OlBaseMap} from '/src/usege/ol/config/olBaseMap'
import {computed, onMounted} from 'vue'
import geo from './config/geo.json'
import lineGeo from './config/line.json'

const base = computed(() => OlBaseMap.baseLayers)
let map: any = null
console.log('&&****&&&&这是库的export方法', ol)
onMounted(() => {
	map = new ol.Map('ec-ol-map-container', OlBaseMap)
	let layer = new ol.VectorLayer('test')
	console.log('VectorLayer', layer)

	/***
	 * geo
	 */
	const geoData = {
		geometryType: 'GeoJSON',
		geometry: geo
	}
	const geojson = new ol.GeoJsonLayer('geojson-layer', lineGeo, {
		dataProjection: 'EPSG:4326',
		featureProjection: 'EPSG:4490'
	}).eachOverlay((item: any) => {
		console.log('eachOverlay', item)
		const polyline = ol.Polyline.fromEntity(item)
		polyline.setStyle({
			stroke: {
				strokeColor: 'red',
				strokeLineCap: 'round', // 设置线的两端为圆头
				strokeWidth: 5,
				strokeLineDash: [10, 2, 5, 8, 5]
			},
			fill: {
				fillColor: '#0F0'
			}
		})
		// console.log('polygon',polygon)
		layer.addOverlay(polyline)
	})
	// billboard.listen(ol.OverlayEventType.MOUSEOVER ,(e)=>{
	//   console.log('OverlayEventType鼠标移动',e)
	// })
	// billboard.listen(ol.OverlayEventType.MOUSEOUT ,(e)=>{
	//   console.log('OverlayEventType鼠标移出',e)
	// })
	// billboard.listen(ol.OverlayEventType.CLICK ,(e)=>{
	//   console.log('OverlayEventType点击',e)
	// })
	//
	// console.log('bill', billboard)
	map.addLayer(layer)
	console.log('map', layer)
})

function handleChange(item: any) {
	console.log('切换', item)
	console.log('map', map)
	const key = 'layerName'
	const value = item.layerName
	map?.changeBaseLayer?.(key, value)
}
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
	}
}
</style>