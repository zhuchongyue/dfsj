import dayjs from "dayjs";
import {tools} from "@dfsj/echarts";
import {units} from "@dfsj/echarts";
import Define from "@/config/Define.ts";
import {findStRiverRByDate} from "@/api/common.ts"
import {usePlayableStoreWithOut} from "@/store/modules/playable.ts";

const layerFeatureOverlays ={
    427: {
        title: (data) => data?.wrnm,
        content: (data) => {
            return `<fieldset>
                <li><i>天气：</i><i>${data?.phenomena}</i></li>
                <li><i>温度：</i><i>${data?.temperature ?  data?.temperature + '℃' : '--'}</i></li>
                <li><i>湿度：</i><i>${data?.humidity || '--'}</i></li>
                <li><i>气压(kPa)：</i><i>${data?.pressure / 1000}</i></li>
                <li><i>风向：</i><i>${data?.winddire}（${data.windpower}）</i></li>
                <li><i>风速：</i><i>${data?.windspeed || ''}</i></li>
                <li><i>时间：</i><i>${data?.tm || ''}</i></li>
              </fieldset>`;
        },
    },
    // // 水库
    1: {
        title: (data) => data.monm,
        content: (data) => {
            const unit = units.find((e) => data.w >= e.value) || units[2];
            const value = data.w
                ? tools.numeralFormat(unit.value ? data.w / unit.value : data.w)
                : '--';
            const tm = data?.tm
                ? dayjs(data?.tm).format('YYYY-MM-DD HH:mm:ss')
                : '--';
            // prettier-ignore
            return `<fieldset>
                <li><i>站点编码：</i><i>${data.stcd}</i></li>
                <li><i>库水位：</i><i>${data.rz == null ? '--' : data.rz}(m)</i></li>
                <li><i>预警情况：</i><i style="color:${Define?.reservoirColor?.[data?.wlevel]}">${data.warning || '--'}</i></li>
                <li><i>库容：</i><i>${value}(${unit.symbol})</i></li>
                <li><i>规模：</i><i>${Define?.reservoirLevel?.[data?.sttype]}</i></li>
                <li><i>时间：</i><i>${data.tm || '--'}</i></li>
                <li><i>地址：</i><i>${data.address || '--'}</i></li>
                <li><i>数据来源：</i><i>${data.datasource || '--'}</i></li>
              </fieldset>`
            // prettier-ignore
        },
    },
    15: {
        title: (data) => data.stnm,
        loader: (target) => {
            const rang = usePlayableStoreWithOut().hydrology;
            const start = rang?.start ?? dayjs().format('YYYY-MM-DD 00:00:00');
            const end = rang?.end ?? dayjs().format('YYYY-MM-DD 24:00:00');
            const params = {
                stcd: target?.stcd,
                start: start,
                end: end,
                over: ['-9', '-10'].includes(target?.wlevel) ? -1 : null, // 枯水时
            };
            // return findStRiverRByDate(params);
            return target
        },
        content: (data) => {
            const tm = data?.tm
                ? dayjs(data?.tm).format('YYYY-MM-DD HH:mm:ss')
                : '--';
            // prettier-ignore
            return `<fieldset>
                <li><i>站点编码：</i><i>${data.stcd}</i></li>
                <li><i>水位：</i><i>${data.z == null ? '--' : data.z} m</i></li>
                <li><i>流量：</i><i>${data.q == null ? '--' : data.q} m³/s</i></li>
                <li><i>时间：</i><i>${ tm}</i></li>
                <li><i>地址：</i><i>${data.address || '--'}</i></li>
              </fieldset>`;
            // prettier-ignore
        },
    },
    // //  雨量站
    4: {
        title: (data) => data.monm,
        loader: (target) => {
            // return data;
            // const rang = usePlayableStoreWithOut().rainPointInterval;
            // const start = rang?.start ?? dayjs().format('YYYY-MM-DD 00:00:00')
            // const end = rang?.end ?? dayjs().format('YYYY-MM-DD 24:00:00')
            // const params = {
            //     end: end,
            //     start: start,
            //     stcd: target.stcd,
            //     sumtype: 1,
            // }
            // return findPptnWithIa(params)
            return target;
        },
        content: (data) => {
            // prettier-ignore
            return `<fieldset>
                <li><i>站点编码：</i><i>${data.stcd}</i></li>
                <li><i>日雨量：</i><i>${data.drp == null ? '--' : data.drp} mm</i></li>
                <li><i>开始时间：</i><i>${data?.start || data?.st || '--'}</i></li>
                <li><i>结束时间：</i><i>${data?.end ||  data?.et ||'--'}</i></li>
                <li><i>地址：</i><i>${data?.address || '--'}</i></li>
              </fieldset>`;
            // prettier-ignore
        },
    },
};

export  default layerFeatureOverlays;