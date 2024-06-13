import {ElMessage, ElMessageBox} from 'element-plus';
import {defineStore} from 'pinia';
// import { usePermissionStore } from '/@/store/modules/permission';
import {RouteRecordRaw} from 'vue-router';

import {GetUserInfoModel, LoginParams,} from '/@/api/sys/model/userModel';
import {doLogout, getUserInfo, loginApi, phoneLoginApi, queryFunctionCfgInfoApi,} from '/@/api/user';
import {
  DB_DICT_DATA_KEY,
  EXPIRES_IN_KEY,
  LOGIN_INFO_KEY,
  LOGIN_REMEMBER_ME,
  REFRESH_TOKEN_KEY,
  ROLES_KEY,
  TENANT_ID,
  TOKEN_KEY,
  TOKEN_TYPE_KEY,
  USER_INFO_KEY,
} from '/@/enums/cacheEnum';
import {PageEnum} from '/@/enums/pageEnum';
import {RoleEnum} from '/@/enums/roleEnum';
import {useGlobSetting} from '/@/hooks/setting';
import {useI18n} from '/@/hooks/web/useI18n';
// import { useI18n } from '/@/hooks/web/useI18n';
// import { useMessage } from '/@/hooks/web/useMessage';
import {router} from '/@/router';
import {PAGE_NOT_FOUND_ROUTE} from '/@/router/routes/basic';
import {store} from '/@/store';
import {usePermissionStore} from '/@/store/modules/permission';
import {getAuthCache, setAuthCache} from '/@/utils/auth';
// import { isArray } from '/@/utils/is';
import {isArray} from "@dfsj/utils"

import type {ErrorMessageMode} from '/#/axios';
import type {LoginInfo, UserInfo} from '/#/store';

