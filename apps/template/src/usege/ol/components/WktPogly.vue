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
import OverlayCfg from '/src/usege/ol/config/overlay'
import Weathers from './data/wktWeather.json'

const WeatherArray = Weathers.data

const base = computed(() => OlBaseMap.baseLayers)
let map: any = null
console.log('&&****&&&&这是库的export方法', ol)
onMounted(() => {
	map = new ol.Map('ec-ol-map-container', OlBaseMap)
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
	/***
	 * geo
	 */
	const geoData = {
		geometryType: 'GeoJSON'
		// geometry: geo
	}
	map.popup.enable = true
	console.log('WeatherArray', WeatherArray.length)
	WeatherArray.forEach((issue, index) => {
		const { cgeom, ...attr } = issue
		const geojson = new ol.WktLayer('wkt-layer', cgeom, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:4490'
		}).eachOverlay((item) => {
			const polygon: any = ol.Polygon.fromEntity(item)
			polygon.attr = attr
			polygon.setStyle({
				stroke: {
					strokeColor: 'red',
					strokeLineCap: 'round', // 设置线的两端为圆头
					strokeWidth: 1
				},
				fill: {
					fillColor: '#0F0'
				}
			})
			polygon.listen(ol.OverlayEventType.MOUSEOVER, (e) => {
				console.log('OverlayEventType鼠标移动', e)
				// polygon.setStyle({
				//     text: {
				//       text: (data)=>data?.monm,
				//     },
				//   })
				const attr = e?.target?.attr
				const pos = e?.target?.center
				const content = OverlayCfg['2'].content(attr)
				map.popup.show(pos, content)
			})
			polygon.listen(ol.OverlayEventType.MOUSEOUT, (e) => {
				console.log('OverlayEventType鼠标移出', e)
				// polygon.setStyle({
				//     text: {
				//       text: null,
				//     },
				//   })
				map.popup.hide()
			})
			//   billboard.listen(ol.OverlayEventType.CLICK ,(e)=>{
			//     console.log('OverlayEventType点击',e)
			//   })
			console.log('area', polygon.area)
			console.log('center', polygon.center)
			layer.addOverlay(polygon)
		})
		// console.log({index})
	})
	// const geojson = new ol.WktLayer('wkt-layer',geo, {
	//   dataProjection:'EPSG:4326',
	//   featureProjection:'EPSG:4490'
	// }).eachOverlay((item:any)=>{
	//   console.log({item})
	// const polygon = ol.Polygon.fromEntity(item)
	// polygon.setStyle({
	//     stroke:{
	//       strokeColor: 'red',
	//       strokeLineCap: 'round',       // 设置线的两端为圆头
	//       strokeWidth: 5
	//     },
	//     fill: {
	//       fillColor: '#0F0'
	//     },
	// })
	// console.log('polygon',polygon)
	// layer.addOverlay(polygon)
	// });

	// console.log('geojson', geojson)
	// map.addLayer(geojson)
	const data = [117.28, 31.86]
	const config = {}

	// const del = ResArry.filter((item,index)=>{
	//    if (index < 11) return item;
	// }).map((item)=>item?.stcd)
	// console.log('del',del)

	// map.popup.enable = true;
	// ResArry.forEach((item:any)=>{
	//   const pos = [item?.lgtd,item?.lttd]
	//   const billboard = new ol.Billboard(pos, {...config,id:item?.stcd});
	//   billboard.attr = item;
	//   billboard.setStyle({
	//     zIndex: 199,
	//     stroke: {
	//       strokeColor: '#0F0',
	//       strokeLineCap: 'round',       // 设置线的两端为圆头
	//       strokeWidth: 5
	//     },
	//     fill: {
	//       fillColor: '#0F0'
	//     },
	//     image: {
	//       type: 'icon',
	//       image: {
	//         imageSrc: ()=>{
	//           return `/images/layers/${item?.motype}/${item?.wlevel || 0}.png`
	//         },
	//         // size:[30,30]
	//       }
	//     },
	//     text: {
	//       textAlign: "center",
	//       textBaseline: "middle",
	//       textFont: "bold 18px 微软雅黑",
	//       text: '',
	//       textFill: {
	//         fillColor: "#00FFFF"
	//       },
	//       textStroke: "#353535",
	//       // textOffsetX:30,
	//       textOffsetY:30
	//     },
	//   })
	//
	//
	//   billboard.listen(ol.OverlayEventType.MOUSEOVER ,(e)=>{
	//     console.log('OverlayEventType鼠标移动',e)
	//     billboard.setStyle({
	//       text: {
	//         text: (data)=>data?.monm,
	//       },
	//     })
	//     const attr = e?.target?.attr;
	//     const pos = e?.target?._position;
	//     const content = OverlayCfg["1"].content(attr)
	//     map.popup.show(pos, content);
	//   })
	//   billboard.listen(ol.OverlayEventType.MOUSEOUT ,(e)=>{
	//     console.log('OverlayEventType鼠标移出',e)
	//     billboard.setStyle({
	//       text: {
	//         text: null,
	//       },
	//     })
	//     map.popup.hide();
	//   })
	//   billboard.listen(ol.OverlayEventType.CLICK ,(e)=>{
	//     console.log('OverlayEventType点击',e)
	//   })
	//   layer.addOverlay(billboard)
	// })

	// console.log('bill', billboard)
	map.addLayer(layer)
	console.log('map', layer)

	// setTimeout(()=>{
	//   del.forEach((stcd)=>{
	//     let over = layer.getOverlay(stcd);
	//     console.log('over',over)
	//     if (over){
	//       layer.removeOverlay(over)
	//     }
	//   })
	//   console.log('layer',layer)
	// },1000)
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