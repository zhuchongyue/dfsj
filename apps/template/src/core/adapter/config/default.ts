// TODO 默认的样式
import Define from "@/config/Define.ts";
import { merge } from 'lodash-es';
import {visualPlayableFeatureApi} from "@/api/layer.ts";
const defaultStyle = {
    rotation: (v) => v.rotate,
    image: (v) => {
        let image = `/images/layer/${v.motype}/${v.wlevel || 0}.png`;
        if (v.motype === Define.Resource.HYDROLOGY_STATION) {
            // 河道水文站 sttp -- ZQ 水文站 ZZ 水位站
            image = `/images/layer/15/${v.wlevel || v.sttp}.png`;
        }
        return image;
    },
    scale: 0.5,
    label: {
        font: '14px arial',
        offset: [0, 25],
        outlineWidth: 3,
        outlineColor: 'white',
        color: '#00abdf',
        text: (v) => {
            // return 'test-text';
            if (v.motype == 4) {
                return v.monm || v.stnm || v.label || v.name;
            } else {
                // return v.monm;
                return '';
            }
        },
        zooms: [0, 100],
    },
};

const ModeMap: any = { daily: 2, interval: 1 };
// TODO 默认的高亮颜色
const defaultHighlight = merge({}, defaultStyle, {
    scale: 0.9,
    label: {
        offset: [0, 30],
        color: '#ff00ff',
    },
});
const defaultLoader =(options: any = {}, cancelKey = '')=> {
    const params = {
        motype: options.motype,
        type: { motype: options.motype, sttypes: options.filter?.sttypes },
        area: options?.user?.adcd,
        box: options.extent,
        scale: -1,
        wlevel: options.filter.legend ?? -1,
        start: options.start,
        sumtype: ModeMap[options.mode],
        end: options.end,
    };
    return visualPlayableFeatureApi(params, cancelKey);
}
export {
    defaultHighlight,
    defaultStyle,
    defaultLoader,
    ModeMap
}