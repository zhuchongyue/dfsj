declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

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
