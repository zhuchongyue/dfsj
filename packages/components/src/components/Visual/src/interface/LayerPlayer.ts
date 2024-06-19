/**
 * 图层播放器接口，用于播放图层。
 * @author    Aslan
 * @version   1.0
 */
export default interface LayerPlayer {
  /**
   * 播放下一帧图层。
   */
  backward();
  /**
   * 播放上一帧图层。
   */
  forward();
  /**
   * 跳转到指定的图层索引。
   * @param index 图层索引
   */
  jump(index: number);
  /**
   * 隐藏或者显示本播放器管理的所有图层
   * @param value true则显示，false则因此
   */
  visible(value: boolean);
  /**
   * 根据图层index获取图层状态。
   *
   * 可能的状态值：
   * <li>ready: 图层已创建，但是还没有加载.</li>
   * <li>loading: 图层正在加载中.</li>
   * <li>success: 图层已成功加载.</li>
   * <li>error: 图层加载失败.</li>
   *
   * @param index 图层索引
   * @return 图层状态
   */
  status(index: number): string;
  /**
   * 更新所有图层。不同的实现更新策略不一样。
   */
  update(index:number): void;
  /**
   * 删除所有图层，已叠加到地图中的图层会被移除。所引用的资源会被释放。
   */
  clear();
  dispose();
}
