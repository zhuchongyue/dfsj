import type {
    RouteLocationNormalized,
    RouteRecordNormalized,
} from 'vue-router';
import {AppRouteRecordRaw, Menu} from "/@/router/types.ts";
import {getAppEnvConfig} from "/@/utils/env.ts";
import {PageEnum} from "/@/enums/pageEnum.ts";
import {ROUTE_MAPPING} from "/@/router/constant.ts";
import {usePermissionStore} from "@/store/modules/permission.ts";

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
    let parameters = '';
    for (const key in obj) {
        parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
    }
    parameters = parameters.replace(/&$/, '');
    return /\?$/.test(baseUrl)
        ? baseUrl + parameters
        : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function getRawRoute(
    route: RouteLocationNormalized
): RouteLocationNormalized {
    if (!route) return route;
    const {matched, ...opt} = route;
    return {
        ...opt,
        matched: (matched
            ? matched.map((item) => ({
                meta: item.meta,
                name: item.name,
                path: item.path,
            }))
            : undefined) as RouteRecordNormalized[],
    };
}

//首页  预报  配置
const HAS_MAP_LAYOUT = ['listen_id_1', 'listen_id_2', 'listen_id_3', 'listen_id_47']

export function transMenu(menus: Array<Menu>) {
    if (!menus?.length || !menus) return [];
    const redirect = findFirstPath();
    const Root: AppRouteRecordRaw = {
        name: getAppEnvConfig().VITE_GLOB_APP_TITLE,
        component: 'LAYOUT',
        children: [],
        path: PageEnum.BASE_HOME,
        redirect:redirect ? `${PageEnum.BASE_HOME}/${redirect}` :  ''
    }
    let children: AppRouteRecordRaw[] = []
    console.log('menus', menus)
    menus.forEach((menu) => {
        const {label, name} = menu;
        const route = {
            name: name,
            meta: {
                title: label,
                hasMap: HAS_MAP_LAYOUT.includes(name)
            },
            component: ROUTE_MAPPING?.[name]?.component ?? '/sys/exception/Exception.vue',
            path: ROUTE_MAPPING?.[name]?.path ?? '/empty',
        }
        // console.log('route',route)
        children.push(route)
    })
    Root.children = children;
    return [Root]
}

/**
 * 查找第一个菜单的path
 */
export const findFirstPath = () => {
    const menus = usePermissionStore().getBackMenuList ?? [];
    return ROUTE_MAPPING?.[menus?.[0]?.name]?.path ?? null
}