import NodeModel    from "./NodeModel";
import NodeProvider from "./NodeProvider";
import Disposable from "../../Visual/src/interface/Disposable"
/**
 * 节点轴抽象类。
 *
 * @author  Alice
 * @version 1.0
 * @abstract
 */
export default abstract class NodeRender implements Disposable {
  protected model: NodeModel;
  protected container: HTMLElement;
  protected initialized: Boolean = false;
  protected accept: Function;

  public constructor(model: NodeModel) {
    this.model = model;
  }

  /**
   * 初始化方法。
   * 初始化时，需要提供一个容器和监听函数，监听函数用于当当前节点发生改变时接收通知。
   * 监听函数接收一个参数：当前节点index。
   * @param container 节点轴容器
   * @param accept 监听函数
   */
  public initialize(container: HTMLElement, accept: Function): void {
    this.container = container;
    this.accept    = accept;
  }

  public update(provider: NodeProvider): void {
    this.model.update(provider);
    this.dataChange();
  }

  /**
   * 将节点渲染到屏幕中。
   * @param index 当前节点index
   */
  public abstract render(index?: number): void;

  /**
   * 当节点轴尺寸发生改变时调用此函数重新计算相关参数。
   */
  public abstract resize(): void;

  /**
   * 重置
   */
  public abstract reset(): void;

  /**
   * 当提供节点的数据长度发送改变时，调用此函数以告知此NodeRender，以便进行相关处理。
   */
  public abstract dataChange(): void;

  /**
   * 当节点轴不在需要时，调用此函数释放资源。
   */
  public abstract dispose(): void;
}
