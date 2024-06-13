/**
 * 一个与Node相关的静态帮助类。
 * @author    Aslan
 * @version   1.1
 * @static
 */
export default class NodeMath {

  /**
   * 根据滑槽长度、节点范围和index计算相对x坐标。如果当前节点范围只有一个节点，那么x为滑槽中心。

   * @param index 要计算坐标的index.
   * @param range 当前节点范围
   * @param length 滑槽长度（像素单位）
   * @return index的相对x坐标
   */
  static offset(index: number, range: number[], length: number): number {
    if (range[1] - range[0] <= 1) {
      return length >> 1;
    }
    return ((index - range[0]) / (range[1] - range[0] - 1)) * length;
  };

  /**
   * 根据相对坐标、当前节点范围和滑槽长度计算对于坐标的index。
   * 计算公式为:
   * ```typescript
   * index = (offset * count) / width + start
   *```
   * @param offset 相对滑槽的x坐标
   * @param range 当前节点范围([起始节点index,结束节点index]).
   * @param length 滑槽长度.
   * @return {number} 对应坐标的index值。
   */
  static index(offset: number, range: number[], length: number) {
    return Math.round(offset * (range[1] - range[0] - 1) / length + range[0]);
  }

  /**
   * 限制value在最小值和最大值之间（均不包含）
   * @param value 当前值.
   * @param min 最小值
   * @param max 最大值
   * @return 截取后的值
   */
  static clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
  }

  /**
   * 将数组{@link element}中的数据限定到某个范围{@link limit}。
   * 注：数组均只有两个元素。
   * @param element 被限制的数组
   * @param limit 限制值
   * @return {@link element}
   */
  static clampArray(element: number[], limit: number[]): number[] {
    element[0] = Math.max(element[0], limit[0]);
    element[1] = Math.min(element[1], limit[1]);
    return element;
  }

  /**
   * 根据缩放值计算当前节点范围。
   * @param scale 缩放值（[左缩放值，右缩放值]）.
   * @param count 总节点数量.
   * @param accept 接收数组
   * @return 当前节点范围
   */
  static toRange(scale: number[], count: number, accept: number[] = []) {
    accept[0] = Math.round(scale[0] / 100 * count);
    accept[1] = Math.round(scale[1] / 100 * count);
    return accept;
  }

  /**
   * 判断某个数组{@link r1}的元素值是否在某个范围{@link r2}。
   * @param r1 目标数组
   * @param r2 限制数组
   * @return 如果均在范围内则返回true，否则false
   */
  static inRange(r1: number[], r2: number[]): boolean {
    return !((r2[0] < r1[0] && r2[1] <= r1[0]) || (r2[0] >= r1[1] && r2[1] >= r1[1]));
  }

  /**
   * 判断两个数组的元素是否相等。
   * ###Note: 每个数组均只有两个元素。
   * @return {boolean} 如果都等则返回true，否则false
   */
  static equals(r1: number[], r2: number[]) {
    return r1[0] === r2[0] && r1[1] === r2[1];
  }

  /**
   * 根据百分比计算数值。
   * * 如果{@link value}是一个数字，则直接返回；
   * * 如果{@link value}是一个百分比，则返回{@link value}*{@link size}；
   * * 如果{@link value}为null，则返回{@link def}。
   * @param value 百分比或者数组
   * @param size 总大小
   * @param def 默认值
   * @return 最终值
   */
  static valueBy(value: string | number, size: number, def?: number): number {
    if (typeof value === "string" && /%$/.test(value)) {
      return Number(value.substring(0, value.length - 1)) / 100 * size;
    }
    return value == null ? <number>def : Number(value);
  }

  /**
   * 平移节点：将节点中指定范围的数据加/间某个数。
   * @param nodes 被平移的节点数组
   * @param step 平移步数（正数或者负数）
   * @param start 起始节点，默认为0
   * @param count 要平移的节点数量（注意不是索引），默认为全部节点
   */
  static translation(nodes: number[], step: number, start: number = 0, count: number = nodes?.length) {
    for (let i = start + count - 1; i >= 0; i--) (nodes[i] += step);
  }

  /**
   * 等距（尽量）从某个节点范围中抽取一定数量的节点（索引）。
   *
   * @param range 节点范围
   * @param count 抽取数量
   * @param accept 接收数组
   * @return 抽取的节点索引
   */
  static extract(range: number[], count: number, accept: number[] = []): number[] {
    accept.length = 0;
    let length    = range[1] - range[0];
    if (length === 1) {
      accept[0] = range[0];
    } else if (length <= count) {
      for (let i = 0; i < length; i++) accept.push(range[0] + i);
    } else {
      let factor = (count - 1) / (length - 1);
      for (let i = 0; i < length; i++) {
        if (Math.floor((i - 1) * factor) !== Math.floor(i * factor)) {
          accept.push(range[0] + i);
        }
      }
    }
    return accept;
  }

  /**
   * 根据参数重新计算缩放值。缩放值的计算与鼠标指向的位置有关。
   *
   * ###缩放方法来自百度图表的缩放算法。
   *
   * @param offset 鼠标指向的x坐标
   * @param range 当前节点范围
   * @param length 滑槽长度
   * @param direction 缩放方向（1为放大，-1为缩小）
   * @param rate 缩放比例, 默认为1.2.
   * @param accept 接收数组
   * @return 新缩放值
   */
  static scale(offset: number, range: number[], length: number, direction: number, rate: number = 1.2, accept: number[] = []): number[] {
    let percent = offset / length * (range[1] - range[0]) + range[0];
    let factor  = direction < 0 ? 1 / rate : rate;
    accept[0]   = (range[0] - percent) * factor + percent;
    accept[1]   = (range[1] - percent) * factor + percent;
    return accept;
  }
}
