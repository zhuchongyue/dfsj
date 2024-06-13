/**
 * 用于控制节点的接口（可自动播放）。
 *
 * @author    Alice
 * @version   1.0
 */
export default interface NodePlayer {

  /**
   * 获取当前的播放状态。
   */
  get playing(): boolean;

  /**
   * 开始播放。
   */
  play(): void;

  /**
   * 停止播放。
   */
  stop(): void;

  /**
   * 重置播放。
   */
  reset(): void;

  /**
   * 后退一帧
   * > 如果当前帧处于第一帧:
   * 如果 {@link NodeProvider} 可以扩展头部，则进行扩展；
   * 否则, 如果 {@link loop} 为true, 则跳转到第一帧；
   * 否则停止播放。
   *
   * @param loop 是否允许循环播放
   */
  backward(loop?: boolean): void;

  /**
   * 前进一帧.
   * >
   * 如果当前帧处于最后一帧:
   * 如果 {@link NodeProvider} 可以扩展尾部，则进行扩展；
   * Else, if {@link loop} is true, then jump to first node,
   * Else, stop play.
   *
   * @param loop If true,jump to first node when at last node and {@link NodeProvider} can extend tail.
   */
  forward(loop?: boolean): void;

  /**
   * 跳转到指定帧。
   * 如果index<0或者index>count（总帧数），则表示指定帧超出范围，会对数据进行扩展（头部/尾部）；
   * 否则，跳转到指定帧，并调整边界。
   * @param index 指定帧索引
   */
  jump(index: number): void;

}