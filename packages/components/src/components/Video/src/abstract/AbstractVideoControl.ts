/**
 * 视频控制sdk 控制抽象类
 */

export default interface AbstractVideoControl {
  // /*检查视频厂家sdk 是否加载过 或 存在*/
  // public abstract sdkExit(): boolean;
  // /* 加载sdk*/
  // public abstract loadSdk(): void;
  // /* 卸载sdk*/
  // public abstract unloadSdk(): void;
  // public abstract init(): void;
    login(): void;
    logout(): void;
    play(): void;
    stop(): void;
  /** 销毁*/
    dispose(): void;
}
