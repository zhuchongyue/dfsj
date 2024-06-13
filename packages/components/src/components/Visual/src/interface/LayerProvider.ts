import {Visual}     from "../types";
import NodeProvider from "../../../NodeAxis/src/interface/NodeProvider"
/**
 * 图层提供器接口，用于图层播放。
 * @author    Aslan
 * @version   1.0
 */
export default interface LayerProvider extends NodeProvider {

  /**
   * 根据index获取图层对象（已实例化的图层对象，不是图层配置信息）.
   * @param index {Number} 图层index.
   * @return {Object} 图层对象.
   */
  get(index: number): Promise<object>;

  /**
   * 根据条件查询图层index。
   * @param query 查询条件
   */
  find(query: Visual.Condition): number;

  /**
   * 根据index获取节点信息，如果index超出范围，则返回undefined。
   * @param index 节点index
   */
  getNodeInfo(index: number): Visual.NodeInfo | undefined;
}

