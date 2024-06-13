import {DateTime}     from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";
export type Coordinate = [lon: number, lat: number];
export type Extent = [xMin: number, yMin: number, xMax: number, yMax: number];
/**
 * 定义图层对象（由于各平台图层对象不同，因此定义为any）
 */
export type Layer = any;
/**
 * 定义图层配置根对象
 */
export interface LayerConfig {
  url?: string,                     // 图层url
  type: string,                     // 图层类型：wms、wmts、group等
  name?: string,                    // 图层名称
  zIndex?: number,                  // 图层层级
  custom?: { [key: string]: any },  // 自定义图层参数
  layers?: LayerConfig[],           // 子图层（当type为group时使用）
  extent?: Extent,                  // 图层边界
  opacity?: number,                 // 透明度
  minzoom?: number,                 // 最小缩放值
  maxzoom?: number,                 // 最大缩放值
  tileSize?: [width: number, height: number],
  projection?: string,              // 图层所用的投影
  serverType?: string,              // 地图服务类型
  subdomains?: string[]             // 多域名使用
  crossOrigin?: string,             // 跨域选项
  wrapX?: boolean,

  [key: string]: any
}
export declare namespace Visual {
  export declare type PlayerOptions = {
    buffer: number,
    opacity: number,
  }
  /**
   * 节点信息。
   */
  export declare type NodeInfo = {
    time?: DateTime,      // 节点时间对象
    unit?: DateUnit,      // 节点时间单位
    step?: number,        // 节点时间步长
    extend?: any[],       // 来自服务端的扩展属性
    [key: string]: any    // 其他属性
  }

  export declare type Condition = {
    time?: string
  };

  export declare type DateRange = [start: DateTime, end: DateTime];

  export declare type DateUnit = DateTimeUnit | "xun";
  /**
   * 将节点信息转换为字段的配置（field-value属性对）
   */
  export declare type Transform = {
    /**
     * 字段名称
     */
    field: string,
    /**
     * 字段表达式，用于图层查询
     */
    pattern: string,
    /**
     * 时间偏移量，查询时取当前节点时间+偏移时间。
     * 单位：毫秒
     */
    offset: number,

    /**
     * 当节点时间与当天相同时，如果节点小时小于split，则offset设置为0
     */
    split: number
  };

  export declare type Node = {
    type: "interval",  //定值：interval
    /**
     * 时间范围：[开始时间（毫秒/字符串，包含），结束时间（毫秒|字符串，包含）]
     * 如：["2019-01-01","2019-05-01"]
     */
    range: [start: string, end: string],
    /**
     * 时间间隔，默认为1
     */
    interval: number,
    /**
     * 时间单位符号，与luxon相同：
     * hours|days|years|...
     *
     * 注意，如果时间间隔为旬，则符号为P
     */
    symbol: DateUnit,
    /**
     * 用于按固定格式获取图层的模板查询字符串，其形式为：field=pattern。
     * field为查询字段，pattern为模板字符串({@see module:@ec/js#message})。
     * pattern支持旬查询，如：YYYY-MM-p，其中p为旬的占位符（其值为：0为上旬，1为中旬，2为下旬）。
     */
    transform: Transform[],
    format: {
      /**
       * 用于标签显示的格式化字符串。
       */
      short: string,
      /**
       * 用于获取节点的描述信息：长
       */
      long: string,
      /**
       * 用于全局标题的文本格式化配置
       */
      title: string
    },
    /**
     * 用于指示该时间段是何种时期，可选值为以下之一：
     * history:历史
     * short:短临
     * long:中长
     * trend:趋势
     * forecast:预报
     * 该值是用于在播放条中进行标记，如果不需要标记，则不设置该值。
     */
    period?: "history" | "short" | "long" | "trend" | "forecast",
    /**
     * 用于图层的直接查询参数。
     */
    layer: LayerConfig
  }
  export declare type Resolvable = {
    /**
     * 指定初始节点。
     */
    index: number,
    /**
     * [Optional]
     * 指定初始范围。如果没有指定此选项，则根据availableNodeCount计算。
     * 格式：[start, end]。
     */
    range: [start: number, end: number],
    /**
     * [Optional]
     * 播放条中初始范围节点配置。
     * 可选：
     * Number：固定数量，即指定固定数量的初始节点；
     * Array：指定当前节点左边数量和右边数量（[left,right]）
     *
     * [Note] availableNodeCount 和 range 只需要提供一种即可！
     */
    availableNodeCount: [left: number, right: number],
    /**
     * 节点集合。
     */
    nodes: Node[]
  }
}

