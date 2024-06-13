import {emitter} from "@dfsj/utils"
import {EMittLayerPlayable} from "@/enums/mittTypeEnum.ts"
import {shallowRef, toRaw, unref} from "vue";
import {EMittLayerTitle} from "@/enums/mittTypeEnum.ts";
import {EMittLayerLegend} from "@/enums/mittTypeEnum.ts";
import {getVisualContent} from "@/components/Visual/utils/visual.ts";

export function useVisualManager({
                                     key,
                                     load,
                                     onChangeInstance,
                                     current,
                                     player
                                 }) {
    const multiContent = shallowRef([]);
    /** 激活时间线*/
    function onVisualAttach(origin) {
        console.log('接收事件', origin)
        const id = origin.id;
        let content = multiContent.value.find((e) => e.id === id);
        if (content == null) {
            content = getVisualContent(origin);
            multiContent.value.push(content);
        }
        if (id !== current.value?.id) {
            if (Reflect.has(origin,'modes')){
                load(content,origin.modes);
            }else{
                load(content);
            }
            onChangeInstance(content);
        }
    }

    /** 取消激活时间线*/
    function onVisualDetach(id:string) {
        let index = multiContent.value.findIndex((e) => e.id === id);
        if (index >= 0) {
            let [content] = multiContent.value.splice(index, 1);
            if (content) content.player?.dispose();
            if (multiContent.value.length === 0) {
                onVisualClears();
            } else if (index > 0) {
                onChangeInstance(multiContent.value[index - 1]);
            } else {
                onChangeInstance(multiContent.value[0]);
            }
        }
    }

    /** 图例等过滤条件*/
    function onVisualFilter(filter:object) {
        console.log('current.value', current.value, filter);
        if (current.value === null || !current.value.injection) return;
        Object.assign(current.value.injection, { filter });
        current.value?.player.update();
    }

    /** 清除时间线*/
    function onVisualClears() {
        console.log('onVisualClears');
        multiContent.value?.forEach((e) => e.player?.dispose());
        multiContent.value.length = 0;
        current.value?.player?.dispose();
        emitter.emit(EMittLayerTitle.HIDE+key.toString());
        emitter.emit(EMittLayerLegend.HIDE+key.toString());
    }

    /** 多个时间线切换*/
    function onVisualJumpTo(time: string) {
        let index = current.value.provider?.find({ time });
        if (index != null) {
            if (index < 0 || index > current.value.provider.count) {
                current.value?.player?.clear();
            }
            toRaw(unref(player)).jump(index);
        }
    }

    onMounted(() => {
        emitter.on(EMittLayerPlayable.VISUAL_PLAYABLE_ATTACH + key.toString(), onVisualAttach);
        emitter.on(EMittLayerPlayable.VISUAL_PLAYABLE_DETACH + key.toString(), onVisualDetach);
        emitter.on(EMittLayerPlayable.VISUAL_PLAYABLE_FILTER + key.toString(), onVisualFilter);
        emitter.on(EMittLayerPlayable.VISUAL_PLAYABLE_CLEARS + key.toString(), onVisualClears);
        emitter.on(EMittLayerPlayable.VISUAL_PLAYABLE_JUMPTO + key.toString(), onVisualJumpTo);
    });

    onUnmounted(() => {
        emitter.off(EMittLayerPlayable.VISUAL_PLAYABLE_ATTACH + key.toString(), onVisualAttach);
        emitter.off(EMittLayerPlayable.VISUAL_PLAYABLE_DETACH + key.toString(), onVisualDetach);
        emitter.off(EMittLayerPlayable.VISUAL_PLAYABLE_FILTER + key.toString(), onVisualFilter);
        emitter.off(EMittLayerPlayable.VISUAL_PLAYABLE_CLEARS + key.toString(), onVisualClears);
        emitter.off(EMittLayerPlayable.VISUAL_PLAYABLE_JUMPTO + key.toString(), onVisualJumpTo);
    });
    return {
        multiContent
    }
}