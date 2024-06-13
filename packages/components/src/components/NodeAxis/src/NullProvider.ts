import NodeProvider from "./NodeProvider";
import {NodeAxis}   from "./types";

export default class NullProvider implements NodeProvider {

  public static readonly SINGLETON: NodeProvider = Object.freeze(new NullProvider());

  private constructor() {}

  get count(): number {
    return 0;
  }


  get extensible(): number {
    return 0;
  }

  get extent(): NodeAxis.Extent {
    return [0, 0, 0];
  }

  extends(direction: number, minimum?: number): Promise<number> {
    return Promise.resolve(0);
  }

  extract(range: number[], count: number, nodes?: number[]): number[] {
    return [];
  }

  color(index: number): string {
    return "";
  }

  format(index: number, type: NodeAxis.Format): string {
    return "暂无数据";
  }

  scale(offset: number, range: number[], length: number, direction: number): number[] {
    return [0, 0];
  }

  get sections(): NodeAxis.Section[] | null {
    return null;
  }

  reset() {
  }

  dispose(): void {
  }
}