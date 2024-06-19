import {onMounted} from "vue";
import {Measure} from "@dfsj/ol";
import {getGis, GisSymbolKey} from "/@/core/GisCache";


let measure: any = null;

export enum EMeasure {
    AREA = 'area',
    DISTANCE = 'distance',
    ANGLE = 'angle',
    NONE = null
}

export function useMeasure() {
    const type = ref();
    onMounted(() => {
        if (!measure) {
            measure = new Measure(getGis(GisSymbolKey.default))
        }
    })

    function handleDraw(t: EMeasure | any) {
        type.value = t
        measure?.stop?.()
        if (!type.value) return;
        measure.activate(type.value, {})
    }

    function handleStart() {
        measure?.deactivate?.()
        if (!type.value) return;
        measure.activate(type.value, {})
    }

    //停止
    function handleStop() {
        console.log('...', measure)
        type.value = null
        measure?.deactivate?.()
    }

    function handleClear() {
        measure?.clear()
    }


    function dispose() {
        measure?.dispose();
        measure = null
    }


    return {
        dispose,
        handleClear,
        handleDraw,
        handleStart,
        handleStop
    }
}