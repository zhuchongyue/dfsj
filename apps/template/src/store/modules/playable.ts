/**
 * NOTE 记录时间轴选中的时间日期   某些情况查询的时间需要和时间轴保持一致   因为是非关联的组件  所以保持至状态管理方便统一使用。
 */
import {defineStore} from 'pinia';

import {store} from '/@/store/index';

interface CommonTime {
    start: string | null;
    end: string | null;
}

interface PlayableState {
    hydrology: CommonTime;
}

export const usePlayableStore = defineStore('playable', {
    state: (): PlayableState => ({
        hydrology: {start: null, end: null},
    }),
    actions: {},
});

export function usePlayableStoreWithOut() {
    return usePlayableStore(store);
}
