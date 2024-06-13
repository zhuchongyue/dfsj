/**
 * The interface for node axis data provider.
 * All provider implements must extends this provider.
 * @author    Aslan
 * @version   1.1
 * @interface
 */
export default class NodeProvider {

  /**
   * Get the range and index([start,end,index]).
   * The extent may modify by stage or player.
   *
   * If you changed the extent value, you must call the listener to notify who register by {@link activate}.
   *
   * <p>
   * <b color='red'>Note: You must store this value. Because this value will modify by outer.</b>
   * </p>
   * <p>
   * <b color='red'>Note: If you change the data size, you must adjust the extent value for keep to same.</b>
   * </p>
   * @return {Number[]} The range and index.
   */
  get extent() {
    return null;
  }

  /**
   * Get the total node count.
   * @return Number
   */
  get count() {
    return null;}

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
   * @return Array<Object> the mark sections.
   */
  get sections() {
    return null;}

  /**
   * [Optional]
   * Get the extend value, if provider is extensible.
   *
   * The extend meas that we can change provider data dynamic. Append data to tail or insert data to head.
   *
   * The extensible value must be one of:
   * <li>0: Not extensible.</li>
   * <li>1: Can extend on head.</li>
   * <li>2: Can extend on tail.</li>
   * <li>3: Can extend on head and tail.</li>
   *
   * @return {Number} The extend value
   */
  get extensible() {
    return null;}

  /**
   * [Optional]
   * Get the node css color of current node index.
   * @param index {Number} The current node index.
   * @return {String} The css color at index.
   */
  color(index) {}

  /**
   * [Optional]
   * Extract the nodes by given scale range([start,end]) and split for mark the key node.
   *
   * @param range {Number[]} The current index range.
   * @param split {Number} The key node count.
   * @param nodes {Number[]} The old nodes.
   * @return {Number[]} The key nodes index.
   */
  extract(range, split, nodes) {}

  /**
   * [Optional]
   * Scale the current nodes if enabled scale.
   * When mouse wheel, current nodes will change. This method will compute an new node range as percent.
   *
   * @param offset {Number} Mouse left offset pixel at track.
   * @param range {Number[]} The current node range as percent([min,max]).
   * @param length {Number} The track length.
   * @param direction {Number} The scale direction. 1 for zoom in, -1 for zoom out.
   * @return {Number[]} The scaled new range as percent([min,max]).
   */
  scale(offset, range, length, direction) {}

  /**
   * Get formatted text by specify index and type.
   * The type argument passable value is:
   * <li>long: The longer format string, use for tooltip.</li>
   * <li>short: The short format string, use for key node label.</li>
   * <li>title: The title format string, may other use.</li>
   *
   * @param index {Number} The node index.
   * @param type {"short"|"long"|"title"} The format type.
   *
   * @return {String} the formatted string.
   */
  format(index, type) {}

  /**
   * [Optional]
   * Yield the provider if it's happening something.
   *
   * This method call when provider switch before.
   */
  yield() {}

  /**
   * [Optional]
   * Activate this provider, if you want update the stage, call action.
   *
   * The action function has one number argument, that is 'extend'.
   *
   * When:
   * <li>Node count change by {@link extends} on head, 'extend' = oldCount-newCount. </li>
   * <li>Node count change by {@link extends} on tail, 'extend' = newCount-oldCount. </li>
   * <li>If just {@link extent} changed, 'extend' = 0.</li>
   * <li>If just want to update stage, 'extend' = null.</li>
   *
   * @param action {function(extend:Number)} The action for notify.
   */
  activate(action) {}

  /**
   * Extend the provider's node minimum steps at least.
   *
   * <b color='red'>The extend can by asynchronous.</b>
   *
   * If you extends for backward, you must adjust the extent.
   * Like:
   * <pre>
   *   NodeMath.translation(extent, newCount - oldCount);
   * </pre>
   *
   * @param direction {Number} The extend direction, -1 for head, 1 for tail.
   * @param minimum {Number?} The minimum node count should be extends, by default use extent[1]-extent[0].
   * @return {Number|Promise<Number>} The new node count. If provider is not extensible, return same count.
   */
  extends(direction, minimum) {}

  /**
   * [Optional]
   * Reset this provider, range and index reset to initialization value.
   * This method may call by outer.
   */
  reset() {}

  /**
   * [Optional]
   * Release all resource of this provider.
   */
  dispose() {}
}
