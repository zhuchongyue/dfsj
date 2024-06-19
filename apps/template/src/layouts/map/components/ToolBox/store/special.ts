import { defineStore } from 'pinia';
import { store } from '/@/store/index';
import {getMenuList} from "@/api/user.ts";

interface StaticVisualResourceState {
  checked: Array<any>;
  cacheSource: Array<any> | null;
}
export const useSpecialResourceStore = defineStore('special', {
  state: (): StaticVisualResourceState => ({
    checked: [],
    cacheSource: null,
  }),
  getters: {
    async resource(state) {
      state.cacheSource = state.cacheSource || await getMenuList({ module: 2 })
      return state.cacheSource
    },
  },
  actions: {},
});
export function useSpecialResourceStoreWithOut() {
  return useSpecialResourceStore(store);
}
