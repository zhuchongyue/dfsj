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
    const overlayId = ref(null)
    onMounted(() => {
        receiveLayer = new VectorLayer('ol-plot-layer');
        map = getGis(giskey);
        plot = new Plot(map, config);
        map.addLayer(receiveLayer);
        if (options.editable) receiveLayer.on(MouseEventType.CLICK, (e: any) => {
            if (e?.movement?.overlay) {
                const overlay = e?.movement?.overlay;
                overlayId.value = overlay.attr?.id;
                const propEditor = PropFactory.create(overlay?.attr?.type, {})
                options.propEditRef?.value?.show?.(true, propEditor)
                plot.edit(overlay, (graph) => {
                    receiveLayer.addOverlay(graph);
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
        receiveLayer?.off?.(MouseEventType.CLICK);
        map.removeLayer(receiveLayer);
        plot?.dispose?.()
        receiveLayer = null;
        map= null;
        plot= null;
        overlayId.value = null;
    }

    function getPlotOverlays() {
        return receiveLayer?.getPlotOverlays()
    }
    function getEditOverlays() {
        console.log('overlayId.value',overlayId.value)
        if (!overlayId.value) return undefined;
        return receiveLayer?.getOverlaysByAttr('id',overlayId.value)
    }

    function setStyle(style) {
        plot?.setStyle(style)
    }

    return {
        startPlot,
        stop,
        editPlot,
        dispose,
        overlayId,
        getPlotOverlays,
        getEditOverlays,
        setStyle
    }


}