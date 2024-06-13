import {ref} from 'vue'
import themes from './themes'
import echarts from '../lib/echarts';
const theme = ref('default');
export function useEChartsThemes() {
	/**
	 * 注册自定义的主题
	 */
	const registerTheme = (name , themeJSON)=>{
		if(!name || !themeJSON) return null;
		echarts.registerTheme(name, themeJSON);
	}
	/**
	 * 获取所有的主题
	 */
	const getAllThemes = () => {
		return Object.keys(themes)
	}
	const setTheme = (t: string) => {
		theme.value = t
	}
	const loadTheme = (ts:[]) => {
		ts.forEach((t)=>{
			if (!checkTheme(theme.value)) {
				console.log('没有这个默认主题')
				return
			};
			//@ts-ignore
			themes?.[t]?.()
		})
	}
	const checkTheme = (t: string) => {
		return !!getAllThemes().includes(t)
	}
	return {
		theme,
		setTheme,
		loadTheme,
		getAllThemes,
		checkTheme,
		registerTheme
	}
}
