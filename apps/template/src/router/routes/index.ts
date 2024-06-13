import type {AppRouteRecordRaw, AppRouteModule} from '/@/router/types';

import {PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE} from '/@/router/routes/basic';

import {mainOutRoutes} from './mainOut';
import {PageEnum} from '/@/enums/pageEnum';

const modules = import.meta.glob('./modules/**/*.ts', {eager: true});

const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
    const mod = (modules as Recordable)[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const RootRoute: { redirect: any; path: string; meta: { title: string }; name: string } = {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_HOME,
    meta: {
        title: 'Root',
    },
};
/**
 * 登录的路由
 */
export const LoginRoute: AppRouteRecordRaw = {
    end: false, redirect: undefined, sensitive: false, strict: false,
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/sys/login/Login.vue'),
    meta: {
        // title: t('routes.basic.login'),
    }
};



// Basic routing without permission
export const basicRoutes = [
    LoginRoute,
    RootRoute,
    ...mainOutRoutes,
    REDIRECT_ROUTE,
    PAGE_NOT_FOUND_ROUTE,
    // TokenLoginRoute,
    // Oauth2LoginRoute,
    // ...asyncRoutes
];

// console.log('basicRoutes',basicRoutes)