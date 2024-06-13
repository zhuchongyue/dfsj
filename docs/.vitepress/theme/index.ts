// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css';
import './element-plus.css';
import { AntDesignContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'
import 'uno.css'
import "@dfsj/components/dist/index.min.css"
import "@dfsj/echarts/dist/index.min.css"
import "element-plus/dist/index.css";
import ElementPlus from "element-plus"
// @ts-ignore
export default {
	extends: Theme,
	Layout: () => {
		return h(Theme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		})
	},
	enhanceApp({ app, router, siteData }) {
		// ...
		app.component('demo-preview', AntDesignContainer)
		app.use(ElementPlus)
	}
}
