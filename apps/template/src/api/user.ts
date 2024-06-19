import { ElMessage } from 'element-plus';
import { TOKEN_KEY } from '/@/enums/cacheEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { router } from '/@/router';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { setAuthCache } from '/@/utils/auth';
import { defHttp, gatewayHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
} from './model/user.model.ts';
enum Api {
  Code = '/code',
  Login = '/user/oauth/token',
  Logout = '/user/oauth/logout',
  GetUserInfo = '/user/userManage/myInfo',
  menuList = '/user/module/list', //菜单

  phoneLogin = '/user/oauth/mobile',
  // 获取系统权限
  // 1、查询用户拥有的按钮/表单访问权限
  // 2、所有权限
  // 3、系统安全模式
  GetPermCode = '/user/permission/getPermCode',
  //新加的获取图形验证码的接口
  getInputCode = '/user/randomImage',
  //获取短信验证码的接口
  getCaptcha = '/user/oauth/sendGzValidCode',
  //注册接口
  registerApi = '/sys/user/register',
  //校验用户接口
  checkOnlyUser = '/sys/user/checkOnlyUser',
  //校验手机号
  phoneVerify = '/sys/user/phoneVerification',
  //修改密码
  passwordChange = '/sys/user/passwordChange',

  queryFunctionCfgInfo = '/calcu/cfg/queryFunctionCfgInfo',
}

/**
 *获取验证码
 * @param params
 */
export const getCode = (params) =>
  gatewayHttp.get(
    { url: Api.Code, params: params, responseType: 'arraybuffer' },
    {
      joinTime: false,
      isTransformResponse: false,
    }
  );

/**
 * @description: 登录
 */
export function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'modal'
) {
  return gatewayHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params: params,
      headers: {
        Authorization: `Basic ZWM6ZWM=qwertyiopkgdcvcxzvnytfewadsfh`,
      },
    },
    {
      isTransformResponse: false,
      joinParamsToUrl: true,
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return gatewayHttp
    .post<GetUserInfoModel>(
      { url: Api.GetUserInfo },
      {
        // isTransformResponse:true
      }
    )
    .catch((e) => {
      if (e && (e.message.includes('timeout') || e.message.includes('401'))) {
        const userStore = useUserStoreWithOut();
        userStore.setToken('');
        setAuthCache(TOKEN_KEY, null);
        router.push(PageEnum.BASE_LOGIN);
      }
    });
}
/**
 * 获取用户的菜单信息
 */
export const getMenuList = (params) => {
    return defHttp.post({ url: Api.menuList, params });
};
export function getPermCode() {
  return defHttp.get({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}
/**
 * @description: 获取短信验证码
 */
export function getCaptcha(params) {
  return new Promise((resolve, reject) => {
    defHttp
      .get({ url: Api.getCaptcha, params }, { isTransformResponse: false })
      .then((res) => {
        console.log(res);
        if (res.code == 0) {
          ElMessage.success('短信已发送,注意查收！');
          resolve(true);
        } else {
          ElMessage.error(res?.msg ?? '短信获取失败！');
          reject();
          // resolve(true);
        }
      });
  });
}

/**
 * @description: 注册接口
 */
export function register(params) {
  return defHttp.post(
    { url: Api.registerApi, params },
    { isReturnNativeResponse: true }
  );
}

/**
 *校验用户是否存在
 * @param params
 */
export const checkOnlyUser = (params) =>
  defHttp.get(
    { url: Api.checkOnlyUser, params },
    { isTransformResponse: false }
  );
/**
 *校验手机号码
 * @param params
 */
export const phoneVerify = (params) =>
  defHttp.post(
    { url: Api.phoneVerify, params },
    { isTransformResponse: false }
  );
/**
 *密码修改
 * @param params
 */
export const passwordChange = (params) =>
  defHttp.get(
    { url: Api.passwordChange, params },
    { isTransformResponse: false }
  );

/**
 * @description: user phoneLogin api
 */
export function phoneLoginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'modal'
) {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.phoneLogin,
      params,
    },
    {
      // errorMessageMode: mode,
      isTransformResponse: false,
      joinParamsToUrl: true,
    }
  );
}

/**
 * 查询用户功能配置
 * */
export function queryFunctionCfgInfoApi() {
  return defHttp.post({ url: Api.queryFunctionCfgInfo });
}
