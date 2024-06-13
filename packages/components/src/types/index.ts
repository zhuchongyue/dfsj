//@ts-ignore
import {ComponentRenderProxy, VNode} from "vue";
//@ts-ignore
export type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>;
export type Fn   = any
export type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>;
export type Nullable<T> = T | null;
export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
export type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger';
export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type IntervalHandle = ReturnType<typeof setInterval>;