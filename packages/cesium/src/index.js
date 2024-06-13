import {getLib, registerLib, setResourcesUrl} from './global-api/lib-utils'

export * from "./modules"; //主要的暴露模块
export * from "./modules/math"; //数学计算模块
export * from "./modules/chart"; //第三方echarts
export * from "./modules/third-part"; //三方模块
export {
    getLib,
    registerLib,
    setResourcesUrl
}
// import * as modules from './modules' //主要的暴露模块
// import * as math from './modules/math' //数学计算模块
// import * as chart from './modules/chart' //第三方echarts
// import * as third from './modules/third-part' //三方模块
// export default {
// 	getLib,
// 	registerLib,
// 	setResourcesUrl,
// 	...third,
// 	...math,
// 	...chart,
// 	...modules
// }
