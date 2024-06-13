<template>
	<!--  {{ base.length }}-->
	<!--  <div>-->
	<!--    表格数据-->
	<!--   <div  style="position: fixed;right: 0;top: 0;z-index: 10">-->
	<!--     <el-table-->
	<!--         size="small"-->
	<!--         :data="typhoonDataSource" style="width:700px" >-->
	<!--       <el-table-column label="时间" width="150px" prop="time" />-->
	<!--       <el-table-column label="移速（km/h）" prop="move" />-->
	<!--       <el-table-column label="气压(百帕)" prop="pressure" />-->
	<!--       <el-table-column label="风力(级)" prop="power" />-->
	<!--       <el-table-column label="风速(m/s)" prop="wind" />-->
	<!--       <el-table-column label="移向" prop="trend" />-->
	<!--       <el-table-column label="强度" prop="strong" />-->
	<!--       <el-table-column label="操作" align="right">-->
	<!--         <template #default="scope">-->
	<!--           <el-tag type="primary" class="cursor-pointer" @click="trendImpact(scope?.row)">历史数据</el-tag>-->
	<!--         </template>-->
	<!--       </el-table-column>-->
	<!--     </el-table>-->
	<!--   </div>-->

	<!--  </div>-->

	<!--  <div class="layer-manage">-->
	<!--    <div v-for="(item , index) in base">-->
	<!--      <div @click="()=>handleChange(item)">-->
	<!--        <img width="70" height="30" :src="item.thumbnail" alt="">-->
	<!--      </div>-->
	<!--    </div>-->
	<!--  </div>-->
	<div id="ec-ol-map-container"> </div>
</template>

<script setup lang="ts">
import ol from '@dfsj/ol'
import {OlBaseMap} from '/src/usege/ol/config/olBaseMap'
import {computed, onMounted, ref} from 'vue'
import OverlayCfg from '/src/usege/ol/config/overlay'
import Weathers from '../data/wktWeather.json'
//台风数据
import TyphoonJson from '../data/typhoon.taili.json'
import TyphoonJsonDoksuri from '../data/typhoon.doksuri.json'
import {GisSymbolKey, setGis} from '/src/core/GisCache.ts'

console.log('&&****&&&&这是库的export方法')

const WeatherArray = Weathers.data

const TAI_LI = TyphoonJson.data

const Doksuri = TyphoonJsonDoksuri.data
const typhoonDataSource = ref([])
const base = computed(() => OlBaseMap.baseLayers)
let map: any = null

const typhoonChannelMap = new Map()

function trendImpact(typhoonNode: any) {
	const doksuri = typhoonChannelMap.get('doksuri')
	doksuri.active?.(typhoonNode?.time)
	console.log({
		typhoonNode,
		doksuri
	})
}

onMounted(() => {
	map = new ol.Map('ec-ol-map-container', OlBaseMap)

	setGis(GisSymbolKey.default, map)
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

	// console.log('geojson', geojson)
	// map.addLayer(geojson)
	const data = [117.28, 31.86]
	const config = {}

	// return
	const typhoon = new ol.Typhoon(map)

	//泰利
	// const id = TAI_LI.ident;
	// const taili= new ol.TyphoonChannel(id)
	// typhoon.addChannel(taili)
	// taili.update(TAI_LI)

	// Doksuri
	const doksuri = new ol.TyphoonChannel(Doksuri.ident)
	typhoon.addChannel(doksuri)
	doksuri.update(Doksuri)
	//
	// typhoonChannelMap.set('doksuri' , doksuri)
	// console.log('doksuri',doksuri)

	// typhoonDataSource.value = doksuri?.data?.locations ?? []

	console.log({ typhoon })
	// const del = ResArry.filter((item,index)=>{
	//    if (index < 11) return item;
	// }).map((item)=>item?.stcd)
	// console.log('del',del)

	// map.popup.enable = true;
	// ResArry.forEach((item:any)=>{
	//   const pos = [item?.lgtd,item?.lttd]
	const billboard = new ol.Circle(data, { ...config, radius: 2000 })
	// billboard.attr = item;
	console.log({ billboard })
	billboard.setStyle({
		zIndex: 199,
		stroke: {
			strokeColor: '#0F0',
			strokeLineCap: 'round', // 设置线的两端为圆头
			strokeWidth: 5
		},
		fill: {
			fillColor: '#0F0'
		}
		// image: {
		//   type: 'icon',
		//   image: {
		//     imageSrc: ()=>{
		//       return `/images/layers/${item?.motype}/${item?.wlevel || 0}.png`
		//     },
		//     // size:[30,30]
		//   }
		// },
		// text: {
		//   textAlign: "center",
		//   textBaseline: "middle",
		//   textFont: "bold 18px 微软雅黑",
		//   text: '',
		//   textFill: {
		//     fillColor: "#00FFFF"
		//   },
		//   textStroke: "#353535",
		//   // textOffsetX:30,
		//   textOffsetY:30
		// },
	})

	billboard.listen(ol.OverlayEventType.MOUSEOVER, (e) => {
		console.log('OverlayEventType鼠标移动', e)
		return
		billboard.setStyle({
			text: {
				text: (data) => data?.monm
			}
		})
		const attr = e?.target?.attr
		const pos = e?.target?._position
		const content = OverlayCfg['1'].content(attr)
		map.popup.show(pos, content)
	})
	billboard.listen(ol.OverlayEventType.MOUSEOUT, (e) => {
		console.log('OverlayEventType鼠标移出', e)
		return
		billboard.setStyle({
			text: {
				text: null
			}
		})
		map.popup.hide()
	})
	billboard.listen(ol.OverlayEventType.CLICK, (e) => {
		console.log('OverlayEventType点击', e)
	})
	layer.addOverlay(billboard)
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
		background: transparent;
	}
}
</style>