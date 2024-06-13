//@ts-ignore
import {babelPlugin, commonBasePlugins, isPro, outputDir, proCompressPlugins, replacePlugin, tsPlugin} from '@dfsj/rollup'

const NAMESPACE = 'ECHooks'
const input = 'src/index.ts'
const output = outputDir?.()
const filename = 'index'
const basePlugins = [
    // 打包插件
    ...commonBasePlugins(),
    // ...babelPlugin(),
    ...replacePlugin()
]
// @ts-ignore
const devPlugins = []
const prodPlugins = [...proCompressPlugins()]
// @ts-ignore
const plugins = [...basePlugins].concat(isPro() ? prodPlugins : devPlugins)
const configs = [
    {
        input,
        // output: [
        // 	{
        // 		file: `${output}/${filename}.es.js`,
        // 		format: 'esm',
        // 		globals: {
        // 			// vue: 'Vue',
        // 			events: 'EventEmitter',
        // 			fs: 'FileSystem'
        // 		}
        // 	},
        // 	{
        // 		file: `${output}/${filename}.cjs.js`,
        // 		format: 'cjs',
        // 		globals: {
        // 			// vue: 'Vue',
        // 			events: 'EventEmitter',
        // 			fs: 'FileSystem'
        // 		}
        // 	},
        // 	{
        // 		name: NAMESPACE,
        // 		file: `${output}/${filename}.js`,
        // 		format: 'umd',
        // 		globals: {
        // 			// vue: 'Vue',
        // 			events: 'EventEmitter',
        // 			fs: 'FileSystem'
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
            'vue-router',
            'dayjs',
            '@dfsj/utils'
        ],
        globals: {
            vue: 'Vue'
        }
    },
    {
    	input,
    	output: {
    		file: `${output}/${filename}.d.ts`,
    		format: 'es'
    	},
    	plugins: [
    		// ...commonBasePlugins(),
    		...tsPlugin()],
    	external: [
    		// 'vue'
    		// '@dfsj/utils'
    	]
    }
]
export default configs
