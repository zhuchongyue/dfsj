//@ts-ignore
import {DateTime}     from "luxon";
import {NodeAxis}     from "../../../NodeAxis/src/types";
import {LayerConfig}  from "../types";
import LayerResolver  from "../interface/LayerResolver";
import {Visual}       from "../types";
import {getCount}     from "./tools.resolver";
import {toFormat,getFormatDate}     from "./tools.resolver";
export const EMPTY_STRING   = Object.freeze("");
/**
 * 基于时间范围的图层播放解析器.
 * @author    Aslan
 * @version   1.1
 */
export default class IntervalResolver implements LayerResolver {

  protected options: any;
  protected injection: any;
  protected range: Visual.DateRange;
  protected step: number;
  protected unit: Visual.DateUnit;
  protected transform: Visual.Transform[];
  protected layer: any;
  protected total: number;

  constructor(options: Visual.Node, injection: any) {
    this.options   = options;
    this.injection = injection;
    this.transform = options.transform;
    this.step      = options.interval;
    this.unit      = options.symbol;
    this.layer     = options.layer;
    this.range     = <Visual.DateRange>options.range.map(e => DateTime.fromSQL(e));
    this.total     = getCount(this.range, this.unit, this.step);
  }

  get count(): number {
    return this.total;
  }

  get period(): string {
    return this.options.period;
  }

  get isAutoExtensible(): boolean {
    return true;
  }

  get(index: number): LayerConfig {
    let name      = this.format(index, "short");
    let custom    = this.getQuery(index);
    let injection = this.injection;
    if (this.layer.type === "group") {
      return {
        injection,
        type: "group",
        opacity: this.layer.opacity,
        layers: this.layer.layers.map(layer => Object.assign({name}, layer, {custom})),
      };
    }
    return Object.assign({name, injection}, this.layer, {custom});
  }

  getNodeInfo(index: number): Visual.NodeInfo {
    return Object.assign(this.getNodeInfoByTime(this.getTime(index)), {
      extend: this.options.extend,
      fields: this.getQuery(index),
      layer: this.options.layer,
    });
  }

  format(index: number, type: NodeAxis.Format): string {
    let pattern: string = this.options.format[type];
    if (pattern != null) {
      return toFormat(pattern, this.getNodeInfo(index));
    }
    return EMPTY_STRING;
  }

  formatByInject(index: number, type: NodeAxis.Format,finalFormat:string): string {
    let pattern: string = this.options.format[type];
    if (pattern != null) {
      return getFormatDate(pattern, this.getNodeInfo(index),finalFormat);
    }
    return EMPTY_STRING;
  }

  find(query: Visual.Condition): number | null {
    if (query.time != null) {
      let target = DateTime.fromSQL(query.time),
          begin  = this.range[0];
      if (this.unit === "xun") {
        return Math.round(target.diff(begin, "month").months * 3);
      }
      return Math.round(target.diff(begin, this.unit).get(this.unit) / this.step);
    }
    return null;
  }

  extends(direction: number, minimum: number): number {
    const side = direction < 0 ? 0 : 1,
          unit = this.unit,
          step = this.step,
          time = this.range[side];

    this.range[side] = time.plus({[unit]: minimum * direction * step});
    this.total += minimum;
    return minimum;
  }

  dispose() {
    this.options   = null;
    this.transform = null;
    this.injection = null;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // protected members
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  protected getQuery(index: number): any {
    let time = this.getTime(index);
    let now  = DateTime.fromMillis(Date.now());
    return this.transform.reduce((model: any, item) => {
      let clone = time, offset = item.offset;
      if (clone.hasSame(now, "day") && clone.hour < item.split) offset = 0;
      if (offset) clone = clone.plus({"millisecond": offset});
      model[item.field] = toFormat(item.pattern, this.getNodeInfoByTime(clone));
      return model;
    }, {});
  }

  protected getNodeInfoByTime(time: DateTime): Visual.NodeInfo {
    return {
      time: time,
      unit: this.unit,
      step: this.step,
      ...this.injection,
    };
  }

  protected getTime(index: number): DateTime {
    if (index === 0) {
      return this.range[0];
    }
    return this.range[0].plus({[this.unit]: index * this.step});
  }
}
