import NodeProvider from "./NodeProvider";
import NodeMath     from "../../Visual/src/utils/NodeMath";
import {NodeAxis}   from "./types";

/**
 * A public abstract node provider class.
 * In this class, we implement two class witch is {@link extract} and {@link scale}.
 * @author  Alice
 * @version 1.0
 * @public  abstract
 */
export default abstract class AbstractNodeProvider implements NodeProvider {

  public extract(range: number[], count: number, nodes?: number[]): number[] {
    return NodeMath.extract(range, count, nodes);
  }

  public scale(offset: number, range: number[], length: number, direction: number): number[] {
    return NodeMath.scale(offset, range, length, direction);
  }

  public abstract get count(): number;

  public abstract color(index: number): string;

  public abstract extends(direction: number, minimum?: number): Promise<number> | number;

  public abstract get extensible(): number;

  public abstract get extent(): NodeAxis.Extent;

  public abstract format(index: number, type: NodeAxis.Format): string;

  public abstract get sections(): NodeAxis.Section[] | null;

  public abstract reset();

  public abstract dispose(): void;
}
