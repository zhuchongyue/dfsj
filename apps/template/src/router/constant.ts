import { EnvEnum } from '/@/enums/envEnum';

export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

//TODO 正式分离项目以后可以删除掉判断逻辑  当前洪水预报项目未完善不建议删除
const ROUTES = {
  [EnvEnum.HFDC]: {
    //首页
    listen_id_1: {
      path: 'main',
      component: '/main/index.vue',
      icon: 'header-main',
    },
    //实时监测
    listen_id_47: {
      path: 'monitor',
      component: '/monitor/index.vue',
      icon: 'header-monitor',
    },
    //配置管理
    listen_id_3: {
      path: 'config',
      // component:'/flood/config/index.vue',
      component: '/flood/configurate/index.vue',
      icon: 'header-configurate',
    },
    //洪水预报
    listen_id_2: {
      path: 'forecast',
      component: '/flood/forecast/index.vue',
      icon: 'header-forecast',
    },
    //水库调度
    listen_id_48: {
      path: 'dispatch',
      component: '/flood/dispatch/index.vue',
      icon: 'header-dispatch',
    },
    //洪水分析
    listen_id_4: {
      path: 'parameter',
      component: '/flood/parameter/index.vue',
      icon: 'header-achievement',
    },
    //闸门调度
    listen_id_49: {
      path: 'gate',
      component: '/flood/gate-dispatch/index.vue',
      icon: 'header-gate',
    },
    //精度评定
    listen_id_5: {
      path: 'precision',
      component: '/flood/precision/index.vue',
      icon: 'header-precision',
    },
    //成果管理
    listen_id_6: {
      path: 'achievement',
      component: '/flood/achievement/index.vue',
      icon: 'header-achievement',
    },
    //统计查询
    listen_id_46: {
      path: 'query',
      component: '/query/index.vue',
      icon: 'header-query',
    },
    //综合查询
    listen_id_7: {
      path: 'data',
      component: '/flood/data/index.vue',
      icon: 'header-data',
    },
    //信息发布
    listen_id_806: {
      path: 'publish',
      component: '/flood/system/warningRelease/index.vue',
      icon: 'header-publish',
    },
    //系统管理
    listen_id_8: {
      path: 'system',
      component: '/system/index.vue',
      icon: 'header-system',
    },
  },
};

export const ROUTE_MAPPING:any = (function () {
    return ROUTES[EnvEnum.HFDC];
})();

export const EXCEPTION_COMPONENT = () =>
  import('/@/views/sys/exception/Exception.vue');

/**
 * @description: default layout
 */
export const LAYOUT = () => import('/@/layouts/default/DefaultLayout.vue');
//地图的必要布局
export const MAP_LAYOUT = () => import('/@/layouts/map/MapLayout.vue');

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};
