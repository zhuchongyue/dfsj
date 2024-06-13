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
import {OlBaseMap} from '/src/usege/ol/config/Distribution'
import {computed, onMounted} from 'vue'
import {getStationInfo, getStationMap} from '/src/api/usage/ol'
import diff from '/src/utils/diff'
import {useDebounceFn} from '@dfsj/hooks'
import {billboardConfig} from '/src/usege/ol/config/billboard'

const base = computed(() => OlBaseMap.baseLayers)
let map: any = null
console.log('&&****&&&&这是库的export方法', ol)
let plot: any = null

//绘制
function handleStart() {}

//停止
function handleStop() {
	console.log('...', plot)
	plot?.stop()
}

let home = [97.528555, 21.142501, 106.19696203, 29.22582455] //Home边界
const pos = [105.00625, 27.560108]

let vectorLayer: any = null
onMounted(() => {
	map = new ol.Map('ec-ol-map-container', OlBaseMap)
	vectorLayer = new ol.VectorLayer('test')
	map.addLayer(vectorLayer)
	// console.log('VectorLayer', layer)
	console.log('*******************map', map.flyToBounds)
	map.flyToBounds(home, {
		duration: 500
	})

	// setTimeout(()=>{
	//   map.flyToPosition(pos,{
	//     duration:500,
	//     zoom:10
	//   })
	// },2000)
	// map.tooltip.enable = true;
	// map.tooltip.show([117.28, 31.86], "wedwfwefwefwefwef");
	// setTimeout(()=>{
	//   map.tooltip.enable = false;
	//   map.tooltip.setPotions([106, 26]);
	// },2000)
	map.on(ol.MouseEventType.WHEEL, (ev) => {
		console.log('外部使用监听的方法  鼠标滚轮', ev)
		debounceFnRun(ev?.movement)
	})

	map.on(ol.MouseEventType.CLICK, (ev) => {
		console.log('外部使用监听的方法  点击事件', ev)
	})
	map.on(ol.MouseEventType.POINTER_MOVE, (ev) => {
		// console.log('外部使用监听的方法  鼠标移动',ev)
	})

	map.popup.enable = true
})

async function getDetailInfo(target: any) {
	return new Promise((resolve, reject) => {
		const params = {
			stcd: target?.stcd,
			stationType: target?.sttp
		}
		return getStationInfo(params)
			.then((info: any) => {
				resolve(info)
			})
			.catch(() => {
				resolve({})
			})
	})
}

async function getStationData(movement: any) {
	if (!movement) return
	const params = {
		box: movement?.extent,
		scale: movement?.zoom,
		adcd: '530000000000000',
		key: '',
		stationType: ''
		// usfl:''
	}
	let data = (await getStationMap(params)) as Array<any>
	console.log('新增的覆盖物', data)
	const overlays = vectorLayer?.getOverlays?.()?.map((e) => e?.attr)
	console.log('已经有的覆盖物', overlays)
	const comparator = (older: any, newer: any) => {
		return older?.stcd == newer?.stcd
	}
	const { absent, additional, identical } = diff(overlays, data, comparator)
	console.log({ absent, additional, identical })
	//删除
	absent.length &&
		absent.forEach((ab) => {
			const ovId = ab?.stcd
			const ov = vectorLayer.getOverlay?.(ovId)
			if (ov) {
				vectorLayer.removeOverlay?.(ov)
			}
		})
	additional.length &&
		additional?.map((item: any) => {
			const billboard = new ol.Billboard([item?.lgtd, item?.lttd], {
				id: item?.stcd
			})
			billboard.attr = { ...item }
			billboard.setStyle(billboardConfig.style.normal)
			billboard.listen(ol.OverlayEventType.MOUSEOVER, async (e) => {
				map.popup.hide()
				console.log('OverlayEventType鼠标移动', e)
				// billboard.setStyle(billboardConfig.style.hovered);
				const pos = billboard.center
				map.popup.show(pos, '加载中...')
				getDetailInfo(item)
					.then((info: any) => {
						const props = { ...item, ...info }
						const strHtml = `
                    <div>${billboardConfig.overlay.title(props)}
                    ${billboardConfig.overlay.content(props)}
                    </div>
                    `
						map.popup.show(pos, strHtml)
					})
					.catch(() => {
						map.popup.hide()
					})
			})
			billboard.listen(ol.OverlayEventType.MOUSEOUT, (e) => {
				console.log('OverlayEventType鼠标移出', e)
				map.popup.hide()
				// billboard.setStyle(billboardConfig.style.normal);
			})
			billboard.listen(ol.OverlayEventType.CLICK, (e) => {
				console.log('OverlayEventType点击', e)
			})
			vectorLayer.addOverlay(billboard)
		})
	console.log('vectorLayer', vectorLayer.getOverlays()?.length)
}

const { run: debounceFnRun } = useDebounceFn(getStationData, 500)
const { run: debounceGetDetailInfo } = useDebounceFn(getDetailInfo, 500)
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