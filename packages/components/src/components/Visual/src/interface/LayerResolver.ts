import {NodeAxis}    from "../../../NodeAxis/src/types";
import {LayerConfig, Visual} from "../types";
/**
 * The resolver for resolve to layer options from options.
 *
 * @author  Aslan
 * @author  2.0
 * @interface
 */
export default interface LayerResolver {
  /**
   * Get the node count.
   * @return
   */
  get count(): number;

  /**
   * Get the period.
   * @return
   */
  get period(): string;

  /**
   * Test this resolver is extensible or not.
   * @return  If is extensible, return true, else return false.
   */
  get isAutoExtensible(): boolean;

  /**
   * Get the layer options by node index. The index is relative by this resolver.
   *
   * @param index  The node index in current resolver.
   * @return The layer options.
   */
  get(index: number): LayerConfig;

  /**
   * Get the layer query config.
   * @param index The node index.
   */
  getNodeInfo(index: number): Visual.NodeInfo;

  /**
   * Get the label information at index.
   * @param index The node index in current resolver.
   * @param type The format type.
   * @return  The label information.
   */
  format(index: number, type: NodeAxis.Format):any;
  find(query: Visual.Condition): number | null;
  /**
   * Extend the node by step, and return the new node count.
   *
   * @param direction The extends direction: 1 for head -1 for tail.
   * @param minimum  The minimum count should extend.
   * @return The extended node count(not total count).
   */
  extends(direction, minimum): number;
  dispose();
}
