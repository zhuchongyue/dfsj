import { EnvEnum } from '/@/enums/envEnum';

export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

//TODO 后期路由会协调后台全部从后台来
const ROUTES = {
  [EnvEnum.HFDC]: {
    //防洪保护区
    listen_id_1: {
      path: 'protect',
      component: '/main/index.vue',
      icon: 'header-main',
    },
    //中小河流
    listen_id_2: {
      path: 'river',
      component: '/monitor/index.vue',
      icon: 'header-monitor',
    },
    //水库
    listen_id_3: {
      path: 'reservoir',
      // component:'/flood/config/index.vue',
      component: '/flood/configurate/index.vue',
      icon: 'header-configurate',
    },
    //小流域
    listen_id_4: {
      path: 'watershed',
      component: '/flood/forecast/index.vue',
      icon: 'header-forecast',
    },
    //山洪灾害
    listen_id_5: {
      path: 'disasters',
      component: '/flood/dispatch/index.vue',
      icon: 'header-dispatch',
    },
    //系统管理
    listen_id_6: {
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
