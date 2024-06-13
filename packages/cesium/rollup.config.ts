//@ts-ignore
import {
	babelPlugin,
	commonBasePlugins,
	isPro,
	outputDir,
	proCompressPlugins,
	replacePlugin,
	scssPlugin,
	tsPlugin
} from '@dfsj/rollup'

const NAMESPACE = 'ECCesium'
console.log('@dfsj/cesium构建...')
const input = 'src/index.js'
const entryCss = 'src/themes/index.js'
const entryTs = 'typings/index.d.ts'
const filename = 'index'
const output = outputDir?.()
const basePlugins = [
	...commonBasePlugins({ ts: false, glsl: true, scss: false }),
	...babelPlugin(),
	...replacePlugin()
]
// @ts-ignore
const devPlugins = []

// @ts-ignore
const prodPlugins = [...proCompressPlugins()]
// @ts-ignore
const plugins = [...basePlugins].concat(isPro() ? prodPlugins : devPlugins)
// @ts-ignore
const configs = [
	//暂时放在前面,放在后面导致index.js 合并为空内容
	{
		input: entryCss,
		output: {
			dir: `${output}`
		},
		plugins: [...scssPlugin()]
	},
	{
		// input:[input ,entryCss],
		input: input,
		// output: [
		// 	{
		// 		file: `${output}/${filename}.es.js`,
		// 		format: 'esm',
		// 		inlineDynamicImports: true,
		// 		exports: 'default',
		// 		globals: {
		// 			'@turf/turf': 'turf'
		// 		}
		// 	},
		// 	{
		// 		file: `${output}/${filename}.cjs.js`,
		// 		format: 'cjs',
		// 		inlineDynamicImports: true,
		// 		exports: 'default',
		// 		globals: {
		// 			'@turf/turf': 'turf'
		// 		}
		// 	},
		// 	{
		// 		name: NAMESPACE,
		// 		file: `${output}/${filename}.js`,
		// 		inlineDynamicImports: true,
		// 		exports: 'default',
		// 		format: 'umd',
		// 		globals: {
		// 			'@turf/turf': 'turf'
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
		external: ['@turf/turf', '@cesium/engine', 'echarts', 'supercluster']
	},
	{
		input: entryTs,
		output: {
			file: `${output}/${filename}.d.ts`,
			format: 'esm'
		},
		plugins: [...tsPlugin()],
		external: []
	}
]
export default configs
