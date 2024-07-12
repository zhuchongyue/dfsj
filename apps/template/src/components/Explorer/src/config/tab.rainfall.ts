import dayjs from 'dayjs';
import {tools} from "@dfsj/echarts"
import {defineAsyncComponent} from "vue";
import {findPptnStation} from "@/components/Explorer";
import {useAppSyncTimeStateWithOut} from "@/store/modules/syncTime.ts";
import {getRainRealPro} from "@/api/common.ts";

export default {
    renders: [
        {
            name: 'real',
            label: '实测雨量',
            order: 1,
            content: defineAsyncComponent(
                () =>
                    import( '../components/Rainfall/RealRainfall.vue'  )
            ),
            options: {
                appendable: 3,
                load: ({target, condition}) => {
                    const params = {
                        stcd: target.stcd,
                        start: condition.date[0],
                        end: condition.date[1],
                    }
                    return getRainRealPro(params)
                },
                condition: () => {
                    return {
                        date: [
                            dayjs(useAppSyncTimeStateWithOut().serverTime).subtract(30, 'd'),
                            dayjs(useAppSyncTimeStateWithOut().serverTime).add(1, 'h'),
                        ],
                    };
                },
                chart: (data) => {
                    if (data == null) return null;
                    const day = tools.getNearNDays(data.source || [], 7);
                    return {
                        dataZoom: [
                            {
                                type: 'slider',
                                startValue: day[0],
                                endValue: day[1],
                            },
                            {
                                type: 'inside',
                                startValue: day[0],
                                endValue: day[1],
                            },
                        ],
                        xAxis: [
                            {
                                position: 'top',
                            },
                        ],
                        yAxis: [{}, {show: false}],
                    };
                },
            },
        },
        {
            name: 'around',
            label: '基础信息',
            order: 2,
            content: defineAsyncComponent(
                () => import('../components/Rainfall/BaseInfo/BaseInfo.vue')
            ),
            options: {
                //@ts-ignore
                loader: ({target}) => {
                    const params = {
                        stcd: target?.stcd ?? target?.mocd,
                    };
                    return findPptnStation(params);
                },
            },
        },
    ],
};
