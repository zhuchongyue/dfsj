import {commonBasePlugins, isPro, outputDir, proCompressPlugins, replacePlugin,tsPlugin} from '@dfsj/rollup'

const input = 'src/index.ts'
const output = outputDir?.()
const filename = 'index'
const NAMESPACE = 'ECUtils'
const basePlugins = [
    // 打包插件
    ...commonBasePlugins(),
    // ...babelPlugin(),
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
        // output: [
        // 	{
        // 		file: `${output}/${filename}.es.js`,
        // 		format: 'esm',
        // 		globals: {
        // 			vue: 'Vue'
        // 		}
        // 	},
        // 	{
        // 		file: `${output}/${filename}.cjs.js`,
        // 		format: 'cjs',
        // 		globals: {
        // 			vue: 'Vue'
        // 		}
        // 	},
        // 	{
        // 		name: NAMESPACE,
        // 		file: `${output}/${filename}.js`,
        // 		format: 'umd',
        // 		globals: {
        // 			vue: 'Vue'
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
        external: ['vue', 'vue-router', 'ol', 'localforage', 'node-schedule'],
		globals: {
			vue: 'Vue'
		}
    },
    {
    	input,
    	output: {
    		file: `${output}/${filename}.d.ts`,
    		format: 'esm'
    	},
    	plugins: [...tsPlugin()],
    	// external: ['vue', 'ol']
    }
]
export default configs
