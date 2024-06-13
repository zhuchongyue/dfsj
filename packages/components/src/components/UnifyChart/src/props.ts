import propTypes from '../../../utils/propTypes';

/**
 * chart渲染需要的数据
 * echarts图表自定义修改的options配置（可选）
 * data是需要渲染的接口数据
 * height:图表范围区域的高度
 * width:图表范围区域的宽度
 * target:当前站点的详细属性数据（可选）
 */

export interface Convert {
  createOptions: Function; //生成
  transform: Function; //转换结果
}

export const unifyChartProps = {
  data: propTypes.object.def({}),
  options: propTypes.object.def({}),
  width: propTypes.string.def('100%'),
  height: propTypes.string.def('100%'),
  target: propTypes.object.def({}),
  //其它转换处理
  convert: Object as () => Convert,
  datasource: propTypes.object.def({}),
  toolbox: Array as () => Array<IToolbox>,
  chartHooks: propTypes.func,
  //状态
  stateful: propTypes.object.def({}),
};

/**
 * 当前选项卡需要的数据
 *
 * */

interface Options {
  loader: Function;
  condition: Object;
}

export const compProps = {
  target: propTypes.object.def({}),
  options: Object as () => Options,
};

export type useLoaderProps = {
  target: Object;
  options: Options;
};

/**
 * 图表工具箱
 */
export enum EToolbox {
  Download = 0,
  Statistic = 1,
  Table = 2,
}
export type EToolboxKeys = keyof typeof EToolbox;
//@ts-ignore
export type IToolbox = EToolbox[EToolboxKeys];
// export type IToolbox = EToolbox[keyof EToolbox];
export const toolboxProps = {
  instance: propTypes.object.def({}),
  iconSize: propTypes.number.def(28),
  toggleTable: propTypes.func,
  toggleStatistic: propTypes.func,
  toolbox: Array as () => Array<IToolbox>,
};
