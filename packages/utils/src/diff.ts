/**
 * 比较两个元素是否相等的函数定义。
 * 这里的相对不是严格意义上的相等，更多的是比较两个元素的id（获取其他属性）是否相等。
 * @param older 旧数组中的某元素
 * @param newer 新数组中的某元素
 * @return 如果两个元素相等，则返回true，否则返回false。
 */
declare type Comparator = (older: any, newer: any) => boolean;
const defaultComparator = (older: any, newer: any) => older === newer;

/**
 * 对两组数据进行比较运算，挑选出删除的元素、新增的元素和相同的元素（默认不启用）。
 * @param older {[]} 旧数组
 * @param newer {[]} 新数组
 * @param comparator {Comparator} 比较函数，用以比较两个元素是否相同，默认使用连等运算判断（a===b）
 * @param absent {[]} [required] 删除的元素数组
 * @param additional {[]} [required] 新增的元素数组
 * @param identical {[]?} [optional] 相同的元素数组（默认不启用，设置此参数为空数组即可启用）
 * @return 返回三个数组[absent,additional,identical]
 */
export function diff(older: any[],
                     newer: any[],
                     comparator: Comparator = defaultComparator,
                     absent: any[] = [],
                     additional: any[] = [],
                     identical: any[] = []): { absent: any[], additional: any[], identical?: any[] } {
    // 如果旧数组为空或者旧数组的元素数量为0
    if (older == null || older.length === 0) {
        return {absent, additional: newer, identical};
    }
    // 如果新数组为空或者新数组的元素数量为0
    if (newer == null || newer.length === 0) {
        return {absent: older, additional, identical};
    }
    // 选出新增的元素和相同的元素（如果启用）
    newer.forEach(x => {
        let e = older.find(y => comparator(y, x));
        if (e == null) additional.push(x);
        else if (identical) identical.push([e, x]);
    });
    // 选出已删除的元素
    older.forEach(x => {
        let e = newer.find(y => comparator(x, y));
        if (e == null) absent.push(x);
    });
    return {absent, additional, identical};
}
