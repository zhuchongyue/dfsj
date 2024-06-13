import propTypes from '../../../utils/propTypes';

/**
 * 状态组件
 */
export const DEFAULT_STATES = {
  error: { tag: 'Icon', label: '出错了...', image: 'mdi:alert', color: 'info' },
  empty: {
    tag: 'Icon',
    label: '暂无数据...',
    image: 'mdi:information',
    color: 'info',
  },
  loading: {
    tag: 'Icon',
    label: '加载中...',
    image: 'svg-spinners:blocks-shuffle-3',
    color: 'info',
  },
};
export const statefulProps = {
  value: propTypes.oneOfType([propTypes.object, propTypes.number, propTypes.string]),
  contentClass: String,
  states: propTypes.object.def(DEFAULT_STATES),
};
