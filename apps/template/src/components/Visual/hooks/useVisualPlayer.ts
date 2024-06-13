import {computed, ref, Ref, shallowRef, toRaw, unref, watchEffect} from "vue";
import {Extensible,TimeModes} from "@dfsj/components/src/components/NodeAxis/src/enum";
import NullLayerProvider  from "@dfsj/components/src/components/NodeAxis/src/NullLayerProvider";
import {ResolvableLayerProvider}  from "@dfsj/components/src";
import {visualPlayableLoadApi} from "@/components/Visual/api/api.ts";
import {VisualContent} from "@/components/Visual/VisualContent";
import {emitter} from "@dfsj/utils";
import dayjs from "dayjs";
import {GisSymbolKey} from "@/core/GisCache.ts";
import {EMittLayerLegend} from "@/enums/mittTypeEnum.ts"
const ModeMap = {
    [TimeModes.DAILY]: 'datatype',
    [TimeModes.INTERVAL]: 'rangeid',
    [TimeModes.STATISTIC]: 'anytimeable',
};
export function useVisualPlayer(key:Symbol=GisSymbolKey.default){
    let renderer:any = null;
    let player:any = shallowRef(null);
    const provider: Ref<any> = shallowRef(null);
    const index = ref(0);
    const playing = ref(false);
    const loading = ref(false);
    const timeMode = ref(TimeModes.DAILY);
    const current = shallowRef(null)
    const controls = computed(() => {
        const extensible = provider.value?.extensible;
        const count = provider.value?.count;
        const idx = index.value;
        return count < 2
            ? null
            : {
                prev: (extensible & Extensible.HEAD) !== 0 || idx > 0,
                next: (extensible & Extensible.TAIL) !== 0 || idx < count - 1,
                play: idx < count - 1,
            };
    });

    function register(r:{renderer:any,player:any}) {
        renderer = r.renderer
        player.value = r.player
    }

    /**
     * 主要干预一些配置信息（type:feature 、 wms 、 wmts）
     * @param config
     */
    function interceptor(config) {
        if (config.type === 'feature') {
            const viewparams = config.custom?.viewparams;
            const splitArray = viewparams?.split(';');
            const obj: any = {};
            for (let i = 0; i < splitArray?.length; i++) {
                if (splitArray[i].split(':')[0]) {
                    obj[splitArray[i].split(':')[0]] = splitArray[i].split(':')[1];
                }
            }
            const custom = Object.assign({ ...config.injection }, config.custom, {
                mode: timeMode.value,
            });
            if (obj && obj.pubs) {
                custom.start = dayjs(obj.pubs * 1000).format('YYYY-MM-DD 00:00:00');
                custom.end = dayjs(obj.pubs * 1000).format('YYYY-MM-DD 24:00:00');
            }
            // return Object.assign(config, getLayerConfig(current.value.origin.motype, custom))
            // let cfg = Object.assign(
            //     config,
            //     getLayerConfig({
            //         motype: current.value.origin.motype,
            //         custom,
            //     })
            // );
            console.log(
                '%c主要干预一些配置信息 ',
                'color:#fff;font-size:20px;width:200px;background-color:red'
            );
            return config;
        }

        return config;
    }

    /** 请求节点配置信息*/
    function load(
        content: VisualContent,
        mode: any = TimeModes.DAILY,
        apiFn: Function = visualPlayableLoadApi
    ) {
        content.player?.clear();
        loading.value = content.loading = true;
        timeMode.value = mode;
        let query: any = {
            datatype: content.origin[ModeMap[mode]],
            isLan: 0,
        };
        if (mode === TimeModes.STATISTIC) {
            query.startTime = content.times[0];
            query.endTime = content.times[1];
        }
        current.value = content;
        apiFn(query)
            .then((data: any) => {
                if (!data || !data.nodes?.length) {
                    content.provider = NullLayerProvider.SINGLETON;
                } else {
                    content.provider = new ResolvableLayerProvider(
                        null,
                        data,
                        content.injection,
                        interceptor
                    );
                    console.log('content.provide', content.provider);
                    // content.player = null
                    // content.player = BufferLayerPlayerStrategy.create(content.provider);
                }
                // if (content === current.value) {
                console.log('cossntent', content);
                provider.value = content.provider;
                renderer.update(content.provider);
                renderer.render();
                // }
                return content;
            })
            .finally(() => {
                loading.value = content.loading = false;
            });
    }

    /** 上一帧*/
    function onBackward() {
        if (!controls.value || !controls.value.prev) {
            console.log('disable');
        } else {
            let provider = current.value?.provider;
            if (provider?.extent[2] === 0) {
                current.value?.player?.clear?.();
            }
            toRaw(unref(player)).backward();
        }
    }

    /** 下一帧*/
    function onForward() {
        if (!controls.value || !controls.value.next) {
            console.log('disable');
        } else {
            toRaw(unref(player)).forward();
        }
    }

    /** 重置*/
    function onReset() {
        if (!controls.value) {
            console.log('disable');
        } else {
            current.value?.player?.clear?.();
            toRaw(unref(player)).reset();
        }
    }

    /** 播放 停止播放*/
    function togglePlay() {
        if (!controls.value || !controls.value.play) {
            console.log('disable');
        } else {
            playing.value ? toRaw(unref(player)).stop() : toRaw(unref(player)).play();
            playing.value = !playing.value;
        }
    }

    watchEffect(()=>{
        console.log('controls',controls.value)
    })
    /**
     * 设置节点变化  更新index  接受外部的回调函数
     */
    function onFrame(frame: any, callBack = () => {}) {
        console.log(
            '---------------------时间点变化--------------------------',
            frame,
        );
        const cur = current.value;
        console.log('cur',current)
        console.log('cur',current.value)
        const pvd = cur?.provider;
        console.log({ cur, pvd });
        if (pvd?.count > 0) {
            index.value = frame;
            console.log('cur.playe', cur.player);
            cur?.player?.jump(frame);
            callBack && callBack?.(cur, pvd);
        }
    }
    /** 变化实例*/
    function onChangeInstance(content: VisualContent) {
        if (!content) return;
        console.log('变化实例content', content);
        provider.value = content.provider;
        current.value = content;
        // loading.value      = content.loading;
        loading.value = content.loading;
        // buttons.value      = content.buttons;
        // timeMode.value = content.id as any;
        renderer.update(content.provider);
        // store.note.emit("visual.playable.switch", content);
        // store.note.emit("visual.legend.show", content.origin.legend);
        emitter.emit(EMittLayerLegend.SHOW + key.toString(), content.origin.legend);
        renderer.render();
    }


    return {
        controls,
        register,
        loading,
        load,
        togglePlay,
        onReset,
        onForward,
        onBackward,
        onFrame,
        playing,
        current,
        player,
        onChangeInstance
    }

}