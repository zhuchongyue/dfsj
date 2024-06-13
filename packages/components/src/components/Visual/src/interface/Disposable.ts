/**
 * 可释放资源的接口声明。
 *
 * @author  Alice
 */
export default interface Disposable {

  /**
   * 释放资源，释放后不可重用。
   */
  dispose(): void;
}
