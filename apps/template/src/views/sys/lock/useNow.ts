import { dateUtil } from '/@/utils/dateUtil';
import { reactive, toRefs } from 'vue';
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core';
import {useAppSyncTimeStateWithOut} from "/@/store/modules/syncTime";

export function useNow(immediate = true) {
  let timer: IntervalHandle;

  const state = reactive({
    year: 0,
    month: '0',
    week: '',
    day: '0',
    hour: '',
    minute: '',
    second: 0,
    meridiem: '',
  });

  const update = () => {
    const now = dateUtil(useAppSyncTimeStateWithOut().getDate());
    // const now = dateUtil(useAppStoreWithOut().serverTime)

    const h = now.format('HH');
    const m = now.format('mm');
    const s = now.get('s');

    state.year = now.get('y');
    state.month = String(now.get('M') + 1).padStart(2, '0');
    state.week = '星期' + ['日', '一', '二', '三', '四', '五', '六'][now.day()];
    state.day = String(now.get('date')).padStart(2, '0');
    state.hour = h;
    state.minute = m;
    state.second = s;

    state.meridiem = now.format('A');
  };

  function start() {
    update();
    clearInterval(timer);
    timer = setInterval(() => update(), 1000);
  }

  function stop() {
    clearInterval(timer);
  }

  tryOnMounted(() => {
    immediate && start();
  });

  tryOnUnmounted(() => {
    stop();
  });

  return {
    ...toRefs(state),
    start,
    stop,
  };
}
