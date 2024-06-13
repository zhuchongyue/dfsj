import {Layer} from "../types";

/**
 * 图层管理器。
 *
 * @author    Alice
 * @version   1.0
 */
export default interface LayerManager {

  /**
   * 添加图层（或多个）到地图中。
   * @param layer 图层对象，来自{@link LayerFactory}
   */
  addition(layer: Layer | Layer[]): void;

  /**
   * 从地图中移除图层（或多个）。
   * @param layer 图层对象，来自{@link LayerFactory}
   */
  remove(layer: Layer | Layer[]): void;

  /**
   * 清除所有图层（不包括基础图形图层）。
   */
  clear(): void;

  /**
   * 修改图层对象，比如透明度。
   *
   * 由于各平台图层属性名称及修改方法不一致，因此需要此方法提供修改渠道。
   * @param layer 图层对象
   * @param property 要修改的图层属性
   * @param value 属性值
   */
  modify(layer: Layer, property: string, value: any): void;

  /**
   * 查询图层属性
   * @param layer 图层对象
   * @param property 图层属性
   */
  query(layer: Layer, property: string): any;
}