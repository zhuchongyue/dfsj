import {defineStore} from "pinia";
import {Menu} from "/@/router/types.ts";
import {store} from "/@/store";

interface MenuState {
    primary: Menu | null, // 当前一级导航
    secondly: Menu | null, // 当前二级导航
    tertiary: Menu | null, //三级
}

export const useMenuStore = defineStore("app-menu", {
    state: () => ({
        primary: void 0, // 当前一级导航
        secondly: void 0, // 当前二级导航
        tertiary: void 0, //三级
    }),
    actions: {},
});

// 需要在设置之外使用
export function useMenuStoreWithOut() {
    return useMenuStore(store);
}
