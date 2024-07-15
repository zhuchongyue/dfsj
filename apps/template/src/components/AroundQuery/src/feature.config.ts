import {deepMerge} from "@dfsj/utils";
import getLayerConfig from "@/core/adapter/config/layer.feature.config.ts";
import {aroundQueryCluster} from "@/components/AroundQuery/src/api.ts";

function loader(options:any) {
    const params = {
        uuid: options.uuid,
        box: options.extent,
        // zoom: options.zoom,
        // cluster: false
    }
    return aroundQueryCluster(params).then((data: any) => {
        if (data.clusterList) {
            data.clusterList.forEach((item: any) => {
                if (item.motype == 14 && item.clusterType == 0) {
                    item.topoid = item.data.eacId;
                }
            })
            return data.clusterList
        }
    })
}

const style = {
    image: (item:any) => `/images/layer/${item.motype}/${item.wlevel || 0}.png`,
    scale: (item:any) => {
        if (item.motype == 633) {
            return 0.1
        } else {
            return 0.5
        }
    },
    label: {
        font: "14px arial",
        color: "black",
        offset: [0, 25],
        outlineWidth: 3,
        outlineColor: "white",
        text: (v:any) => v.monm || v.stnm || v.label || v.name,
        zooms: [0, 8],
    },
}
const highlight = deepMerge({...style}, {
    scale: (item:any) => {
        if (item.motype == 633) {
            return 0.2
        } else {
            return 0.7
        }
    },
    label: {
        color: "#ff00ff",
        text: (item:any) => item.monm || item.stnm || item.label || itemname,
    },
})

export const getAroundQueryLayerConfig = (item: any) => {
    return getLayerConfig({
        id: item.id,
        custom:{...item},
        loader:loader,
        highlight:highlight,
        normal:style,
        listener:true
    })
}