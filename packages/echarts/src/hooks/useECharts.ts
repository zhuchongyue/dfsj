import type {EChartsOption} from 'echarts';
import type {Ref} from 'vue';
import {computed, nextTick, ref, unref, watch} from 'vue';
import {tryOnUnmounted, useDebounceFn} from '@vueuse/core';
import {useTimeoutFn} from './useTimeout';
import {useEventListener} from './useEventListener';
import {useBreakpoint} from './useBreakpoint';
import echarts from '../lib/echarts';
import elementResizeDetectorMaker from "element-resize-detector";
/**
 * echarts 插件拓展
 * */
import "../plugins"
import {useEChartsThemes} from "../themes/useEChartsThemes";
export  function useECharts(elRef: Ref<HTMLElement>, theme?: string ) {
	const {setTheme, loadTheme, theme: globalTheme} = useEChartsThemes();
	let erd = elementResizeDetectorMaker();
	const echartsTheme = computed(() => {
		return theme ?? globalTheme.value;
	});
	let chartInstance: echarts.ECharts | null = null;
	let resizeFn: Fn = resize;
	const cacheOptions = ref({}) as Ref<EChartsOption>;
	let removeResizeFn: Fn = () => {
	};
	resizeFn = useDebounceFn(resize, 200);
	const getOptions = computed(() => {
		if (echartsTheme.value !== 'dark') {
			return cacheOptions.value as EChartsOption;
		}
		return {
			backgroundColor: 'transparent',
			...cacheOptions.value,
		} as EChartsOption;
	});

	function initCharts(t:string) {
		const el = unref(elRef);
		if (!el || !unref(el)) {
			return;
		}
		console.log('初始化',t)
		chartInstance = echarts.init(el, t);
		//窗口
		const {removeEvent} = useEventListener({
			el: window,
			name: 'resize',
			listener: resizeFn,
		});

		bindObserver()
		removeResizeFn = removeEvent;
		const {widthRef, screenEnum} = useBreakpoint();
		if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
			useTimeoutFn(() => {
				resizeFn();
			}, 30);
		}
	}

	function setOptions(options: EChartsOption, clear = true) {
		cacheOptions.value = options;
		if (unref(elRef)?.offsetHeight === 0) {
			useTimeoutFn(() => {
				setOptions(unref(getOptions));
			}, 30);
			return;
		}
		nextTick(() => {
			useTimeoutFn(() => {
				if (!chartInstance) {
					initCharts(echartsTheme.value);

					if (!chartInstance) return;
				}
				clear && chartInstance?.clear();

				chartInstance?.setOption(unref(getOptions));
			}, 30);
		});
	}

	function resize() {
		chartInstance?.resize();
	}

	watch(
		() => echartsTheme.value,
		(theme) => {
			if (chartInstance) {
				chartInstance.dispose();
				initCharts(theme);
				setOptions(cacheOptions.value);
			}
		}
	);

	tryOnUnmounted(() => {
		if (!chartInstance) return;
		removeResizeFn();
		chartInstance.dispose();
		chartInstance = null;
		unBindObserver()
		erd = null
	});

	function getInstance(): echarts.ECharts | null {
		if (!chartInstance) {
			initCharts(echartsTheme.value);
		}
		return chartInstance;
	}

	function bindObserver() {
		try {
			erd?.listenTo?.(elRef.value, observerHandle)
		}catch (e) {
			console.log({e})
		}
	}

	function unBindObserver() {
		try {
			erd?.removeListener?.(elRef.value, observerHandle)
		}catch (e) {
			console.log({e})
		}
	}
	let prevWidth, prevHeight;
	function observerHandle(target) {
		const style = getComputedStyle(target);
		const currWidth = style.width, currHeight = style.height;
		if(prevHeight == currHeight && currWidth == prevWidth){
			return
		}else {
			prevWidth = currWidth;
			prevHeight = currHeight;
		}
		nextTick(() => {
			setTimeout(resize, 100)
		})
	}


	return {
		setOptions,
		resize,
		echarts,
		getInstance,
		container: (elRef)
	};
}
