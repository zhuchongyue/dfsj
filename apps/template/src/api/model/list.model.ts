/**
 * 菜单
 */
export interface Item {
    style: string;
    label: string;
    value: string;
}
export interface Legend {
    name: string;
    items: Item[];
    index: number;
    styletype?: any;
    legendtype?: any;
    img?: any;
}
export interface MenuModel {
    id: number;
    module: number;
    datatype: string;
    name: string;
    icon?: any;
    checked: number;
    level: number;
    pid: number;
    ordernum: number;
    configure?: any;
    sourcetype: number;
    playable: number;
    formable: number;
    fileable: number;
    legend?: Legend;
    export: number;
    motype?: any;
    model: string;
    params?: any;
    checkselect: string;
    subs?: MenuModel[];
    sttypes?: any;
    rangeid?: any;
    label: string;
    anytimeable?: any;
    dailyable: number;
    hourable?: any;
    lines: number;
    typeid?: any;
    typenum: number;
    typename?: any;
}