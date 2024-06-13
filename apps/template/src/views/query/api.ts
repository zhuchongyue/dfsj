import { defHttp } from '/src/utils/http/axios';

enum Api {
    //实时雨情统计
    findPptnReport = 'station-service/rwdbReport/findPptnReport', //根据测站编码、时间段，查询雨量统计
    countPptnByDrp = 'station-service/rwdbReport/countPptnByDrp', //根据测站编码、时间段，查询雨量站点数目
    //实时水情统计
    findRiverReport = 'station-service/rwdbReport/findRiverReport', //查询河道水情(给定时间段内的最新数据)-详情列表
}

export const findPptnReport = (params: any) => {
    return defHttp.post(
        {
            url: Api.findPptnReport,
            params: params,
        },
        {
            ignoreCancelToken: false,
        }
    );
};
export const countPptnByDrp = (params: any) => {
    return defHttp.post(
        {
            url: Api.countPptnByDrp,
            params: params,
        },
        {
            ignoreCancelToken: false,
        }
    );
};
export const findRiverReport = (params: any) => {
    return defHttp.post(
        {
            url: Api.findRiverReport,
            params: params,
        },
        {
            ignoreCancelToken: false,
        }
    );
};