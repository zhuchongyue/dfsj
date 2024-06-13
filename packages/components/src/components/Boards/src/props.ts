import propTypes from '../../../utils/propTypes';
import {AsyncComponentLoader} from 'vue';
export type BoardItem = {
    id: string | number; // 组件id
    label: string; // 组件标签（用于显示）
    props?: any; // 组件属性
    content: AsyncComponentLoader; // 具体组件（异步）
};
export type BoardState = {
    items: BoardItem[]; // 抽屉组件所要显示的具体组件配置
    state: 'minify' | 'spread' | 'hidden'; // 抽屉状态
    index: number; // 当前显示组件索引
    value: string | number; // 当前显示组件id
};
/**
 * 自定义样式   设置定位和偏移
 */
export type CustomStyle = {
    margin?: [string | number, string | number, string | number, string | number];
    fixed?: [string | number, string | number, string | number, string | number];
    color?:string
}
/**
 * 支持的位置方向
 */
export enum BoardPosition {
    EAST = 'east', //东  (右)
    TOP = 'top',//上  (上)
    WEST = 'west',//西 (左)
    SOUTH = 'south',//南 (下)
    FULL = 'full',//全屏 (全屏)
}
export const BoardProps = {
    position: propTypes.oneOf(['east', 'top', 'west', 'south', 'full']).def('east'),
    board: {
        type: Object as () => BoardState,
        default: () => ({items: [], index: 0, value: null, state: 'spread'}),
    },
    customStyle: {
        type: Object as () => CustomStyle,
        default: () => ({
            margin: [],
            fixed: [],
            color:'red'
        }),
    }
};
