import {ComponentRenderProxy, VNode} from "vue";

declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T;
  }

  declare type Nullable<T> = T | null;

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

  export declare type Recordable<T = any, K = string> = Record<
    K extends null | undefined ? string : K,
    T
  >;

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }

    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }
}
