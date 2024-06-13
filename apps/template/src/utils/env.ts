import type { GlobEnvConfig } from '/#/config';

import pkg from '../../package.json';
import { getConfigFileName } from '../../build/getConfigFileName';
import {ViteEnv} from "/#/config";
import {EnvEnum} from "/@/enums/envEnum";

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_USE_MOCK,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_APP_OPEN_SSO,
    VITE_GLOB_APP_OPEN_QIANKUN,
    VITE_GLOB_APP_CAS_BASE_URL,
    VITE_GLOB_DOMAIN_URL,
    VITE_GLOB_ONLINE_VIEW_URL,
    VITE_BIZ_TYPE,
    VITE_SECONDARY_TITLE
  } = ENV;
  const VITE_ENV:ViteEnv = ENV.VITE_ENV as ViteEnv

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    // warn(
    //   `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    // );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_USE_MOCK,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_APP_OPEN_SSO,
    VITE_GLOB_APP_OPEN_QIANKUN,
    VITE_GLOB_APP_CAS_BASE_URL,
    VITE_GLOB_DOMAIN_URL,
    VITE_GLOB_ONLINE_VIEW_URL,
    VITE_BIZ_TYPE,
    VITE_ENV,
    VITE_SECONDARY_TITLE
  };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}
/**项目*/
export function getViteEnv(): ViteEnv {
  return getAppEnvConfig().VITE_ENV
}
/** 红枫电厂*/
export function isHFDCEnv(): ViteEnv {
  return getAppEnvConfig().VITE_ENV == EnvEnum.HFDC
}
/** 黔源电力*/
export function isQYDLEnv(): ViteEnv {
  return getAppEnvConfig().VITE_ENV == EnvEnum.QYDL
}
/** 水文局*/
export function isSWJEnv(): ViteEnv {
  return getAppEnvConfig().VITE_ENV == EnvEnum.SWJ
}
export function isWLSDEnv(): ViteEnv {
  return getAppEnvConfig().VITE_ENV == EnvEnum.WLSD
}
/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
