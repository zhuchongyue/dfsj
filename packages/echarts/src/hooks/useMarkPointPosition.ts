import {findDataIndex, max, min} from "../utils/tools";


function calcPosition(dimension, optioned, zoom = {startValue: 0, endValue: undefined}) {
    const series = optioned.$series.find((e) => e.$code & dimension.code);
    let source: any[] = optioned?.dataset[0]?.source;
    console.log('source',source)
    let start = zoom.startValue,
        end = zoom.endValue ?? source.length - 1;
    let index = 1;
    if (Reflect.has(series, 'markPoint') && series?.markPoint?.data?.length) {
        let _min = (min(source, index, start, end))
        let _max = (max(source, index, start, end))
        const length = end - start;
        const maxIndex = findDataIndex(_max, source, index, start, end);
        const minIndex = findDataIndex(_min, source, index, start, end);
        const maxPosition = maxIndex > ((end - start + 1) / 2) ? 'left' : 'right';
        const minPosition = minIndex > ((end - start + 1) / 2) ? 'left' : 'right';
        /** * 最大值  */
        series?.markPoint?.data?.filter((m) => m?.type == 'max')?.forEach((mk) => {
            const old = mk.label.position;
            if (old != maxPosition) {
                mk.label.position = maxPosition;
            }
        })
        /** * 最小值  */
        series?.markPoint?.data?.filter((m) => m?.type == 'min')?.forEach((mk) => {
            const old = mk.label.position;
            if (old != minPosition) {
                mk.label.position = minPosition;
            }
        })
    }

    console.log('series',series)
    return series;
}

function useMarkPointPosition() {

    const TYPE = ['max', 'min']




}


export {
    useMarkPointPosition,
    calcPosition
};