import {commonBasePlugins, isPro, outputDir, proCompressPlugins,tsPlugin, replacePlugin} from '@dfsj/rollup'

const NAMESPACE = 'ECGuest'
const input = 'src/index.ts'
const output = outputDir?.()
const filename = 'index'
const basePlugins = [
	// 打包插件
	...commonBasePlugins(),
	...replacePlugin()
]
// @ts-ignore
const devPlugins = []
const prodPlugins = [...proCompressPlugins()]
const plugins = [...basePlugins].concat(isPro() ? prodPlugins : devPlugins)
// @ts-ignore
const configs = [
	{
		input,
		output: [
			{
				file: `${output}/${filename}.es.js`,
				name: NAMESPACE,
				format: 'esm',
				globals: {
					vue: 'Vue',
					'vue-router': 'VueRouter',
					'@dfsj/utils': 'ECUtils'
				}
			},
			{
				file: `${output}/${filename}.cjs.js`,
				name: NAMESPACE,
				format: 'cjs',
				globals: {
					vue: 'Vue',
					'vue-router': 'VueRouter',
					'@dfsj/utils': 'ECUtils'
				}
			},
			{
				name: NAMESPACE,
				file: `${output}/${filename}.js`,
				format: 'umd',
				globals: {
					vue: 'Vue',
					'vue-router': 'VueRouter',
					'@dfsj/utils': 'ECUtils'
				}
			}
		],
		plugins: plugins,
		external: ['vue', 'vue-router', '@dfsj/utils']
	},
	{
		input,
		output: {
			file: `${output}/${filename}.d.ts`,
			name: NAMESPACE,
			format: 'esm'
		},
		plugins: [...tsPlugin()],
		external: ['vue', '@dfsj/utils']
	}
]
export default configs
