import LayerProvider from "../../Visual/src/interface/LayerProvider";
import {NodeAxis} from "./types";
import {Visual , Layer} from "../../Visual/src/types";

export default class NullLayerProvider implements LayerProvider {

  public static readonly SINGLETON = Object.seal(new NullLayerProvider());

  private constructor() {}

  color(index: number): string {
    return "";
  }

  get count(): number {
    return 0;
  }

  dispose(): void {
  }

  extends(direction: number, minimum?: number): number | Promise<number> {
    return 0;
  }

  get extensible(): number {
    return 0;
  }

  get extent(): NodeAxis.Extent {
    return [0, 0, 0];
  }

  extract(range: number[], count: number, nodes?: number[]): number[] {
    return [];
  }

  find(query: Visual.Condition): number {
    return 0;
  }

  format(index: number, type: NodeAxis.Format): string {
    return "暂无数据";
  }

  get(index: number): Layer {
    return undefined;
  }

  getNodeInfo(index: number): Visual.NodeInfo | undefined {
    return undefined;
  }

  reset(): void {
  }

  scale(offset: number, range: number[], length: number, direction: number): number[] {
    return [];
  }

  get sections(): NodeAxis.Section[] | null {
    return undefined;
  }

  activate(action): void {
  }

  yield(): void {
  }

}