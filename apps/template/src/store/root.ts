import {defineStore} from "pinia";
import {store} from "/@/store/index";

export const  useRootStore = defineStore("root", {
  state: () => ({}),
  actions: {
  }
});
export function useRootStoreWithOut() {
  return useRootStore(store);
}
