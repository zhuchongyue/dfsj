<template>
	<!--  {{ base.length }}-->

	<div class="layer-manage bg-white">
		<!--    <div v-for="(item , index) in base">-->
		<!--      <div @click="()=>handleChange(item)">-->
		<!--        <img width="70" height="30" :src="item.thumbnail" alt="">-->
		<!--      </div>-->
		<!--    </div>-->

		<div>
			<el-button @click="handleStart">开始</el-button>
			<el-button @click="handleStop">结束</el-button>
			<el-button @click="handleClear">清除</el-button>
			{{ PlotType.length }}
			<el-radio-group v-model="type">
				<el-radio v-for="(p, i) in PlotType" :key="p.value" :label="p.value"
					>{{ p.label }}
				</el-radio>
			</el-radio-group>
		</div>
	</div>
	<div id="ec-ol-map-container"> </div>
</template>

<script setup lang="ts">
import * as ol from '@dfsj/ol'
import {OlBaseMap} from '/src/usege/ol/config/olBaseMap'
import {computed, onMounted, ref, toRaw, unref} from 'vue'
import PlotType from '/src/usege/ol/config/plot.ts'

const base = computed(() => OlBaseMap.baseLayers)
let map: any = null
console.log('&&****&&&&这是库的export方法', ol)
let plot: any = null
const type = ref()
const drawSession = ref([])

//绘制
function handleStart() {
	plot?.stop?.()
	if (!type.value) return
	console.log('plot', plot, type.value)
	// plot.activate(type.value,{})
	plot.draw(
		type.value,
		(overlay, others) => {
			console.log('绘制完成的回调函数', overlay, others)
			const { buffer, popup, overlays } = others
			overlay && receiveLayer.addOverlay(overlay)
			buffer && receiveLayer.addOverlay(buffer)
			overlays?.forEach((o: any) => receiveLayer.addOverlay(o))
			if (Array.isArray(popup)) {
				popup?.forEach((p) => {
					map._delegate?.addOverlay(p)
				})
			} else {
				map._delegate?.addOverlay(popup)
			}
			let draw = {
				delegate: overlay,
				...others
			}
			drawSession.value.push(draw)
		},
		{
			style: {},
			// buffer: 10,
			// buffer: 10,
			popup: false
		}
	)
}

function handleClear() {
	type.value = null
	receiveLayer?.clear()
	toRaw(unref(drawSession)).forEach((e) => {
		console.log({ e })
		const popup = e.popup
		if (Array.isArray(popup)) {
			popup?.forEach((p) => {
				map._delegate?.removeOverlay(p)
			})
		} else {
			map._delegate?.removeOverlay(popup)
		}
	})
	drawSession.value = []
	// plot.deactivate( )
}

//停止
function handleStop() {
	// type.value = null
	plot?.stop?.()
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
	//FIXME 标绘功能
	plot = new ol.Plot(map, {})
	/**
	 * POLYLINE  折线 T
	 * POLYGON   多边形 T
	 * ARC 1     弧线 T
	 * FINE_ARROW 1    细箭头 T
	 * DOUBLE_ARROW 1  钳击箭头T
	 * ATTACK_ARROW 1     进攻方向 F
	 * ASSAULT_DIRECTION 1  突击方向 T
	 * STRAIGHT_ARROW 1   直箭头 T
	 * TAILED_ATTACK_ARROW 1  进攻方向（尾） F
	 * TAILED_SQUAD_COMBAT 分队战斗行动（尾） F
	 *
	 * GATHERING_PLACE 集结地 T
	 * CURVE  曲线 T
	 * CLOSED_CURVE 曲线面
	 *
	 * FREEHAND_POLYLINE 自由线
	 * FREEHAND_POLYGON 自由面
	 *
	 * RECTANGLE  矩形
	 *
	 * LUNE  弓形 F
	 * ELLIPSE  椭圆 T
	 * CIRCLE  椭圆 T
	 * SECTOR  扇形 T
	 */
	// plot.draw(ol.OverlayType.CIRCLE, (overlay) => {
	//   console.log('绘制完成的回调函数',overlay)
	//   overlay &&  receiveLayer.addOverlay(overlay)
	// }, {})
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