export declare namespace NodeAxis {
  export type Format = "short" | "long" | "title";
  export type Layout = "horizontal" | "vertical";
  export type Bounds = { left: number, top: number, right: number, label: number, length: number };
  export type Section = { range: number[], color: string };
  export type Direction = { FORWARD: 1, BACKWARD: -1 };
  export type Extent = [start: number, ended: number, index: number];
  export declare function Accept(index: number): void;
  export declare type NodeOptions = {
    background?: string,
    width: number | string,
    height: number | string,
    jump?: boolean,
    draggable?: boolean,
    translation?: boolean,
    edgeAdjust?: number | string,
    overlay?: {
      enabled?: boolean,
      empty?: string,
    },
    track?: {
      left?: number | string,
      top?: number | string,
      right?: number,
      height?: number,
      color?: string,
    },
    node?: {
      enabled?: boolean,
      size?: number,
      count?: number,
      minCount?: number,
      color?: string,
      outlineWidth?: number,
      outlineColor?: string,
      shadow?: string,
    },
    cursor?: {
      size?: number,
      color?: string,
      outlineWidth?: number,
      outlineColor?: string,
    },
    scale?: {
      enabled?: boolean,
      limit?: [start: number, end: number],
    },
    progress?: {
      enabled?: boolean,
      color?: string,
    },
    label?: {
      enabled?: boolean,
      top?: number | string,
      font?: string,
      color?: string,
    },
  }

  export declare type PlayOptions = {
    interval?: number,
    loop?: boolean
  }
}