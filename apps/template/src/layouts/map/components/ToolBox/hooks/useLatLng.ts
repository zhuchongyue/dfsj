import {onBeforeUnmount, onMounted, reactive, toRefs} from "vue";
import {getGis, GisSymbolKey} from "/@/core/GisCache";
import * as EcOl from "@dfsj/ol";

export function useLatLng() {
    const coordinate = reactive({
        lat: 0,
        lng: 0
    })

    function handleMove(ev: any) {
        const movement = ev?.movement;
        const [lng, lat] = movement?.coordinate
        coordinate.lat = lat?.toFixed(4);
        coordinate.lng = lng?.toFixed(4);
    }

    onMounted(() => {
        setTimeout(() => {
            console.log('map',getGis(GisSymbolKey.default))
            getGis(GisSymbolKey.default) && getGis(GisSymbolKey.default).on(EcOl.MouseEventType.POINTER_MOVE, handleMove)
        }, 3000)
    })


    onBeforeUnmount(() => {
        getGis(GisSymbolKey.default) && getGis(GisSymbolKey.default).un(EcOl.MouseEventType.POINTER_MOVE, handleMove)
    })

    return {
        coordinate
    }

}