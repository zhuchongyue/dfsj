//@ts-ignore
import {babelPlugin, commonBasePlugins, isPro, outputDir, proCompressPlugins, replacePlugin, tsPlugin} from '@dfsj/rollup'

const NAMESPACE = 'ECEcharts'
console.log('@dfsj/echart包构建')
const input = 'src/index.ts'
const entryCss = 'src/themes/index.ts'
const filename = 'index'
const output = outputDir?.()
console.log('output', output)
const basePlugins = [
	// 打包插件
	//@ts-ignore
	...commonBasePlugins({ scss: true, ts: true, multi: false }),
	// ...babelPlugin(),
	...replacePlugin(),
]
// @ts-ignore
const devPlugins = []
// @ts-ignore
const prodPlugins = [...proCompressPlugins()]
// @ts-ignore
const plugins = [...basePlugins].concat(isPro() ? prodPlugins : devPlugins)
// @ts-ignore
const configs = [
	{
		input: input,
		// output: [
		// 	{
		// 		file: `${output}/${filename}.es.js`,
		// 		// dir:`${output}`,
		// 		format: 'esm',
		// 		inlineDynamicImports: true,
		// 		globals: {
		// 			vue: 'Vue',
		// 			echarts: 'echarts',
		// 			dayjs: 'dayjs',
		// 			'numeral ': 'numeral'
		// 			// '@dfsj/utils': 'ECUtils'
		// 		}
		// 	},
		// 	{
		// 		file: `${output}/${filename}.cjs.js`,
		// 		format: 'cjs',
		// 		inlineDynamicImports: true,
		// 		globals: {
		// 			vue: 'Vue',
		// 			echarts: 'echarts',
		// 			dayjs: 'dayjs',
		// 			'numeral ': 'numeral'
		// 			// '@dfsj/utils': 'ECUtils'
		// 		}
		// 	},
		// 	{
		// 		name: NAMESPACE,
		// 		file: `${output}/${filename}.js`,
		// 		inlineDynamicImports: true,
		// 		format: 'umd',
		// 		globals: {
		// 			vue: 'Vue',
		// 			echarts: 'echarts',
		// 			dayjs: 'dayjs',
		// 			'numeral ': 'numeral'
		// 			// '@dfsj/utils': 'ECUtils'
		// 		}
		// 	}
		// ],
		output: {
			dir: './dist', // 输出目录
			format: 'esm', // 输出格式为 ES 模块
			preserveModules: true, // 保留模块结构
			preserveModulesRoot: 'src',// 指定模块根目录
			exports: 'named',
		},
		plugins: plugins,
		external: [
			'vue',
			'echarts',
			'dayjs',
			'numeral',
			'@vueuse/core',
			'xlsx',
			'element-plus',
			'@dfsj/utils'
		]
	},
	{
		input: entryCss,
		// output: [
		// 	{
		// 		file: `${output}/${filename}.es.js`,
		// 		// dir:`${output}`,
		// 		format: 'esm',
		// 		inlineDynamicImports: true,
		// 		globals: {
		// 			vue: 'Vue',
		// 			echarts: 'echarts',
		// 			dayjs: 'dayjs',
		// 			'numeral ': 'numeral'
		// 			// '@dfsj/utils': 'ECUtils'
		// 		}
		// 	},
		// 	{
		// 		file: `${output}/${filename}.cjs.js`,
		// 		format: 'cjs',
		// 		inlineDynamicImports: true,
		// 		globals: {
		// 			vue: 'Vue',
		// 			echarts: 'echarts',
		// 			dayjs: 'dayjs',
		// 			'numeral ': 'numeral'
		// 			// '@dfsj/utils': 'ECUtils'
		// 		}
		// 	},
		// 	{
		// 		name: NAMESPACE,
		// 		file: `${output}/${filename}.js`,
		// 		inlineDynamicImports: true,
		// 		format: 'umd',
		// 		globals: {
		// 			vue: 'Vue',
		// 			echarts: 'echarts',
		// 			dayjs: 'dayjs',
		// 			'numeral ': 'numeral'
		// 			// '@dfsj/utils': 'ECUtils'
		// 		}
		// 	}
		// ],
		output: {
			dir: './dist', // 输出目录
			format: 'esm', // 输出格式为 ES 模块
			preserveModules: true, // 保留模块结构
			preserveModulesRoot: 'src',// 指定模块根目录
			exports: 'named',
		},
		plugins: plugins,
	},
	{
		input,
		output: {
			file: `${output}/${filename}.d.ts`,
			format: 'esm'
		},
		plugins: [...tsPlugin()],
		external: [
			// 'vue',
			// 'echarts',
			// 'dayjs',
			// 'numeral',
			// '@vueuse/core'
			// '@dfsj/utils'
		]
	}
]
export default configs
