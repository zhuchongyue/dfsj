import {ref, reactive,Ref} from "vue";
import {PiniaPlugin} from "pinia";
export type WindowOptions = {
    id: string | null;
    title?: string;
    sizes?: [number|string, number|string];
    group?: string;
    icon?: string;
    attrs?: object;
    offset?: object;
    config?: object;
    content: string | Function;
    transition?: any[];
    onSubmit?: Function;
    onCancel?: Function;
    modally?: boolean,
    prevent?: boolean,
    maximizer?: boolean,
    header?:boolean,
    footer?:boolean,
};
export interface WindowState {
    items: WindowOptions[];
    front: Ref<string | null>;
    layer: number;
}
export interface WindowActions {
    open: (options: WindowOptions) => any;
    hide: (id: string) => void;
    once: (options: WindowOptions) => Promise<any>;
    clear: (group?: string) => void;
}

export type WindowPiniaPlugin = {
    state: WindowState;
} & WindowActions

export default function install(): PiniaPlugin {
    const state:WindowState = {
        items: reactive([]),                // All window object(Opened).
        front: ref<string |null>(null),             // An id point to foremost window.
        layer: 2000,       // Default css z-index.
    }
    const actions:WindowActions = {
        open: (options: WindowOptions) => {
            let window = state.items.find((e: any) => e.id === options.id);
            if (window != null) {
                state.front.value = options.id;
                return Object.assign(window, options);
            }
            if (options.content) {
                // @ts-ignore
                setTimeout(() => state.items.push(options), 0);
            }
        },
        hide: (id: string) => {
            let index = state.items.findIndex((e: any) => e.id === id);
            if (index >= 0) {
                state.items.splice(index, 1);
            }
        },
        once: (options: WindowOptions): Promise<any> => {
            return new Promise(((resolve, reject) => {
                actions.open({
                    //@ts-ignore
                    id: Math.random().toString(16),
                    modally: true,
                    prevent: false,
                    maximizer: false,
                    ...options,
                    onSubmit: resolve,
                    onCancel: reject,
                })
            }));
        },
        clear: (group?: string) => {
            if (group == null) {
                return state.items.splice(0);
            }
            let items = state.items.map((item, index) => (item.group === group) ? index : -1).filter(i => i >= 0);
            if (items.length > 0) {
                items.sort((a, b) => b - a);
                items.forEach(index => state.items.splice(index, 1));
            }
        },
    }
    const plugin = {window: {state, ...actions}};
    return () => plugin;
}
