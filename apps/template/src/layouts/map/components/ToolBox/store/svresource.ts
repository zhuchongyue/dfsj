import { defineStore } from 'pinia';
import { getMenuList } from '/@/api/common';

import { store } from '/@/store/index';

interface StaticVisualResourceState {
  checked: Array<any>;
  cacheSource: Array<any> | null;
}
export const useStaticVisualResourceStore = defineStore('playable', {
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
export function useStaticVisualResourceStoreWithOut() {
  return useStaticVisualResourceStore(store);
}
