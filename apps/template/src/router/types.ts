import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { defineComponent } from 'vue';
import {MenuModel} from "@/api/model/list.model.ts";

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
export type Menu  = MenuModel;
export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}
// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw;
