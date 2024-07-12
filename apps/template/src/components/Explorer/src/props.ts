import {propTypes} from '@dfsj/utils';

/**
 * 当前选项卡需要的数据
 *
 * */

interface Options {
  loader: propTypes.func;
  condition: propTypes.object;
}

export const compProps = {
  target: propTypes.object.def({}),
  options: Object as () => Options,
  refresh: propTypes.func.def(()=>{}),
};

