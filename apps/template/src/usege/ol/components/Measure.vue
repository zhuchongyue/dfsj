<template>
	<div class="layer-manage bg-white">
		面积长度测算
		<!--    <div v-for="(item , index) in base">-->
		<!--      <div @click="()=>handleChange(item)">-->
		<!--        <img width="70" height="30" :src="item.thumbnail" alt="">-->
		<!--      </div>-->
		<!--    </div>-->

		<div>
			<el-button @click="handleStart">开始</el-button>
			<el-button @click="handleStop">结束</el-button>
			<el-button @click="handleClear">清除</el-button>

			<el-radio-group v-model="type">
				<el-radio :label="'area'">面积</el-radio>
				<el-radio :label="'distance'">长度</el-radio>
				<el-radio :label="'angle'">角度</el-radio>
			</el-radio-group>
		</div>
	</div>
	<div id="ec-ol-map-container"> </div>
</template>

<script setup lang="ts">
import * as ol from '@dfsj/ol'
import {OlBaseMap} from '/src/usege/ol/config/olBaseMap'
import {computed, onMounted, ref} from 'vue'

const base = computed(() => OlBaseMap.baseLayers)
let map: any = null
console.log('&&****&&&&这是库的export方法', ol)
let measure: any = null
const type = ref()

//绘制
function handleStart() {
	console.log('measure', measure)
	measure?.deactivate?.()
	if (!type.value) return
	measure.activate(type.value, {
		onStop: (e) => {
			console.log('完成', e)
		}
	})
}

//停止
function handleStop() {
	console.log('...', measure)
	type.value = null
	measure?.deactivate?.()
}

function handleClear() {
	measure.clear()
}

let home = [97.528555, 21.142501, 106.19696203, 29.22582455] //Home边界
const pos = [105.00625, 27.560108]

let receiveLayer = new ol.VectorLayer('ol-plot-layer')
onMounted(() => {
	map = new ol.Map('ec-ol-map-container', OlBaseMap)
	map.flyToBounds(home, {
		duration: 500
	})
	map.addLayer(receiveLayer)
	let layer = new ol.VectorLayer('test')
	// console.log('VectorLayer', layer)
	console.log('*******************map', map)
	// map.tooltip.enable = true;
	// map.tooltip.show([117.28, 31.86], "wedwfwefwefwefwef");
	// setTimeout(()=>{
	//   map.tooltip.enable = false;
	//   map.tooltip.setPotions([106, 26]);
	// },2000)
	map.on(ol.MouseEventType.WHEEL, (ev) => {
		// console.log('外部使用监听的方法  鼠标滚轮',ev)
	})

	map.on(ol.MouseEventType.CLICK, (ev) => {
		// console.log('外部使用监听的方法  点击事件',ev)
	})
	map.on(ol.MouseEventType.POINTER_MOVE, (ev) => {
		// console.log('外部使用监听的方法  鼠标移动',ev)
	})

	map.popup.enable = true

	measure = new ol.Measure(map)

	// measure.distance()
	// measure.activate('angle',{})
	// measure.area()
})
</script>
<style lang="scss">
#ec-ol-map-container {
	height: 100vh;
	width: 100vw;
	//background: #f2f2f2;
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