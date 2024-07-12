import dayjs from "dayjs";
import {tools, units} from "@dfsj/echarts";
import Define from "@/config/Define.ts";
import {collectSpatialDateEnum} from "@/core/adapter/config/default.ts";

const layerFeatureOverlays = {
    default: {
        content: (e: any) => e?.disastername || e?.monm || e?.label || e?.stnm || e?.name || e?.ref_position || e?.stationname || e?.location || '',
    },
    427: {
        title: (data: any) => data?.wrnm,
        content: (data: any) => {
            return `<fieldset>
                <li><i>天气：</i><i>${data?.phenomena}</i></li>
                <li><i>温度：</i><i>${data?.temperature ? data?.temperature + '℃' : '--'}</i></li>
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
        title: (data: any) => data.monm,
        content: (data: any) => {
            const unit = units.find((e) => data.w >= e.value) || units[2];
            const value = data.w
                ? tools.numeralFormat(unit.value ? data.w / unit.value : data.w)
                : '--';
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
        title: (data: any) => data.stnm,
        loader: (target: any) => {
            // const rang = usePlayableStoreWithOut().hydrology;
            // const start = rang?.start ?? dayjs().format('YYYY-MM-DD 00:00:00');
            // const end = rang?.end ?? dayjs().format('YYYY-MM-DD 24:00:00');
            // const params = {
            //     stcd: target?.stcd,
            //     start: start,
            //     end: end,
            //     over: ['-9', '-10'].includes(target?.wlevel) ? -1 : null, // 枯水时
            // };
            // return findStRiverRByDate(params);
            return target
        },
        content: (data: any) => {
            const tm = data?.tm
                ? dayjs(data?.tm).format('YYYY-MM-DD HH:mm:ss')
                : '--';
            // prettier-ignore
            return `<fieldset>
                <li><i>站点编码：</i><i>${data.stcd}</i></li>
                <li><i>水位：</i><i>${data.z == null ? '--' : data.z} m</i></li>
                <li><i>流量：</i><i>${data.q == null ? '--' : data.q} m³/s</i></li>
                <li><i>时间：</i><i>${tm}</i></li>
                <li><i>地址：</i><i>${data.address || '--'}</i></li>
              </fieldset>`;
            // prettier-ignore
        },
    },
    // //  雨量站
    4: {
        title: (data: any) => data.monm,
        loader: (target: any) => {
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
        content: (data: any) => {
            // prettier-ignore
            return `<fieldset>
                <li><i>站点编码：</i><i>${data.stcd}</i></li>
                <li><i>日雨量：</i><i>${data.drp == null ? '--' : data.drp} mm</i></li>
                <li><i>开始时间：</i><i>${data?.start || data?.st || '--'}</i></li>
                <li><i>结束时间：</i><i>${data?.end || data?.et || '--'}</i></li>
                <li><i>地址：</i><i>${data?.address || '--'}</i></li>
              </fieldset>`;
            // prettier-ignore
        },
    },
    [collectSpatialDateEnum.HABITATION_POLYGON]: {
        title: (data: any) => data?.householder_name,
        loader: (target: any) => {
            return target;
        },
        content: (data: any) => {
            // prettier-ignore
            return `<fieldset> 
                <li><i>名称：</i><i>${data?.householder_name ?? '--'}</i></li> 
                <li><i>编码：</i><i>${data?.resident_code || '--'}</i></li>
              </fieldset>`;
            // prettier-ignore
        },
    },
    // 景区
    1301: {
        loader: target => {
            return target
        },
        title: data => data.label || data.monm || '',
        content: data => {
            return `<fieldset>
               <li><i>行政区：</i><i>${data.adnm || '--'}</i></li>
               <li><i>景点类型：</i><i>${data.jdtype || '--'}</i></li>
               <li><i>景点等级：</i><i>${data.jdlevel || '--'}</i></li>
               <li><i>联系人：</i><i>${data.person || '--'}</i></li>
               <li><i>联系电话：</i><i>${data.phone || '--'}</i></li>
             </fieldset>`
        },
    },
    // 矿山
    1302: {
        loader: target => {
            return target
        },
        title: data => {
            return data.label || data.monm || ''
        },
        content: data => {
            return `<fieldset>
               <li><i>所属企业名称：</i><i>${data.company || '--'}</i></li>
               <li><i>地址：</i><i>${data.address || '--'}</i></li>
               <li><i>矿产类型(采矿方式)：</i><i>${data.way || '--'}</i></li>
               <li><i>矿种：</i><i>${data.type || '--'}</i></li>
               <li><i>固定资产净值：</i><i>${data.fixed || '--'}万元</i></li>
               <li><i>员工人数：</i><i>${data.personnels || '--'}人</i></li>
               <li><i>生产状态：</i><i>${data.status || '--'}</i></li>
               <li><i>联系人：</i><i>${data.person || '--'}</i></li>
               <li><i>联系电话：</i><i>${data.phone || '--'}</i></li>
             </fieldset>`
        },
    },
    //工程蓄水
    640: {
        title: (data: any) => data.adnm || '',
        content: (data: any) => {
            return `<fieldset>
                      <li><i>实蓄：</i><i>${data.currw || '--'}(百万m³)</i></li>
                      <li><i>应蓄：</i><i>${data.normw || data.num || ''}(百万m³)</i></li>
                      <li><i>蓄水率：</i><i>${data.disavg || '--'}(%)</i></li>
                    </fieldset>`;
        }
    }


};

export default layerFeatureOverlays;