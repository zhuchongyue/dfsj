import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import glslify from 'rollup-plugin-glslify'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser';
import multi from '@rollup/plugin-multi-entry'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import image from '@rollup/plugin-image'
import progress from 'rollup-plugin-progress'
import sizes from 'rollup-plugin-sizes'
import svg from 'rollup-plugin-svg'
import scss from 'rollup-plugin-scss'
import banner from 'rollup-plugin-banner'
// import vueJsx from 'rollup-plugin-vue-jsx-compat';
import externals from "rollup-plugin-node-externals";
import esbuild from 'rollup-plugin-esbuild'
// import vitejsVue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
// @ts-ignore
import { destructionPackagesJson, getTime } from './utils.js'
import path from 'path'
import fs from 'fs'
import vue from 'rollup-plugin-vue'
// import htmlvue from 'rollup-plugin-htmlvue'

const extensions = ['.tsx', '.ts', '.jsx', '.mjs', '.js', '.json', '.node','.vue'] // 默认查找的文件扩展名
/***
 * ts插件
 */
const tsPlugin = () => {
	// @ts-ignore
	return [dts({
		compilerOptions: {
			preserveSymlinks: false
		}
	})]
}

const scssPlugin = () => {
	const packageJsonPath = path.join(process.cwd(), 'package.json')
	const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
	const packageJson = JSON.parse(packageJsonContent)
	const time = getTime()
	return [
		scss({
			fileName: `index.min.css`,
			outputStyle: 'compressed',
			processor: (css) => {
				const prefix = `/*
${packageJson.name}：${packageJson.description}
版本： ${packageJson.version}
作者：${packageJson.author}
日期：${time} 
*/`
				return prefix.concat(css)
			}
		})
	]
}

const bannerPlugin = () => {
	const time = getTime()
	const html = `
    <%= pkg.name %>： <%= pkg.description %>
    版本: v<%= pkg.version %>
    作者：<%= pkg.author %>
    日期：${time}
    `
	return [banner.default(html)]
}

/**
 * 全局替换插件
 * 一些全局得常量使用
 */
const replacePlugin = (packagesJson) => {
	return [replace(destructionPackagesJson(packagesJson))]
}
/**
 * 基础
 * node_modules查找
 * commonjs 支持
 * json支持
 * 多入口支持
 * ts转换支持
 */
const def = {
	glsl: false,
	scss: false,
	ts: true,
	multi: false
}
const commonBasePlugins = (
	options = {
		glsl: false,
		scss: false,
		ts: true,
		multi: false
	}
) => {
	options = Object.assign({}, def, options)
	const necessary = [
		// vue(),
		// vueJsx(),
		// esbuild({
		// 	jsxFactory: 'vueJsxCompat',
		// }),
		// VueMacros({
		// 	// setupComponent: false,
		// 	// setupSFC: false,
		// 	plugins: {
		// 		vue: vue({
		// 			isProduction: true,
		// 		}),
		// 		vueJsx: vueJsx(),
		// 	},
		// }),
		// vitejsVue(),
		vue({
			// target:'browser',
			// css: false,
			// compileTemplate: true,
		}),
		// vueJsx(),
		externals({devDeps: false,}), // devDependencies 类型的依赖就不用加到 externals 了。
		resolve({
			extensions: ['.jsx','.vue','.tsx','.mjs', '.js','.ts', '.json', '.node']
		}), // 查找和打包node_modules中的第三方模块
		commonjs( {
			exclude: 'node_modules/**',
		}), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处
		...babelPlugin(),
		// htmlvue(),

		json(),
		image(), //图片转base64
		// multi(),
		progress(),
		sizes(),
		svg()
	]
	if (options.multi) necessary.unshift(multi())
	if (options.ts)
		necessary.unshift(
			typescript({
				// 解析TypeScript
				// tsconfig: path.resolve(__dirname,"../tsconfig.json")
				sourcemap: true,
				exclude: ['**/**/*.d.cts', '**/*.d.mts'],
				throwIfNamespace: false, // 设置throwIfNamespace为false
				tsconfigOverride: {
					compilerOptions: {
						// declaration: false
						// allowSyntheticDefaultImports:true,
					}
				},
				presets: [
					[
						'env',
						{
							modules: false,
						},
					],
				],
			})
		)
	if (options.glsl) necessary.push(glslify())
	if (options.scss) necessary.push(...scssPlugin())
	return necessary
}
/***
 * babel 转换的
 */
const babelPlugin = () => {
	return [
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'runtime',
			// babelHelpers:'bundled',
			extensions:extensions,
			presets: [
				[
					'@babel/preset-env',
					{
						// useBuiltIns: 'usage',
						// useBuiltIns: 'entry',
						// "corejs": {
						// 	"version": 3, // 使用core-js@3
						// 	"proposals": true
						// }
						// corejs: 3,
						//     modules: false,
						//     targets: {
						//          node: "current",
						//          chrome: 44
						//     }
					}
				],
				['@babel/preset-react',{
					"throwIfNamespace": false,
				}],
				['@babel/preset-typescript'],
				['@babel/preset-flow'],
			],
			plugins: [
				[
					'@babel/plugin-transform-runtime',
					{

						// "corejs": false // 解决 helper 函数重复引入
						// "helpers": false,
						// "regenerator": true,
						// "useESModules": false,
					}
				],
				['@babel/plugin-syntax-dynamic-import'],
				['@babel/plugin-transform-block-scoping'],
				['@babel/plugin-proposal-class-static-block'],
				['@babel/plugin-proposal-class-properties'],
				['@babel/plugin-transform-classes'],
				['@babel/plugin-transform-typescript'],
				['@vue/babel-plugin-jsx',{
					enableObjectSlots:true
				}],
			],
		})
	]
}
/**
 * 压缩代码
 * 丑化代码
 * 防止web逆向
 * */
const proCompressPlugins = () => {
	// return [terser(), ...bannerPlugin()]
	return []
}

export {
	tsPlugin,
	replacePlugin,
	babelPlugin,
	commonBasePlugins,
	proCompressPlugins,
	scssPlugin,
	bannerPlugin
}
