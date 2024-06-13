import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { RoleEnum } from '/@/enums/roleEnum';
import { defineComponent } from 'vue';

export type Component<T extends any = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>);

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta?: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
  alwaysShow?: boolean;
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  // name: string;
  // icon?: string;
  // path: string;
  // paramPath?: string;
  // disabled?: boolean;
  // children?: Menu[];
  // orderNo?: number;
  roles?: RoleEnum[];
  // meta?: Partial<RouteMeta>;
  // tag?: MenuTag;
  // hideMenu?: boolean;
  // alwaysShow?: boolean;
  id: number;
  module: number;
  datatype: string;
  name: string;
  icon: string;
  checked: number;
  level: number;
  pid: number;
  ordernum: number;
  configure?: any;
  sourcetype: number;
  playable: number;
  formable: number;
  fileable: number;
  export: number;
  motype?: any;
  model?: any;
  params?: any;
  checkselect: string;
  subs: Menu[];
  sttypes?: any;
  rangeid?: any;
  label: string;
  anytimeable?: any;
  dailyable: number;
  lines: number;
  typeid?: any;
  typenum?: any;
  typename?: any;

}

export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw;