// import { useSso } from '/@/hooks/web/useSso';
interface FunctionCfgItemInfo {
  code: string;
  desc: string;
  name: string;
  isChecked?: boolean;
  param?: any;
}
interface FunctionCfgItem {
  code: string;
  desc: string;
  name: string;
  infos: FunctionCfgItemInfo[];
}
interface FunctionCfgInfo {
  forecast: FunctionCfgItem;
  homePageWarn?: FunctionCfgItem;
  homePagePanel?: FunctionCfgItem;
}
interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  dictItems?: [];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  tenantid?: string | number;
  loginInfo?: Nullable<LoginInfo>;
  functionCfgInfo: FunctionCfgInfo;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // 用户信息
    userInfo: null,
    // token
    token: undefined,
    token_type: undefined,
    refresh_token: undefined,
    expires_in: undefined,
    // 角色列表
    roleList: [],
    // 字典
    dictItems: [],
    // session过期时间
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    //登录返回信息
    loginInfo: null,
    functionCfgInfo: null,
  }),
  getters: {
    getRememberMe() {
      let userStr = localStorage.getItem(LOGIN_REMEMBER_ME);
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getLoginInfo(): LoginInfo {
      return this.loginInfo || getAuthCache<LoginInfo>(LOGIN_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getTokenType(): string {
      return this.token_type || getAuthCache<string>(TOKEN_TYPE_KEY);
    },
    getRefreshToken(): string {
      return this.refresh_token || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getExpiresIn(): string {
      return this.expires_in || getAuthCache<string>(EXPIRES_IN_KEY);
    },
    getAllDictItems(): [] {
      return this.dictItems || getAuthCache(DB_DICT_DATA_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0
        ? this.roleList
        : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getFunctionCfgInfo(): FunctionCfgInfo {
      return this.functionCfgInfo;
    },
    getTenant(): string | number {
      return this.tenantid || getAuthCache<string | number>(TENANT_ID);
    },
    isAdmin(): boolean {
      // ROLE_ADMIN_SYSTEM      系统运维管理用户角色
      // ROLE_SYSTEM       省市管理用户角色
      return this.getUserInfo?.roles?.some((item) => {
        if (
          item.roleCode == 'ROLE_ADMIN_SYSTEM' ||
          item.roleCode == 'ROLE_SYSTEM'
        ) {
          return true;
        }
        return false;
      });
    },
    // 角色编码
    // ROLE_USER：普通用户
    // ROLE_ADMIN：管理员
    // ROLE_FORECAST：预报员
    isNormalUser(): boolean {
      return this.getUserInfo?.roles?.some((item) => {
        if (item.roleCode == 'ROLE_USER' || item.roleCode == 'ROLE_FORECAST') {
          return true;
        }
        return false;
        // return true
      });
    },
  },
  actions: {
    setRememberMe(user: any) {
      let userStr = JSON.stringify(user);
      localStorage.setItem(LOGIN_REMEMBER_ME, userStr);
    },
    setFunctionCfgInfo(info: FunctionCfgInfo) {
      this.functionCfgInfo = info;
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRefreshToken(info: string | undefined) {
      this.refresh_token = info ? info : ''; // for null or undefined value
      setAuthCache(REFRESH_TOKEN_KEY, info);
    },
    setTokenType(info: string | undefined) {
      this.token_type = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_TYPE_KEY, info);
    },
    setExpiresIn(info: string | undefined) {
      this.expires_in = info ? info : ''; // for null or undefined value
      setAuthCache(EXPIRES_IN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setLoginInfo(info: LoginInfo | null) {
      this.loginInfo = info;
      setAuthCache(LOGIN_INFO_KEY, info);
    },
    setAllDictItems(dictItems) {
      this.dictItems = dictItems;
      setAuthCache(DB_DICT_DATA_KEY, dictItems);
    },
    setTenant(id) {
      this.tenantid = id;
      setAuthCache(TENANT_ID, id);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.dictItems = [];
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * 登录事件
     * access_token     * :     * "nlPQFUukMHuVwaia5qSknoWTj7Q"
     * * dept_id     * :     * 0
     * expires_in     * :     * 84513
     * * license     * :     * "made by usercenter"
     * refresh_token     * :     * "-SfSf4OaM81Brbx9DEzc_V6tf3E"
     * scope     * :     * "server"
     * token_type     * :     * "bearer"
     * user_adcd     * :     * "000000000000000"
     * user_id     * :     * 1
     * username     * :     * "admin"
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
        rememberMe?: boolean;
      }
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        console.log('data', data);
        if (data?.code == 1) {
          ElMessage.error(data?.msg);
        } else {
          const {
            access_token: token,
            refresh_token,
            expires_in,
            token_type,
          } = data;
          // save token
          this.setToken(token);
          this.setTokenType(token_type);
          this.setRefreshToken(refresh_token);
          this.setExpiresIn(expires_in);
          return this.afterLoginAction(goHome, data);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * 手机号登录
     * @param params
     */
    async phoneLogin(
      params: LoginParams & {
        goHome?: boolean;
      }
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await phoneLoginApi(loginParams, mode);
        if (data?.code == 1) {
          ElMessage.error(data?.msg);
        } else {
          const {
            access_token: token,
            refresh_token,
            expires_in,
            token_type,
          } = data;
          // save token
          this.setToken(token);
          this.setTokenType(token_type);
          this.setRefreshToken(refresh_token);
          this.setExpiresIn(expires_in);
          return this.afterLoginAction(goHome, data);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * 扫码登录事件
     */
    async qrCodeLogin(token): Promise<GetUserInfoModel | null> {
      try {
        // save token
        this.setToken(token);
        return this.afterLoginAction(true, {});
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * 登录完成处理
     * @param goHome
     */
    async afterLoginAction(goHome?: boolean, data?: any): Promise<any | null> {
      if (!this.getToken) return null;
      //获取用户信息
      const userInfo: any = await this.getUserInfoAction();
      await this.queryFunctionCfgInfo();
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          // console.log('需要创建的...',routes)
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        await this.setLoginInfo({ ...data, isLogin: true });
        //update-begin-author:liusq date:2022-5-5 for:登录成功后缓存拖拽模块的接口前缀
        // localStorage.setItem(JDragConfigEnum.DRAG_BASE_URL, useGlobSetting().domainUrl);
        //update-end-author:liusq date:2022-5-5 for: 登录成功后缓存拖拽模块的接口前缀
        goHome &&
          (await router.replace(
            (userInfo && userInfo.homePath) || PageEnum.BASE_HOME
          ));
      }
      return data;
    },
    /**
     * 获取用户信息
     */
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) {
        return null;
      }
      // const { userInfo, sysAllDictItems } = await getUserInfo();
      const sysAllDictItems = undefined;
      const userInfo = await getUserInfo();
      if (userInfo) {
        const { roles = [] } = userInfo;
        if (isArray(roles)) {
          const roleList = roles.map((item) => item.value) as RoleEnum[];
          this.setRoleList(roleList);
        } else {
          userInfo.roles = [];
          this.setRoleList([]);
        }
        this.setUserInfo(userInfo);
      }
      /**
       * 添加字典信息到缓存
       * @updateBy:lsq
       * @updateDate:2021-09-08
       */
      if (sysAllDictItems) {
        this.setAllDictItems(sysAllDictItems);
      }
      return userInfo;
    },
    /**
     * 退出登录
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken('');
      setAuthCache(TOKEN_KEY, null);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      this.setLoginInfo(null);
      this.setTenant(null);
      const openSso = useGlobSetting().openSso;
      if (openSso == 'true') {
        // await useSso().ssoLoginOut();
      }
      goLogin && (await router.push(PageEnum.BASE_LOGIN));
    },
    async queryFunctionCfgInfo() {
      let functionCfgInfo = await queryFunctionCfgInfoApi().catch(() => {
        return Promise.resolve({
          forecast: null,
        });
      });
      this.setFunctionCfgInfo(functionCfgInfo);
    },
    /**
     * 退出询问
     */
    confirmLoginOut() {
      const { t } = useI18n();
      ElMessageBox.confirm(t('sys.app.logoutMessage'), t('sys.app.logoutTip'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await this.logout(true);
        ElMessage.success('退出登录成功！');
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
