/***
 * 获取时间主要用于构建打包
 * @param s
 */
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const ENodeEnv = {
	PRO: ['production', true],
	DEV: ['development', false]
}
const resolve = (p) => {
	return path.resolve(dirname(fileURLToPath(import.meta.url)), p)
}

/***
 * 当前时间计算
 * @param s
 */

function addZero(s) {
	return s < 10 ? '0' + s : s
}

function getTime() {
	let now = new Date()
	let m = now.getMonth() + 1
	m = m < 10 ? '0' + m : m
	let d = now.getDate()
	d = d < 10 ? '0' + d : d
	let hour = now.getHours()
	let minute = now.getMinutes()
	let second = now.getSeconds()
	return `${now.getFullYear()}-${m}-${d} ${addZero(hour)}:${addZero(minute)}:${addZero(second)}`
}

/***
 * 打包路径
 */
const outputDir = (pro = undefined, dev = undefined) => {
	return isPro() ? pro ?? 'dist' : dev ?? 'dev'
}
/***
 * 获取环境
 */

const getEnv = () => {
	return process?.env?.NODE_ENV ?? true
}

const isPro = () => getEnv() === ENodeEnv.PRO || ENodeEnv.PRO.includes(getEnv())

const isDev = () => getEnv() === ENodeEnv.DEV || ENodeEnv.DEV.includes(getEnv())

/***
 * 解构packages.json
 * @param PackagesJson
 */
function destructionPackagesJson(packagesJson) {
	return {
		preventAssignment: true,
		exclude: 'node_modules/**',
		ENV: JSON.stringify(getEnv()),
		__VERSION__: JSON.stringify(packagesJson && packagesJson.version),
		__TIME__: JSON.stringify(getTime()),
		__AUTHOR__: JSON.stringify(packagesJson && packagesJson.author),
		__REPOSITORY__: JSON.stringify(packagesJson && packagesJson.repository),
		__HOME_PAGE__: JSON.stringify(packagesJson && packagesJson.homepage),
		__LICENSE__: JSON.stringify(packagesJson && packagesJson.license),
		__DESCRIPTION__: JSON.stringify(packagesJson && packagesJson.description)
	}
}

export { destructionPackagesJson, isDev, isPro, ENodeEnv, outputDir, getEnv, resolve, getTime }
