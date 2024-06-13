<script setup lang="ts">
import {defineProps, withDefaults} from 'vue'

const props = withDefaults(defineProps<{ text: string }>(), {
	text: ''
})
</script>

<template>
	<div class="mark-wrap">
		{{ props?.text }}
	</div>
</template>
<style lang="scss">
.mark-wrap {
	position: relative;
	background: #e4c52c;
	color: white;
	font-size: 16px;
	font-weight: bolder;
	word-break: keep-all;
	white-space: nowrap;
	font-family: 'SourceHanSansCN-Medium';
	letter-spacing: 1px;
	border-radius: 4px;
	padding: 0 6px;

	&::before {
		position: absolute;
		content: '';
		bottom: -9px;
		left: 50%;
		transform: translateX(-50%);
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid #e4c52c;
		z-index: 1;
	}
}
</style>