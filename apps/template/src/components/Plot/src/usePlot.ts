import {getGis, GisSymbolKey} from "@/core/GisCache.ts";
import {MouseEventType, Plot, VectorLayer} from "@dfsj/ol";
import {onBeforeUnmount, onMounted, ref} from "vue";
import PropFactory from "@/components/Plot/src/class/PropFactory.ts";

export function usePlot(giskey = GisSymbolKey.default, config = {}, options = {
    editable: true,
    propEditRef:null
}) {
    let receiveLayer:any;
    let map:any;
    let plot:any;
    const overlayId = ref(null);
    const refuse = ref(false);
    onMounted(() => {
        receiveLayer = new VectorLayer('ol-plot-layer');
        map = getGis(giskey);
        if (!map) return;
        plot = new Plot(map, config);
        map.addLayer(receiveLayer);
        if (options.editable) receiveLayer.on(MouseEventType.CLICK, (e: any) => {
            if (e?.movement?.overlay) {
                const overlay = e?.movement?.overlay;
                overlayId.value = overlay.attr?.id;
                const propEditor = PropFactory.create(overlay?.attr?.type, {})
                options.propEditRef?.value?.show?.(true, propEditor)
                plot.edit(overlay, (graph) => {
                    if (!refuse.value){
                        receiveLayer.addOverlay(graph);
                    };
                    refuse.value = false;
                    options.propEditRef?.value?.show?.(false,{})
                });
                receiveLayer.removeOverlay(overlay)
            }
        })
    })
    onBeforeUnmount(() => {
        dispose()
    })

    function startPlot(type,options?) {
        plot?.stop?.()
        overlayId.value = null
        if (!type) return;
        console.log('开始标绘的图像', type, plot,)
        plot.draw(
            type,
            (overlay, others) => {
                console.log('绘制完成的回调函数', overlay,)
                overlay && receiveLayer.addOverlay(overlay);
            },
            {
                style: options?.style,
                // buffer: 10,
                // buffer: 10,
                popup: false
            }
        )
    }

    function stop() {

    }

    function editPlot() {

    }

    function dispose() {
        if (!map || !receiveLayer) return;
        map?.removeLayer(receiveLayer);
        plot?.dispose?.()
        receiveLayer = null;
        map= null;
        plot= null;
        overlayId.value = null;
    }

    function getPlotOverlays() {
        return receiveLayer?.getOverlays()
    }
    function getEditOverlay() {
        if (!overlayId.value) return undefined;
        return receiveLayer?.getOverlaysByAttr('id',overlayId.value)
    }

    function setStyle(style) {
        plot?.setStyle(style)
    }

    /**
     * 删除当前的
     */
    function delPlot() {
        refuse.value = true;
        plot?.stop?.();
        overlayId.value = null;
    }

    /**
     * 清除所有的
     */
     function clearPlot() {
        refuse.value = true;
        plot?.stop?.()
        receiveLayer?.clear?.()
        overlayId.value = null;
    }

    return {
        startPlot,
        stop,
        editPlot,
        dispose,
        overlayId,
        getPlotOverlays,
        getEditOverlay,
        setStyle,
        delPlot,
        clearPlot
    }


}