import { defineStore } from 'pinia';
import { toRaw } from 'vue';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { useI18n } from '/@/hooks/web/useI18n';
import {
  addSlashToRouteComponent,
  flatMultiLevelRoutes,
  transformObjToRoute,
} from '/@/router/helper/routeHelper';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import projectSetting from '/@/settings/projectSetting';
import { store } from '/@/store';
import { useAppStoreWithOut } from './app';
import { useUserStore } from './user';
import {transMenu} from "/@/utils/route.ts";
import {getMenuList} from "@/api/user.ts";
// 系统权限
interface AuthItem {
  // 菜单权限编码，例如：“sys:schedule:list,sys:schedule:info”,多个逗号隔开
  action: string;
  // 权限策略1显示2禁用
  type: string | number;
  // 权限状态(0无效1有效)
  status: string | number;
  // 权限名称
  describe?: string;
  isAuth?: boolean;
}
interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
  // 用户所拥有的权限
  authList: AuthItem[];
  // 全部权限配置
  allAuthList: AuthItem[];
  // 系统安全模式
  sysSafeMode: boolean;
  // online子表按钮权限
  onlineSubTableAuthMap: object;
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
    authList: [],
    allAuthList: [],
    sysSafeMode: false,
    onlineSubTableAuthMap: {},
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
    getOnlineSubTableAuth: (state) => {
      return (code) => state.onlineSubTableAuthMap[code];
    },
    getBackMenuParams: (state) => { // 获取后台配置菜单的参数
      return (name) => {
        // const node = findNode(state.backMenuList, item => item.name == name, {
        //   children: 'subs'
        // })
        let params = null
        try {
          // params = JSON.parse(node?.params)
        } catch (error) {
        }
        return params
      }
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },
    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode() {
      // const systemPermission = await getPermCode();
      // const codeList = systemPermission.codeList;
      // this.setPermCodeList(codeList);
      // this.setAuthData(systemPermission);
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();
      let routes: AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList) || [];
      const { permissionMode = projectSetting.permissionMode } =
        appStore.getProjectConfig;

      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      };

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string =
          userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        console.log('homePath', routes);
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
      };

      switch (permissionMode) {
        // case PermissionModeEnum.ROLE:
        //   routes = filter(asyncRoutes, routeFilter);
        //   routes = routes.filter(routeFilter);
        //   //  将多级路由转换为二级
        //   routes = flatMultiLevelRoutes(routes);
        //   break;
        // case PermissionModeEnum.ROUTE_MAPPING:
        //   routes = filter(asyncRoutes, routeFilter);
        //   routes = routes.filter(routeFilter);
        //   const menuList = transformRouteToMenu(routes, true);
        //   routes = filter(routes, routeRemoveIgnoreFilter);
        //   routes = routes.filter(routeRemoveIgnoreFilter);
        //   menuList.sort((a, b) => {
        //     return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
        //   });
        //   this.setFrontMenuList(menuList);
        //   // 将多级路由转换为二级
        //   routes = flatMultiLevelRoutes(routes);
        //   break;
        // 后台菜单构建
        case PermissionModeEnum.BACK:
          // 从后台获取权限码，
          // 这个函数可能只需要执行一次，并且实际的项目可以在正确的时间被放置
          let routeList: AppRouteRecordRaw[] = [];
          try {
            this.changePermissionCode();
            const backMenuList =
              ((await getMenuList({ module: 1 })) as AppRouteRecordRaw[]) || [];
            this.setBackMenuList(backMenuList);
            routeList = transMenu(backMenuList);
            let hasIndex: boolean = false;
            let hasIcon: boolean = false;
            for (const menuItem of routeList) {
              // 条件1：判断组件是否是 layouts/default/index
              if (!hasIndex) {
                hasIndex = menuItem.component === 'layouts/default/index';
              }
              // 条件2：判断图标是否带有 冒号
              if (!hasIcon) {
                hasIcon = !!menuItem.meta?.icon?.includes(':');
              }
              // 满足任何一个条件都直接跳出循环
              if (hasIcon || hasIndex) {
                break;
              }
            }
            // 两个条件都不满足，就弹出提示框
            if (!hasIcon && !hasIndex) {
              //
            }
          } catch (error) {
            console.error(error);
          }
          // 组件地址前加斜杠处理  author: lsq date:2021-09-08
          routeList = addSlashToRouteComponent(routeList);
          // 动态引入组件
          routeList = transformObjToRoute(routeList);
          routeList = routeList.filter(routeRemoveIgnoreFilter);
          routeList = flatMultiLevelRoutes(routeList);
          console.log('routeList', routeList);
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
          // routes = [PAGE_NOT_FOUND_ROUTE];
          break;
      }
      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
    setAuthData(systemPermission) {
      this.authList = systemPermission.auth;
      this.allAuthList = systemPermission.allAuth;
      this.sysSafeMode = systemPermission.sysSafeMode;
    },
    setAuthList(authList: AuthItem[]) {
      this.authList = authList;
    },
    setAllAuthList(authList: AuthItem[]) {
      this.allAuthList = authList;
    },
    setOnlineSubTableAuth(code, hideBtnList) {
      this.onlineSubTableAuthMap[code] = hideBtnList;
    },
  },
});

// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
