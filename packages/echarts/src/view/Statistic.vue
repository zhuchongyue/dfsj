<script lang="ts" setup>
import {defineProps, onUnmounted, ref, toRaw, toRefs, unref, watch, withDefaults} from 'vue'
import {ECharts} from 'echarts'
import {statistics as s} from '../utils/statistics'

const props = withDefaults(
	defineProps<{
		value: object
		chart: ECharts
		visible: boolean // 可见性（默认隐藏）
		statistical: number // 统计频率
		collect: Function
	}>(),
	{
		value: null,
		chart: null,
		visible: false,
		statistical: 0,
		collect: s
	}
)
let timer
const content = ref(null)
const { chart, visible, value } = toRefs(props)
const statistics = () => {
  console.log('统计',)
	timer = clearTimeout(timer)
	timer = setTimeout(() => {
		content.value = props.collect(toRaw(unref(chart)), toRaw(unref(value)))
	}, props.statistical)
}

watch(() => visible.value, (value)=>{
  statistics()
  if(value)bindEvent()
})

watch(
	() => chart.value,
	() => {
		bindEvent()
	}
)
onUnmounted(()=>{
  bindEvent()
})

onUnmounted(() => {
	unBindEvent()
})

function bindEvent() {
	unBindEvent()
	if (chart.value) {
		chart.value?.on('datazoom', statistics)
		chart.value?.on('legendselectchanged', statistics)
	}
}

function unBindEvent() {
	console.log(' props?.chart', chart.value)
	if (chart.value) {
		chart.value?.off('datazoom', statistics)
		chart.value?.off('legendselectchanged', statistics)
	}
}
</script>

<template>
	<div class="assistant statistics">
		<div v-html="content"></div>
	</div>
</template>