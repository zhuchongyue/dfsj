import {defineAsyncComponent} from "vue"
const ComponentsMap = {
    //实时雨情统计
    listen_id_460:defineAsyncComponent(()=> import('./rain/RainRealTimeStatisticsPage.vue')),
    listen_id_463:defineAsyncComponent(()=> import('./rain/RainRealTimePage.vue')),
    //实时水情统计
    listen_id_461:defineAsyncComponent(()=> import('./water/WaterRealTimeStatistics.vue')),
}

export {
    ComponentsMap
}