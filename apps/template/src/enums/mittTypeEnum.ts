/** 底图的链接事件*/
export enum EMapLink {
  OVERLAY_CLICK = 'OVERLAY_CLICK', //覆盖物点击事件
}
export enum EMapSwitch {
  /**
   * @description  切换底图
   * */
  SWITCH = 'MAP_SWITCH',
}
/***
 * 图层显示标题
 */
export enum EMittLayerTitle {
  /**
   * @description 显示图层信息
   * */
  SHOW = 'LAYER_TITLE_SHOW',
  /**
   * @description 隐藏图层信息
   * */
  HIDE = 'LAYER_TITLE_HIDE',
}
/***
 *  图例显示
 */
export enum EMittLayerLegend {
  /**
   * @description 显示图例
   * */
  SHOW = 'LAYER_LEGEND_SHOW',
  /**
   * @description 隐藏图例
   * */
  HIDE = 'LAYER_LEGEND_HIDE',
}
/***
 *  播放轴 事件
 */
export enum EMittLayerPlayable {
  /**
   * @description 激活
   * */
  VISUAL_PLAYABLE_ATTACH = 'VISUAL_PLAYABLE_ATTACH',
  /**
   * @description 取消激活
   * */
  VISUAL_PLAYABLE_DETACH = 'VISUAL_PLAYABLE_DETACH',
  /**
   * @description 过滤（自定义参数、图例过滤）
   * */
  VISUAL_PLAYABLE_FILTER = 'VISUAL_PLAYABLE_FILTER',
  /**
   * @description 清除
   * */
  VISUAL_PLAYABLE_CLEARS = 'VISUAL_PLAYABLE_CLEARS',
  /**
   * @description 跳跃时间节点
   * */
  VISUAL_PLAYABLE_JUMPTO = 'VISUAL_PLAYABLE_JUMPTO',
  /**
   * @description 节点外部通知
   * */
  VISUAL_PLAYABLE_FRAME = 'VISUAL_PLAYABLE_FRAME',
}

/**
 * 调度刷新
 */
export enum EMittDispatch {
  REFRESH = 'REFRESH',
  CONFIG_PROGRAMME_LIST_REFRESH = 'CONFIG_PROGRAMME_LIST_REFRESH', //配置管理列表刷新<配置保存以后刷新>
}
