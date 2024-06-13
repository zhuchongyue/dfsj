import {Layer}       from "../types";
import {LayerConfig} from "../types";

/**
 * 图层工厂，个平台图层创建都需要实现此接口。
 *
 * @author    Alice
 * @version   1.0
 */
export default interface LayerFactory {

  /**
   * 根据一个（或多个）配置创建一个（或多个）图层对象。
   * #注意：创建图层为异步创建。
   *
   * @param options 图层配置（支持多个）
   */
  create(options: LayerConfig | LayerConfig[]): Promise<Layer | Layer[]>;
}