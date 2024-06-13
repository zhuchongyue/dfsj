import {reactive, AsyncComponentLoader} from "vue";
import {PiniaPlugin} from "pinia";
//@ts-ignore
import  {BoardPosition} from "@dfsj/components";

type P = typeof BoardPosition[keyof typeof BoardPosition];
type S = 'minify' | 'spread' | 'hidden';
type Board = {
    id: string | number // 组件唯一id  用于展示和销毁查找等
    label: string // 标签（用于显示）
    props?: { [key: string]: any } // 属性
    content: AsyncComponentLoader | Function // 组件（异步）
}
type BoardState = {
    items: Array<Board>;
    index: number;
    value: string | null;
    state: S;
};
type Actions = {
    show: (options: Board  & {
        position: P
    }) => void;
    hide: (id: string) => void;
    status: (position: P, stateX: string) => void;
    clear: (position?: P) => void;
};
export type BoardPiniaPlugin = {
    state: BoardState;
} & Actions

export default function install(): PiniaPlugin {
    const map: object | any = {};
    const state: Record<string, BoardState> = {
        east: reactive({items: [], index: 0, value: null, state: "hidden"}),
        top: reactive({items: [], index: 0, value: null, state: "hidden"}),
        west: reactive({items: [], index: 0, value: null, state: "hidden"}),
        south: reactive({items: [], index: 0, value: null, state: "hidden"}),
        full: reactive({items: [], index: 0, value: null, state: "hidden"}),
        // 占位不显示
        none: reactive({items: [], index: 0, value: null, state: "hidden"}),
    };
    const actions: Actions = {
        //@ts-ignore
        show: (options: Board & {
            position: P
        }) => {
            const place = options.position ?? map[options.id] ?? 'east';
            const board = state[place];
            const index = board.items.findIndex((e) => e.id === options.id);
            if (index > -1) {
                board.state = "spread";
                const item = board.items[index];
                if (item.props != null) {
                    Object.assign(item.props, options.props);
                }
                //@ts-ignore
                return (board.value = board.items[index].id);
            }
            board.state = "spread";
            board.items.push(options);
            board.index = board.items.length - 1;
            //@ts-ignore
            board.value = board.items[board.index].id;
            map[options.id] = place;
        },
        hide: (id: string) => {
            const place = map[id];
            const board = state[place];
            if (board == null) return;
            //查找所在位置索引
            const index = board.items.findIndex((e) => e.id === id);
            if (index > -1) {
                board.items.splice(index, 1);
            }
            //当前位置
            if (board.index == index) {
                if (index == 0) {
                    board.index = 0;
                    //@ts-ignore
                    board.value = board.items[board.index]?.id;
                } else {
                    //@ts-ignore
                    board.index = board.items.length - 1;
                    //@ts-ignore
                    board.value = board.items[board.index].id;
                }
                // 后面位置
            } else if (board.index > index) {
                board.index--;
                //@ts-ignore
                board.value = board.items[board.index].id;
                //前面位置
            }
            if (board.items.length === 0) {
                board.state = "hidden";
            }
            delete map[id];
        },
        //@ts-ignore
        status: (position: P, stateX: S) => {
            state[position].state = stateX;
        },
        clear: (position?: P) => {
            if (position != null) {
                state[position].items.forEach((e) => delete map[e.id]);
                state[position].items.length = 0;
                state[position].index = 0;
                state[position].state = "hidden";
            } else {
                Object.keys(state).forEach((place) => {
                    state[place].items.length = 0;
                    state[place].index = 0;
                    state[place].state = "hidden";
                });
                Object.keys(map).forEach((id) => delete map[id]);
            }
        },
    };
    const plugin = {board: {state, ...actions}};
    //@ts-ignore
    return () => plugin;
}
