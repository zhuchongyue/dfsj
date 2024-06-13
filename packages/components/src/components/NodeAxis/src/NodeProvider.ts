import Disposable from "../../Visual/src/interface/Disposable";
import {NodeAxis} from "./types";

/**
 * The interface for node axis data provider.
 * All provider must implement this interface.
 * @author    Aslan
 * @version   1.1
 */
export default interface NodeProvider extends Disposable {

  /**
   * Get the range and index([start,end,index]).
   * The extent may modify by stage or player.
   *
   * <p>
   * <b color='red'>Note: You must store this value. Because this value will modify by outer.</b>
   * </p>
   * <p>
   * <b color='red'>Note: If you change the data size, you must adjust the extent value for keep to same.</b>
   * </p>
   * @return The extent object, include start,ended and index.
   */
  get extent(): NodeAxis.Extent;

  /**
   * Get the total node count.
   * @return number
   */
  get count(): number;

  /**
   * [Optional]
   * Get the mark sections, section can mark to axis.
   *
   * Each section has those value:
   * <li>section.range:Array The mark range, array, include min and max node index.</li>
   * <li>section.color:string The mark color(CSS Color).</li>
   *
   * <b>In every render at stage, this method will be call. So, if sections not change, you must cache it.</b>
   *
   * @return the mark sections.
   */
  get sections(): NodeAxis.Section[] | null;

  /**
   * [Optional]
   * Get the extends value, if provider is extensible.
   *
   * The extends meas that we can change provider data dynamic. Append data to tail or insert data to head.
   *
   * The extensible value must be one of:
   * <li>0: Not extensible.</li>
   * <li>1: Can extend on head.</li>
   * <li>2: Can extend on tail.</li>
   * <li>3: Can extend on head and tail.</li>
   *
   * @return The extend value
   */
  get extensible(): number;

  /**
   * [Optional]
   * Get the node css color of current node index.
   * @param index The current node index.
   * @return The css color at index.
   */
  color(index: number): string;

  /**
   * [Optional]
   * Extract the nodes by given scale range([start,end]) and split for mark the key node.
   *
   * @param range The current index range.
   * @param count The key node count.
   * @param nodes? The old nodes.
   * @return The key nodes indices.
   */
  extract(range: number[], count: number, nodes?: number[]): number[];

  /**
   * [Optional]
   * Scale the current nodes if enabled scale.
   * When mouse wheel, current nodes will change. This method will compute an new node range as percent.
   *
   * @param offset  Mouse left offset pixel at track.
   * @param range  The current node range as percent([min,max]).
   * @param length The track length.
   * @param direction  The scale direction. 1 for zoom in, -1 for zoom out.
   * @return The scaled new range as percent([min,max]).
   */
  scale(offset: number, range: number[], length: number, direction: number): number[];

  /**
   * Get formatted text by specify index and type.
   * The type argument passable value is:
   * <li>long: The longer format string, use for tooltip.</li>
   * <li>short: The short format string, use for key node label.</li>
   * <li>title: The title format string, may other use.</li>
   *
   * @param index The node index.
   * @param type The format type.
   *
   * @return the formatted string.
   */
  format(index: number, type: NodeAxis.Format): string;

  /**
   * Extend the provider's nodes minimum steps at least.
   *
   * <b color='red'>The extend can by asynchronous.</b>
   *
   * If you extends for backward, you must adjust the extent.
   * Like:
   * ```
   *   NodeMath.translation(extent, newCount - oldCount);
   * ```
   *
   * @param direction The extend direction, -1 for head, 1 for tail.
   * @param minimum The minimum node count should extend, by default use extent[1]-extent[0].
   * @return The extended node count. If provider is not extensible, return same count.
   */
  extends(direction: number, minimum?: number): Promise<number> | number;

  /**
   * [Optional]
   * Reset this provider, range and index reset to initialization value.
   * This method may call by outer.
   */
  reset(): void;

  /**
   * [Optional]
   * Release all resource of this provider.
   */
  dispose(): void;
}
