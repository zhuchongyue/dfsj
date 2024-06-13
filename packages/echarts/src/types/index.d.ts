declare interface Fn<T = any, R = T> {
	(...arg: T[]): R
}

declare type Fn = (...[]: any[]) => any
declare type TimeoutHandle = ReturnType<typeof global.setTimeout>
declare module '*.vue' {
    import {DefineComponent} from 'vue'

    const Component: DefineComponent<{}, {}, any>
	export default Component
}

declare module 'virtual:*' {
	const result: any
	export default result
}

declare module '*.sass' {
	const css: string
	export default css
}
declare module '*.less' {
	const css: string
	export default css
}
declare module '*.styl' {
	const css: string
	export default css
}
declare module '*.stylus' {
	const css: string
	export default css
}
declare module '*.pcss' {
	const css: string
	export default css
}
