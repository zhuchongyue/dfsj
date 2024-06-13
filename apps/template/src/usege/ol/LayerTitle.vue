<script lang="ts" setup>
/***
 * 图层标题组件
 */
interface IProps {
	title: string | null
	long: string | null
}

const props = withDefaults(defineProps<IProps>(), {
	long: null,
	title: null
})
</script>

<template>
	<Transition
		enter-active-class="animate__animated animate__fadeInUp"
		leave-active-class="animate__animated animate__fadeOutDown"
		appear
	>
		<div class="component layer-title" v-if="!!props?.title">
			<div class="content">
				<div class="main" :data-content="props?.title">{{ props?.title }}</div>
				<div class="subs" v-if="!!props?.long" :data-content="props?.long">{{ props?.long }}</div>
			</div>
		</div>
	</Transition>
</template>
<style lang="scss">
.component.layer-title {
	position: fixed;
	height: 0;
	left: 0;
	right: 0;
	top: 10px;
	//width: 100vw;
	z-index: 10;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	pointer-events: none;
	font-family: SourceHanSansCN-Bold;
	background: linear-gradient(
		271deg,
		rgba(67, 143, 173, 0.18) 0%,
		rgba(76, 168, 203, 0.68) 49%,
		rgba(65, 131, 181, 0.16) 100%
	);

	.content {
		position: relative;
		justify-content: center;
		padding: 2px 10px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		flex-direction: column;
		min-width: 600px;
		box-shadow: 0 0 10px 3px #4048bf03;
		//background: #ffffff44;
		//background: linear-gradient(271deg, rgba(67, 143, 173, 0.18) 0%, rgba(76, 168, 203, 0.68) 49%, rgba(65, 131, 181, 0.16) 100%);
	}

	.main {
		font-size: 40px;
		line-height: 40px;
		letter-spacing: 2px;
		/* 主色/primary7 */
		color: #1d53d6;
		//text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.37);
		//-webkit-text-stroke-width: 1px;
		//-webkit-text-stroke-color: #fff;
		text-shadow: rgb(255, 255, 255) 0px 0px 0.625rem;
		-webkit-text-stroke: 5px rgb(255, 255, 255);

		&:before {
			content: attr(data-content);
			position: absolute;
			color: #1d53d6;
			-webkit-text-stroke: 0px rgb(255, 255, 255);
			text-shadow: 0px 0px 10px #ffffff;
			text-stroke: 8px #ffffff;
			//-webkit-text-stroke: 8px #ffffff;
		}
	}

	.subs {
		margin-top: 16px;
		font-size: 20px;
		line-height: 20px;
		letter-spacing: 1px;
		text-shadow: rgb(255, 255, 255) 0px 0px 0.625rem;
		-webkit-text-stroke: 2px rgb(255, 255, 255);
		/* 中性色/neutral11 */
		color: #383838;

		&:before {
			content: attr(data-content);
			position: absolute;
			color: #383838;
			-webkit-text-stroke: 0px rgb(255, 255, 255);
		}
	}
}
</style>
