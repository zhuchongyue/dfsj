import { omit, pick } from 'lodash-es';
import { toRaw } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

import {
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
  DB_DICT_DATA_KEY,
  DISPATCH_KEY,
  EXPIRES_IN_KEY,
  LOCK_INFO_KEY,
  LOGIN_INFO_KEY,
  LOGIN_REMEMBER_ME,
  MULTIPLE_TABS_KEY, PLATFORM_INS_KEY,
  PROJ_CFG_KEY,
  REFRESH_TOKEN_KEY,
  ROLES_KEY,
  TENANT_ID,
  TOKEN_KEY,
  TOKEN_TYPE_KEY,
  USER_INFO_KEY,
} from '/@/enums/cacheEnum';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';
import { createLocalStorage, createSessionStorage } from '/@/utils/cache';

import type { ProjectConfig } from '/#/config';
import type { LockInfo, UserInfo } from '/#/store';

import { Memory } from '@dfsj/utils';

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined;
  [USER_INFO_KEY]: UserInfo;
  [ROLES_KEY]: string[];
  [LOCK_INFO_KEY]: LockInfo;
  [PROJ_CFG_KEY]: ProjectConfig;
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
  [DISPATCH_KEY]: any;
  [PLATFORM_INS_KEY]: any;
  [LOGIN_INFO_KEY]: any;
  [TOKEN_TYPE_KEY]: any;
  [REFRESH_TOKEN_KEY]: any;
  [EXPIRES_IN_KEY]: any;
  [DB_DICT_DATA_KEY]: any;
  [TENANT_ID]: any;
}

type LocalStore = BasicStore;

type SessionStore = BasicStore;

export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const ls = createLocalStorage();
const ss = createSessionStorage();

const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

function initPersistentMemory() {

  console.log('------------------------------------------initPersistentMemory---------------------------------------------------')
  const localCache = ls.get(APP_LOCAL_CACHE_KEY);
  const sessionCache = ss.get(APP_SESSION_CACHE_KEY);
  localCache && localMemory.resetCache(localCache);
  sessionCache && sessionMemory.resetCache(sessionCache);
}

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>;
  }

  static setLocal(
    key: LocalKeys,
    value: LocalStore[LocalKeys],
    immediate = false
  ): void {
    localMemory.set(key, toRaw(value));
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key);
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  static clearLocal(immediate = false): void {
    localMemory.clear();
    immediate && ls.clear();
  }

  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>;
  }

  static setSession(
    key: SessionKeys,
    value: SessionStore[SessionKeys],
    immediate = false
  ): void {
    sessionMemory.set(key, toRaw(value));
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
  }

  static removeSession(key: SessionKeys, immediate = false): void {
    sessionMemory.remove(key);
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
  }
  static clearSession(immediate = false): void {
    sessionMemory.clear();
    immediate && ss.clear();
  }

  static clearAll(immediate = false) {
    sessionMemory.clear();
    localMemory.clear();
    if (immediate) {
      ls.clear();
      ss.clear();
    }
  }
}

window.addEventListener('beforeunload', function () {
  // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
  // LOCK_INFO_KEY 在锁屏和解锁时写入，此处也不应修改
  ls.set(APP_LOCAL_CACHE_KEY, {
    ...omit(localMemory.getCache, [LOCK_INFO_KEY]),
    ...pick(ls.get(APP_LOCAL_CACHE_KEY), [
      TOKEN_KEY,
      USER_INFO_KEY,
      LOCK_INFO_KEY,
    ]),
  });
  ss.set(APP_SESSION_CACHE_KEY, {
    ...omit(sessionMemory.getCache, [LOCK_INFO_KEY]),
    ...pick(ss.get(APP_SESSION_CACHE_KEY), [
      TOKEN_KEY,
      USER_INFO_KEY,
      LOCK_INFO_KEY,
    ]),
  });
});

function storageChange(e: any) {
  const { key, newValue, oldValue } = e;
  if (!key) {
    Persistent.clearAll();
    return;
  }

  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal();
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession();
    }
  }
}

window.addEventListener('storage', storageChange);

initPersistentMemory();
