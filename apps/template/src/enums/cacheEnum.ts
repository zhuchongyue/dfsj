/**
 * 缓存key
 */
// token key
export const TOKEN_KEY = 'TOKEN__';
export const LOCALE_KEY = 'LOCALE__';
// user info key
export const USER_INFO_KEY = 'USER__INFO__';
// role info key
export const ROLES_KEY = 'ROLES__KEY__';
// dict info key
export const DB_DICT_DATA_KEY = 'UI_CACHE_DB_DICT_DATA';
// project config key
export const PROJ_CFG_KEY = 'PROJ__CFG__KEY__';
// lock info
export const LOCK_INFO_KEY = 'LOCK__INFO__KEY__';
export const MULTIPLE_TABS_KEY = 'MULTIPLE_TABS__KEY__';
export const APP_DARK_MODE_KEY_ = '__APP__DARK__MODE__';
// base global local key
export const APP_LOCAL_CACHE_KEY = 'COMMON__LOCAL__KEY__';
// base global session key
export const APP_SESSION_CACHE_KEY = 'COMMON__SESSION__KEY__';
// 租户 key
export const TENANT_ID = 'TENANT_ID';
// login info key
export const LOGIN_INFO_KEY = 'LOGIN__INFO__';

export const LOGIN_REMEMBER_ME = 'LOGIN__REMEMBER_';

export const DISPATCH_KEY = 'DISPATCH_KEY';

export const PLATFORM_INS_KEY = 'PLATFORM_INS_KEY';



export enum CacheTypeEnum {
  SESSION,
  LOCAL,
}
