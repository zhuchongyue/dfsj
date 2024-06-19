import {defineAsyncComponent} from "vue"
import {createAsyncComponent} from "/@/utils/factory/createAsyncComponent.tsx";
const ComponentsMap = {
    //个人中心
    listen_id_7:createAsyncComponent(()=> import('./userInfo/UserInfo.vue')),
    //用户管理
    listen_id_8:createAsyncComponent(()=> import('./users/Users.vue')),
    // 留言反馈
    // listen_id_461:defineAsyncComponent(()=> import('./water/WaterRealTimeStatistics.vue')),
    //运行监控
}

export {
    ComponentsMap
}