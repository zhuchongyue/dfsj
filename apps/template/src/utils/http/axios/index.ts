// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged
import type { AxiosResponse } from 'axios';

import { TOKEN_TYPE_KEY } from '/@/enums/cacheEnum';
// import { useMessage } from '/@/hooks/web/useMessage';
import {
  ConfigEnum,
  ContentTypeEnum,
  RequestEnum,
  ResultEnum,
  UrlPrefix,
} from '/@/enums/httpEnum';
import { useGlobSetting } from '/@/hooks/setting';
import { useI18n } from '/@/hooks/web/useI18n';
import { router } from '/@/router';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useUserStoreWithOut } from '/@/store/modules/user';
import {  setObjToUrlParams } from '/@/utils/route';
// import { deepMerge } from '@dfsj/utils';
//todo deepMerge
import { deepMerge  } from '@dfsj/utils';
import { getAuthCache, getTenantId, getToken } from '/@/utils/auth';
// import CommonUtils from '/@/utils/common';
// import signMd5Utils from '/@/utils/encryption/signMd5Utils';
import {MD5HttpSignUtils} from "@dfsj/utils"
// import { isString } from '/@/utils/is';
import {isString} from "@dfsj/utils"

import type { RequestOptions, Result } from '/#/axios';

import { VAxios } from './Axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { checkStatus } from './checkStatus';
import { formatRequestDate, joinTimestamp } from './helper';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
// const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启

    if (!isTransformResponse) {
      return res.data;
    }
    // 错误的时候返回

    const { data } = res;
    data.message = data.message || data.msg; // 补全mssage
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error('sys.api.apiRequestFailed');
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message, success, data: resData } = data;
    // 这里逻辑可以根据项目进行修改
    const hasSuccess =
      data &&
      Reflect.has(data, 'code') &&
      (code === ResultEnum.SUCCESS || code === 200);
    if (hasSuccess) {
      if (success && message && options.successMessageMode === 'success') {
        // 信息成功提示
        // createMessage.success(message);
      }
      return result ?? resData;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage');
        const userStore = useUserStoreWithOut();
        userStore.setToken(undefined);
        userStore.logout(true);
        break;
      default:
        if (message) {
          timeoutMsg = message;
        }
    }
    console.log('----', '-000000');
    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal') {
      // createErrorModal({ title:('sys.api.errorTip'), content: timeoutMsg });
    } else if (options.errorMessageMode === 'message') {
      // createMessage.error(timeoutMsg);
    }

    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
    } = options;

    const isCompleteUrl = /^http[s]?:\/\/.*/.test(config.url);

    if (joinPrefix && !isCompleteUrl) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl) && !isCompleteUrl) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false)
        );
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          Object.keys(config.data).length > 0
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config: Recordable, options) => {
    // 请求之前处理config
    const token = getToken();
    let tenantid = getTenantId();
    config.headers.appId = 185689896348741;
    config.headers.Terminal = 'web';
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      config.headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
      // config.headers[ConfigEnum.TOKEN] = token;
      config.headers[ConfigEnum.TIMESTAMP] = MD5HttpSignUtils.getTimestamp();
      // config.headers[ConfigEnum.Sign] = MD5Utils.getSign(config.url, config.params);

      if (!tenantid) {
        tenantid = 0;
      }
      // config.headers[ConfigEnum.TENANT_ID] = tenantid;
      // config.headers[ConfigEnum.VERSION] = 'v3';
      const routeParams = router.currentRoute.value.params;
      if (routeParams.appId) {
        config.headers[ConfigEnum.X_LOW_APP_ID] = routeParams.appId;
        // lowApp自定义筛选条件
        if (routeParams.lowAppFilter) {
          config.params = {
            ...config.params,
            ...JSON.parse(routeParams.lowAppFilter as string),
          };
          delete routeParams.lowAppFilter;
        }
      }
      // update-end--author:sunjianlei---date:20220624--for: 添加低代码应用ID
      // ========================================================================================
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    let msg: string | any | undefined =
      res?.data?.message || res?.data?.msg || '';
    // const isCh = CommonUtils.containsChinese(msg);
    const isCh = true;
    if (!isCh) msg = '';
    checkStatus(res?.data?.code, msg);
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    // scott 20211022 token失效提示信息
    // const msg: string = response?.data?.error?.message ?? '';
    let msg: string | any | undefined =
      response?.data?.message || response?.data?.msg || '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          // createErrorModal({ title: ('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          // createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error);
    }

    const isCh =true;
    // const isCh = CommonUtils.containsChinese(msg);
    if (!isCh) msg = undefined;
    checkStatus(error?.response?.status, msg, errorMessageMode);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: getAuthCache(TOKEN_TYPE_KEY) ?? 'Bearer',
        timeout: 60 * 1000 * 60 * 24,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 异常消息提示类型
          errorMessageMode: 'message',
          // 成功消息提示类型
          successMessageMode: 'success',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix,
          // 是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          ignoreCancelKey: '',
          // 是否携带token
          withToken: true,
        },
      },
      opt || {}
    )
  );
}

/** 可以写当前前端地址nginx作代理  也可以直接指定后端的请求实际地址 */
/** 默认请求 （ 当前前端地址   /apis） */
export const defHttp = createAxios({
  requestOptions: {
    urlPrefix: UrlPrefix.APIS,
  },
});
/** 网关请求 （ 当前前端地址  /gateway */
export const gatewayHttp = createAxios({
  requestOptions: {
    urlPrefix: UrlPrefix.GATEWAY,
  },
});
