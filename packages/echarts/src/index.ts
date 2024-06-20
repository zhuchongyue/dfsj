import {useAssist} from './hooks/useAssist' //一些通用的配置和数据转换
import {useECharts} from './hooks/useECharts' //初始化echarts
import {useCapacity} from './charts/useCapacity' //库容曲线
import {useDrainageCurves} from './charts/useDrainageCurves' //泄洪曲线
import {useComplexHydrology} from './charts/useComplexHydrology' //复杂水文
import {useCrossSection} from './charts/useCrossSection' //横断面示意图
import {useDamSchematic} from './charts/useDamSchematic' //大坝示意图
import {useStageflow} from './charts/useStageflow' //水位流量图
import {useRainfall} from './charts/useRainfall' //降雨量关系图
import {useHydrology} from './charts/useHydrology' //基础水文
export * from './utils/index' //工具
export * from './config' //基础配置
import config from './config' //基础配置
export {useDownLoad} from "./view/useDownLoad"; //统一下载
export {useEChartsThemes} from "./themes/useEChartsThemes"
export {
    useAssist,
    useECharts,
    useCapacity,
    useStageflow,
    useHydrology,
    useRainfall,
    useCrossSection,
    useComplexHydrology,
    useDamSchematic,
    useDrainageCurves,
    config
}
