/**
 * echarts 主题
 * （包含定制主题以及 官方提供的主题）
 * 定制主题需要下载到当前目录并注入配置加载使用即可
 * */
import('echarts/theme/dark.js')
import('echarts/theme/azul.js')
import('echarts/theme/dark-blue.js')
const themes = {
	azul: () => import('echarts/theme/azul.js'),
	'bee-inspired': () => import('echarts/theme/bee-inspired.js'),
	blue: () => import('echarts/theme/blue.js'),
	caravan: () => import('echarts/theme/caravan.js'),
	carp: () => import('echarts/theme/carp.js'),
	cool: () => import('echarts/theme/cool.js'),
	dark: () => import('echarts/theme/dark.js'),
	'dark-blue': () => import('echarts/theme/dark-blue.js'),
	'dark-bold': () => import('echarts/theme/dark-bold.js'),
	'dark-digerati': () => import('echarts/theme/dark-digerati.js'),
	'dark-fresh-cut': () => import('echarts/theme/dark-fresh-cut.js'),
	'dark-mushroom': () => import('echarts/theme/dark-mushroom.js'),
	eduardo: () => import('echarts/theme/eduardo.js'),
	forest: () => import('echarts/theme/forest.js'),
	'fresh-cut': () => import('echarts/theme/fresh-cut.js'),
	fruit: () => import('echarts/theme/fruit.js'),
	gray: () => import('echarts/theme/gray.js'),
	green: () => import('echarts/theme/green.js'),
	helianthus: () => import('echarts/theme/helianthus.js'),
	infographic: () => import('echarts/theme/infographic.js'),
	inspired: () => import('echarts/theme/inspired.js'),
	jazz: () => import('echarts/theme/jazz.js'),
	london: () => import('echarts/theme/london.js'),
	macarons: () => import('echarts/theme/macarons.js'),
	macarons2: () => import('echarts/theme/macarons2.js'),
	mint: () => import('echarts/theme/mint.js'),
	red: () => import('echarts/theme/red.js'),
	'red-velvet': () => import('echarts/theme/red-velvet.js'),
	roma: () => import('echarts/theme/roma.js'),
	royal: () => import('echarts/theme/royal.js'),
	sakura: () => import('echarts/theme/sakura.js'),
	shine: () => import('echarts/theme/shine.js'),
	'tech-blue': () => import('echarts/theme/tech-blue.js'),
	vintage: () => import('echarts/theme/vintage.js')
}

export default themes
