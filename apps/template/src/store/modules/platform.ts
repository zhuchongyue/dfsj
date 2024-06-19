import {defineStore} from 'pinia';
import {store} from '/@/store';
import {Persistent} from '/@/utils/cache/persistent';
import {PLATFORM_INS_KEY} from "@/enums/cacheEnum.ts";
import {GisPlatformEnum} from "@/enums/appEnum.ts";
import {toRaw} from "vue";

/**
 * 用来储存2 3维平台的东西
 * 多实例
 * 1、
 *  gisKey:示例唯一标识，getGis对应获取
 *  platform  该实例的模式，2维还是3维
 *  ready  是否初始化成功
 *  playable 时间轴是否初始化成功
 *  mapIndex 第几个底图图层
 */
interface Instance {
    gisKey: string | symbol,
    ready: boolean;
    playable: boolean;
    mapIndex: number;
    platform: GisPlatformEnum | string
}

interface PlatformState {
    instance: Array<Instance> | [];
}

export const usePlatformStore = defineStore({
    id: 'platform',
    state: (): PlatformState => ({
        instance: Persistent.getLocal(PLATFORM_INS_KEY) ?? []
    }),
    getters: {
        getInstance(state):Array<Instance> | [] {
            if (state.instance.length) return state.instance;
            return Persistent.getLocal(PLATFORM_INS_KEY) ?? []
        }
    },
    actions: {
        setInstance(gisKey: symbol | string, properties: Partial<Instance> = {}) {
            let exit = this.getInstance.find((ins) => ins.gisKey == gisKey.toString());
            if (exit) {
                let index = this.getInstance.findIndex((ins) => ins.gisKey == gisKey.toString());
                this.instance[index] = {
                    ...toRaw(exit),
                    ...properties
                }
            } else {
                //@ts-ignore
                this.instance.push({gisKey:gisKey.toString(), ...properties})
            };
            Persistent.setLocal(PLATFORM_INS_KEY, this.instance, true);
        },
        getGisKeyInstance(gisKey:symbol | string){
            return this.instance.find((ins)=>ins.gisKey == gisKey.toString());
        }
    },
});

// Need to be used outside the setup
export function usePlatformStoreWithOut() {
    return usePlatformStore(store);
}
