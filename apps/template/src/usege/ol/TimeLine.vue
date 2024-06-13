<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {NodeAxis} from '/src/components/TimeLine/types/NodeAxis'
import NodeAxisComp from '/src/components/TimeLine/NodeAxisComp'
import {MultiNode} from '/src/components/TimeLine/mock/mock'
import {TimeModes} from '/src/components/TimeLine/enum'
import {useVisual} from '/src/components/TimeLine/hooks/useVisual'
import CanvasRender from '/src/components/TimeLine/CanvasRender'
import Node from '/src/components/TimeLine/Node'
import TimerPlayer from '/src/components/TimeLine/TimerPlayer'
// import EcOl from "../../../packages/ol/src"
// import {CacheUtils} from "/@/utils/cacheUtils";
import emitter from '/src/utils/mitt'
import {EMittLayerTitle} from '/src/enums/mittTypeEnum'
import {Icon} from '@dfsj/components'

const modalCfg = <NodeAxis.NodeOptions>{
	height: 40,
	width: '40%',
	track: { top: '20%' },
	label: { top: '55%' }
}

const COLORS = {
	RESET: '#ff0000',
	ABLE: '#1E88E5',
	DISABLE: '#DCDCDC'
}
const index = ref(0)
const TimePlayer = MultiNode.data
let chips = []
let node, canvasRender, timerPlayer
/** canvas 配置类*/
// model = new NodeModel(modalCfg)
node = new Node(modalCfg)
console.log('canvas 配置类', node)
/** renderer 渲染类*/
// renderer = new CanvasNodeRender(model)
canvasRender = new CanvasRender(node)
console.log('canvas 渲染类', canvasRender)
/** 播放控制类*/
// player = new TimerNodePlayer(model, renderer)
timerPlayer = new TimerPlayer(null, canvasRender)

console.log('播放控制类', timerPlayer)
const {
	togglePlay,
	onReset,
	onForward,
	onBackward,
	onTimeDaily,
	onTimeChoose,
	onTimeInterval,
	onTimeStatistic,
	onChangeInstance,
	buttons,
	multiContent,
	current,
	playing,
	onRenderFrame,
	controls,
	timeMode
} = useVisual(timerPlayer)
const currentTab = ref(current.value.id)

watch(
	() => buttons.value,
	(value) => {
		// console.log({value})
	},
	{ deep: true }
)

// console.log({EcOl})
function onRenderFrameHandle(frame) {
	const callback = (cur, pvd) => {
		emitter.emit(EMittLayerTitle.SHOW, {
			title: pvd.format(frame, 'title'),
			long: pvd.format(frame, 'long')
		})
	}
	onRenderFrame(frame, callback)
}

// const current: Ref<VisualContent> = shallowRef(null)
// const provider: Ref<LayerProvider> = shallowRef(null)
// const timeMode: Ref = ref(TimeModes.DAILY)

onMounted(() => {})

const iconSize = 30
// const playing = ref(false)
const toggleName = computed(() =>
	playing.value ? 'ic:round-pause-circle' : 'material-symbols:play-circle-rounded'
)

watch(
	() => multiContent.value,
	(value, oldValue, onCleanup) => {
		// console.log('-----', multiContent)
		multiContent.value.forEach((item) => {
			// console.log('multiContent...', item)
		})
	},
	{
		deep: true
	}
)

function onTabClick(tab, ev) {
	console.log({ tab, ev })
	const id = tab.props.name

	console.log('multiContent.value', multiContent.value)

	let content = multiContent.value.find((e) => e.id === id)
	if (content.id === current.value.id) return
	// current.value = content;
	onChangeInstance(content)
}
</script>

