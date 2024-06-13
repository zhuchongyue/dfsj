<script lang="ts" setup>
import {computed, defineProps, toRefs, unref, withDefaults} from 'vue'

const props = withDefaults(
	defineProps<{
		offset: object
		hidden: boolean
		content: any
	}>(),
	{
		offset: () => ({ x: 0, y: 0 }),
		hidden: false,
		content: ''
	}
)

const html = computed(() => {
	return unref(props.content)
})
const { offset } = toRefs(props)
</script>

<template>
	<article class="tooltip custom" :style="{ left: offset?.x + 'px', top: offset?.y + 'px' }">
		<div v-html="html"></div>
	</article>
</template>