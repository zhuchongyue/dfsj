/**
 * NOTE  本地时间与服务器时间同步的store 状态管理
 */
import { defineStore } from 'pinia';

import { store } from '/@/store';
import { formatToDateTime } from '/@/utils/dateUtil';

interface AppSyncTimeState {
  // serverTime: number | string | null | undefined;
  diffMillisecond: number;
}

export const useAppSyncTimeStore = defineStore({
  id: 'app-sync-time',
  state: (): AppSyncTimeState => ({
    // serverTime: null,
    diffMillisecond: 0,
  }),
  getters: {
    serverTime():any {
      return new Date().getTime() + this.diffMillisecond;
    },
  },
  actions: {
    getCurrentTime() {
      return new Date().getTime();
    },
    syncTime(time: Date | string | number) {
      if (!time) {
        this.diffMillisecond = 0;
        return;
      }
      let syncTime: any = Number.NaN;
      if (typeof time === 'number') {
        syncTime = time;
      } else {
        syncTime = time instanceof Date ? time?.getTime() : Date.parse(time);
      }
      if (Number.isNaN(syncTime)) {
        return;
      }
      console.log('服务器时间：', formatToDateTime(syncTime));
      console.log('客户端时间：', formatToDateTime(this.getCurrentTime()));
      this.diffMillisecond = syncTime - this.getCurrentTime();
      console.log('时间偏移:', this.diffMillisecond);
      console.log('获取时间:', this.getDate());
    },
    getTime(): number {
      return this.getCurrentTime() + this.diffMillisecond;
    },
    getDate(): Date {
      return new Date(this.getTime());
    },
  },
});
export function useAppSyncTimeStateWithOut() {
  return useAppSyncTimeStore(store);
}
