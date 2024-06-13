import Disposable      from "../../Visual/src/interface/Disposable";
import assign          from "./utils/assign";
import {render as def} from "./config/node-axis.options";
import NodeProvider    from "./NodeProvider";
import NullProvider    from "./NullProvider";
import {NodeAxis}      from "./types";

/**
 * 一个存储{@link NodeRender}数据的模型类（Model）.
 */
export default class NodeModel implements Disposable {
  public options: NodeAxis.NodeOptions;
  public nodes: number[];                     // 关键节点索引
  public limit             = [0.01, 100];     // 缩放限制（仅启用缩放时有效）
  public scale: number[];                     // 缩放值
  public dragging: boolean = false;           // 拖动标志
  public pressed: boolean  = false;           // 鼠标按下标志
  public index: number     = 0;               // 当前节点索引
  public range: number[];                     // 当前节点范围索引
  public press: number[]   = [0, 0];          // 鼠标按下坐标xy
  public right: boolean    = false;           // 是否右键按下标志
  public bounds: NodeAxis.Bounds;             // canvas绘制边界
  public height: number    = 0;               // 绘制区高度
  public width: number     = 0;               // 绘制区宽度
  public provider: NodeProvider;              // 数据提供器
  public extent: NodeAxis.Extent;             // 当前显示的节点边界[start，end，index]

  constructor(options: NodeAxis.NodeOptions) {
    this.options = assign({}, def, options);
    this.update(NullProvider.SINGLETON);
  }

  /**
   * 更新数据提供器（不要直接调用，请使用{@link NodeRender.update(provider)}）。
   * @param provider 数据提供器.
   */
  public update(provider: NodeProvider): void {
    this.provider       = provider;
    const options: any  = this.options;
    const count: number = provider.count;
    const extent        = this.extent = provider.extent;
    this.scale          = count ? [extent[0] / count * 100, extent[1] / count * 100] : [0, 100];
    if (count > 0 && options.node?.enabled) {
      this.nodes = this.provider.extract(extent, options.node.count, this.nodes);
    }
  }

  /**
   * 重置数据提供器，恢复至初始值。
   * 不要直接调用，请使用{@link NodeRender.reset()}方法。
   */
  public reset(): void {
    const provider = this.provider;
    const options  = this.options;
    this.provider.reset();
    this.extent = provider.extent;
    if (provider.count > 0 && options.node?.enabled) {
      this.nodes = provider.extract(provider.extent, options.node?.count, this.nodes);
    }
  }

  public dispose(): void {
    this.nodes.length = 0;
  }
}