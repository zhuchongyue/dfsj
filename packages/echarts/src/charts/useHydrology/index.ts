import {EChartsType} from 'echarts';
import {Ref} from 'vue';
import cfg, {CATEGORY} from '../../config';
import {useECharts} from '../../hooks/useECharts';
import assign from '../../utils/assign';
import {
    toIndices as _toIndices,
    toMarks as _toMarks,
} from '../../utils/render';
import {
    avg as average,
    complexMinMaxIndex, findDataIndex,
    maximum,
    minimum,
    min,max,
    simpleMinMaxIndex, sum as summary, to,
} from '../../utils/tools';
import {useStatistic} from '../../view/useStatistic';
import {useTable} from '../../view/useTable';

import def from './default';

interface IOverride {
    I: Function;
    M: Function;
    S: Function;
    C: Object;
}

/**
 * 基础水文曲线。
 * 可以重写
 */
export function useHydrology(
    chartRef?: HTMLElement | Ref,
    override?: Partial<IOverride>
) {
    const {
        setOptions = null,
        echarts = null,
        getInstance = () => {
        },
        container = null,
    } = chartRef ? useECharts(chartRef as Ref<HTMLDivElement>) : {};
    const {open: openTable, close: closeTable, props, toggleTable} = useTable();
    props.container = container;
    const {
        open: openStatistic,
        close: closeStatistic,
        props: statisticProps,
        toggleStatistic,
    } = useStatistic();

    const assemble = (
        valueOri: any,
        options: any,
        chart: EChartsType = getInstance() as any
    ): any => {
        valueOri = valueOri ?? {};
        const value = JSON.parse(JSON.stringify(valueOri));
        const optioned = assign({}, config, options);
        if (value != null) {
            props.value = value;
            props.chart = chart;
            statisticProps.chart = chart;
            statisticProps.value = value;
            if (value?.filterCodes?.length > 0) {
                value.dimensions = value?.dimensions?.filter(
                    (e) => !value.filterCodes.includes(e?.code || e)
                );
            }
            optioned.dataset.source = value.source;

            optioned.series = value.dimensions
                ?.filter((e, i) => i)
                .map((e, i) => {
                    let encode = {x: 0, y: i + 1},
                        yAxisIndex = optioned.yAxis.findIndex(
                            (v) => v && v.$layout & e.code
                        );
                    return assign(
                        {yAxisIndex, encode, name: e.name, selected: e.selected},
                        toSeries(e, i, optioned)
                    );
                });

            // 创建指标数据
            let indices = toIndices(value, optioned);
            if (indices?.length) optioned.series.push(...indices);

            // 创建标记数据
            let marks = toMarks(value, optioned);
            if (marks?.length) {
                optioned.series.push(assign({data: marks}, cfg.mark.series));
            }
            optioned.legend.data = optioned?.series?.map((e) => ({
                name: e.name,
                textStyle: {color: e.color},
            }));

            // 设置legend默认选中项
            optioned.legend.selected = optioned.series?.reduce((p, v) => {
                return (p[v.name] = v.selected != null ? v.selected : true), p;
            }, {});
        }
        return optioned;
    };
    const toSeries = override?.S
        ? override.S
        : function (dimension: any, index: number, optioned: any) {
            return optioned.$series.find((e) => e.$code & dimension.code);
        };
    const toMarks = override?.M
        ? override.M
        : function (value: any, optioned: any) {
            return _toMarks(value, optioned, cfg.mark);
        };
    const toIndices = override?.I
        ? override.I
        : function (value: any, optioned: any) {
            return _toIndices(value, optioned);
        };
    const config = override?.C ?? def;

    /**
     * 转换配置
     * */
    const createOptions = (data: any) => {
        if (data == null) return null;
        let flo = complexMinMaxIndex(data, CATEGORY.FLOW);
        let stg = complexMinMaxIndex(data, CATEGORY.STAGE);
        //实时数据
        return {
            yAxis: [
                {
                    layout: CATEGORY.FLOW,
                    name: '流量(m³/s)',
                    min: (v) => minimum(v, flo),
                    max: (v) => maximum(v, flo),
                },
                {
                    layout: CATEGORY.STAGE,
                    name: '水位(m)',
                    min: (v) => minimum(v, stg),
                    max: (v) => maximum(v, stg),
                },
            ],
        };
    };

    return {
        createOptions,
        setOptions,
        echarts,
        getInstance,
        container,
        assemble,
        toSeries,
        toMarks,
        toIndices,
        toggleTable,
        toggleStatistic,
    };
}
