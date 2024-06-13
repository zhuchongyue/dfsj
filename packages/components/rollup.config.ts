//@ts-ignore
import {babelPlugin, commonBasePlugins, isPro, outputDir, replacePlugin, tsPlugin,} from '@dfsj/rollup';

/**
 * 入口等一些配置
 */
const input = 'src/index.ts';
const entryCss = 'src/themes/index.ts';
const filename = 'index';
const output = outputDir?.();
const basePlugins = [
    // 打包插件
    //@ts-ignore
    ...commonBasePlugins({
        scss: true,
        ts: true,
        multi: false,
    }),
    ...replacePlugin(),
];
// @ts-ignore
const devPlugins = [];
// @ts-ignore
const prodPlugins = [
    // ...babelPlugin()
    // ...replacePlugin(packages as IPackagesJson)
];
// @ts-ignore
const plugins = [...basePlugins].concat(isPro() ? prodPlugins : devPlugins);
// @ts-ignore
const configs = [
    {
        input: input,
        // output: [
        //     {
        //         file: `${output}/${filename}.es.js`,
        //         format: 'esm',
        //         globals: {
        //             vue: 'Vue',
        //             'element-plus': 'ElementPlus',
        //         },
        //     },
        //     {
        //         file: `${output}/${filename}.cjs.js`,
        //         format: 'cjs',
        //         globals: {
        //             vue: 'Vue',
        //             'element-plus': 'ElementPlus',
        //         },
        //     },
        //     {
        //         name: 'EcComponents',
        //         file: `${output}/${filename}.js`,
        //         format: 'umd',
        //         globals: {
        //             vue: 'Vue',
        //             'element-plus': 'ElementPlus',
        //         },
        //         // plugins: [terser()],
        //     },
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
            'element-plus',
            "@dfsj/echarts",
            "@dfsj/utils"
        ],
    },
    {
        input: entryCss,
        output: {
            dir: './dist', // 输出目录
            format: 'esm', // 输出格式为 ES 模块
            preserveModules: true, // 保留模块结构
            preserveModulesRoot: 'src',// 指定模块根目录
            exports: 'named',
        },
        plugins: plugins,
        external: [ ],
    },
    // {
    //   input: input,
    //   output: {
    //     file: `${output}/${filename}.d.ts`,
    //     format: 'esm',
    //   },
    //   plugins:[
    //       // ...commonBasePlugins(),
    //       ...plugins,
    //       ...tsPlugin()],
    //   // external: ['vue', 'element-plus'],
    // },
];
export default configs;