<template>
	<div v-drag="true" class="node-axis-comp-wrap">
		<div class="node-axis-header">
			<!-- 多实例-->
			<div class="player-instance">
				<el-tabs v-model="current.id" class="instance-tabs" @tab-click="onTabClick">
					<el-tab-pane
						v-for="item in multiContent"
						:key="item.id"
						:label="item.label"
						:name="item.id"
					/>
				</el-tabs>
			</div>

			<!--时间控制按钮-->
			<div class="player-control">
				<Icon
					icon="bx:reset"
					:color="!controls ? COLORS.DISABLE : COLORS.RESET"
					:class="!controls ? 'cursor-not-allowed' : 'cursor-pointer'"
					:size="iconSize"
					@click="onReset"
				/>

				<Icon
					:class="!controls || !controls.prev ? 'cursor-not-allowed' : 'cursor-pointer'"
					:color="!controls || !controls.prev ? COLORS.DISABLE : COLORS.ABLE"
					icon="mingcute:skip-previous-fill"
					:size="iconSize"
					@click="onBackward"
				/>

				<Icon
					:class="!controls || !controls.play ? 'cursor-not-allowed' : 'cursor-pointer'"
					:color="!controls || !controls.play ? COLORS.DISABLE : COLORS.ABLE"
					:icon="toggleName"
					:size="iconSize"
					@click="togglePlay"
				/>

				<Icon
					:class="!controls || !controls.next ? 'cursor-not-allowed' : 'cursor-pointer'"
					:color="!controls || !controls.next ? COLORS.DISABLE : COLORS.ABLE"
					icon="mingcute:skip-forward-fill"
					:size="iconSize"
					@click="onForward"
				/>
			</div>
			<div class="player-custom flex justify-end items-center">
				<span
					class="timed"
					:class="{
						active: timeMode === TimeModes.DAILY,
						hidden: !buttons || !buttons?.daily
					}"
					@click="onTimeDaily"
				>
					日
				</span>
				<span
					class="timed"
					:class="{
						active: timeMode === TimeModes.INTERVAL,
						hidden: !buttons || !buttons?.range
					}"
					@click="onTimeInterval"
				>
					时段
				</span>
				<span
					class="timed"
					:class="{
						active: timeMode === TimeModes.STATISTIC,
						hidden: !buttons || !buttons?.statistic
					}"
				>
					<!--      <q-menu v-model="statistics">-->
					<!--        <DatePicker-->
					<!--            v-model="current.times"-->
					<!--            precision="datetime"-->
					<!--            range-->
					<!--            @update:model-value="onTimeStatistic"-->
					<!--            @cancel="statistics = false"></DatePicker>-->
					<!--      </q-menu>-->
					统计
				</span>
				<Icon
					class="cursor-pointer"
					icon="mdi:clock"
					:size="24"
					:disable="timeMode !== TimeModes.DAILY"
					@click="onReset"
				/>

				<!--      <q-menu v-model="dates">-->
				<!--        <DatePicker-->
				<!--            v-model="current.time"-->
				<!--            :immediate="false"-->
				<!--            precision="datetime"-->
				<!--            @cancel="dates = false"-->
				<!--            @update:model-value="onTimeChoose"></DatePicker>-->
				<!--      </q-menu>-->
			</div>
		</div>
		<NodeAxisComp :render="canvasRender" @update:frame="onRenderFrameHandle" />
	</div>
</template>
<style lang="scss">
$TAB_HEIGHT: 30px;
.instance-tabs {
	--el-tabs-header-height: 30px;
	max-width: 300px;
	cursor: pointer;
	height: inherit;

	.el-tabs__nav-next,
	.el-tabs__nav-prev {
		//line-height: var(--el-tabs-header-height);
		line-height: unset;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
		//padding-left: 0;
	}

	.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
		//padding-right: 0;
	}

	.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
		//padding-left: 0;
	}

	.el-tabs__active-bar,
	.el-tabs__nav-wrap::after {
		height: 0 !important;
	}

	.el-tabs__item {
		padding-left: 0 !important;
		padding-right: 0 !important;
		background: #f2f2f2;
		//color: #ffffff;
		margin-right: 5px;
		//border-radius: 10px;
	}

	.el-tabs__item.is-active {
		color: #ffffff;
		background: var(--el-color-primary);
	}

	.el-tabs__header {
		padding: 0;
		margin: 0;
	}
}

.node-axis-comp-wrap {
	background: #ffffff;
	//width: 70%;
	position: fixed;
	bottom: 30px;
	left: 50%;
	transform: translateX(-50%);
	box-shadow: rgb(0 0 0 / 20%) 1px 2px 10px;
	z-index: 99;

	.node-axis-header {
		height: 50px;
		width: inherit;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;

		.player-custom {
			position: absolute;
			right: 0;
			top: 0;
			//width: 100%;
			height: 100%;
			column-gap: 15px;

			span {
				font-size: 12px;
				color: #027be3;
				cursor: pointer;

				&.active {
					color: #9c27b0;
					//font-weight: bolder;
				}
			}
		}

		.player-instance {
			position: absolute;
			left: 0;
			top: 0;
			//width: 100%;
			height: 30px;
			column-gap: 15px;
		}

		.player-control {
			z-index: 10;
		}
	}
}

.node-axis--overlay {
	position: absolute;
	display: block;
	border-style: solid;
	white-space: nowrap;
	z-index: 9999999;
	box-shadow: rgb(0 0 0 / 20%) 1px 2px 10px;
	transition:
		opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s,
		visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s,
		transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
	background-color: rgb(0, 0, 0, 0.2);
	border-width: 1px;
	border-radius: 4px;
	color: rgb(102, 102, 102);
	font: 14px / 21px 'Microsoft YaHei';
	padding: 10px;
	top: 0px;
	left: 0px;
	//transform: translate3d(191px, 328px, 0px);
	border-color: rgba(255, 255, 255, 0.1);
	pointer-events: none;
	//visibility: hidden;
	//opacity: 1;
}
</style>