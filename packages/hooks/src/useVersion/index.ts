import dayjs from 'dayjs'
import schedule from 'node-schedule'
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue'

const SCHEDULE_CONFIG = {
	ID: 'VERSION_AUTO_CHECK',
	RULE: '*/2 * * * * ',
	FILENAME: '_app.config.js'
}
/***
 * 自动检查前端页面是否更新  通过打包时候注入的版本号和时间戳对比
 */
let lastScript = []
let notification = undefined
let job = undefined
const website = `/`

export interface IUseVersionOptions {
	fileName: string
	taskId: string
	cron: string
}

export default function useVersion(options?: Partial<IUseVersionOptions>) {
	const config = reactive({
		fileName: options?.fileName ?? SCHEDULE_CONFIG.FILENAME,
		taskId: options?.taskId ?? SCHEDULE_CONFIG.ID,
		cron: options?.cron ?? SCHEDULE_CONFIG.RULE
	})
	const need = ref(false)
	const buildTime = ref(null)
	const version = ref(null)
	/***
	 * 加入时间 防止缓存
	 * @param url
	 */
	const joinTimestamp = (url: string): string => {
		const now = new Date().getTime()
		return `${url}?_t=${now}`
	}
	/**
	 * 匹配script标签
	 */
	const matchScript = (content) => {
		let js_search_arr = []
		const js_reg = /<script(?:.*?)src=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/script>)*/gm
		let match_js
		while ((match_js = js_reg.exec(content))) {
			const obj = { match: match_js[0], group: match_js[1] }
			js_search_arr.push(obj)
		}
		const jsStrings: Array<string> = js_search_arr.map((item: any) => item?.group)
		contrast(jsStrings)
	}
	/***
	 * 获取远程前端页面
	 */
	const fetchHtml = async () => {
		const url = joinTimestamp(website)
		const response = await fetch(url, {
			method: 'get'
		})
		return response.text()
	}
	/**
	 * 对比
	 * */
	const contrast = (currentScript: string[] = []) => {
		// if (!lastScript || !lastScript.length) return;
		const result =
			currentScript.length === lastScript.length &&
			currentScript.every((a) => lastScript.some((b) => a === b)) &&
			lastScript.every((_b) => currentScript.some((_a) => _a === _b))
		console.log({ result, lastScript, currentScript })
		if (result) {
			need.value = false
			return
		}
		if (!result && lastScript.length) {
			//查找app主js
			const mainJs = currentScript.find((item: string) => item.includes(config.fileName))
			if (!mainJs) return
			const [other, t] = mainJs.split('-')
			const _buildTime = dayjs(+t).format('YY-MM-DD HH:mm:ss')
			const v_reg = /[\d._]+/gi
			const v_info = mainJs.match(v_reg)
			const _version = v_info[3] ?? '-.-.-'
			version.value = _version
			buildTime.value = _buildTime
			need.value = true
		}
		lastScript = currentScript
	}

	/** 任务*/
	const handler = () => {
		fetchHtml()
			.then((html) => {
				console.log('请求主页', typeof html)
				if (html && typeof html == 'string') matchScript(html)
			})
			.catch(() => {})
	}
	const handlerCancel = () => {
		if (job) {
			schedule.scheduledJobs[config.taskId].cancel()
			schedule.gracefulShutdown()
			job = undefined
		}
	}

	onMounted(() => {
		handler()
		handlerCancel()
		job = schedule.scheduleJob(config.taskId, config.cron, handler)
	})
	onBeforeUnmount(() => {
		handlerCancel()
	})

	return {
		fetchHtml,
		config,
		need,
		version,
		buildTime
	}
}
