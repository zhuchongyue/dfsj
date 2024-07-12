import {defHttp} from "/@/utils/http/axios";

enum Api {
  findStationDetailCfg = "/station-service/monitorObject/findStationDetailCfg",  //查找需要展示的弹窗信息
  findRsvrDam = "/station-service/station/findRsvrDam",  //水库大坝
  // 水库信息
  rsvrinfo = '/station-service/station/findRsvrStation',
  riverinfo = '/station-service/station/findRiverStation',
  getRiverRealPro = '/station-service/station/getRiverRealPro',
  findCommunicationByStcd = '/station-service/station/findCommunicationByStcd',
  //水库基础信息修改
  updateStRsvrFcchB = '/station-service/stationUpdate/updateStRsvrFcchB',
 //水文站  基础信息修改
  updateStStbprpB='/station-service/stationUpdate/updateStStbprpB',
  //水文站 特征值修改
  updateStRvFcchB='/station-service/stationUpdate/updateStRvFcchB',
  //水库闸门开度试算
  gateKdTrial = '/station-service/rsvrDsp/gateKdTrial',
  /* 水库数据分析 */
  countAlarmRsvrDayByStcd = '/station-service/station/countAlarmRsvrDayByStcd',
  analyseRsvrByStcd = '/station-service/station/analyseRsvrByStcd',
  analyseAvgRsvrByStcd = '/station-service/station/analyseAvgRsvrByStcd',
  analyseRsvrMaxMinByStcd = '/station-service/station/analyseRsvrMaxMinByStcd',
 /* 河道水文站数据分析 */
  countAlarmRiverDayByStcd = '/station-service/station/countAlarmRiverDayByStcd',
  analyseRiverByStcd = '/station-service/station/analyseRiverByStcd',
  analyseAvgRiverByStcd = '/station-service/station/analyseAvgRsvrByStcd',
  analyseRiveMaxMinByStcd = '/station-service/station/analyseRiveMaxMinByStcd',
  //雨量站信息查询
  findPptnStation = '/station-service/station/findPptnStation',
  getRainRealProSource = '/station-service/station/getRainRealProSource',
  findPptnSumByIntv = '/station-service/alarm/findPptnSumByIntv',
  findPptnMaxByIntv = '/station-service/alarm/findPptnMaxByIntv',
}

export const countAlarmRiverDayByStcd = (params) => {
  return defHttp.post({ url: Api.countAlarmRiverDayByStcd, params });
};

export const analyseRiverByStcd = (params) => {
  return defHttp.post({ url: Api.analyseRiverByStcd, params });
};

export const analyseAvgRiverByStcd = (params) => {
  return defHttp.post({ url: Api.analyseAvgRiverByStcd, params });
};

export const analyseRiveMaxMinByStcd = (params) => {
  return defHttp.post({ url: Api.analyseRiveMaxMinByStcd, params });
};

export const countAlarmRsvrDayByStcd = (params) => {
  return defHttp.post({ url: Api.countAlarmRsvrDayByStcd, params });
};

export const analyseRsvrByStcd = (params) => {
  return defHttp.post({ url: Api.analyseRsvrByStcd, params });
};

export const analyseAvgRsvrByStcd = (params) => {
  return defHttp.post({ url: Api.analyseAvgRsvrByStcd, params });
};

export const analyseRsvrMaxMinByStcd = (params) => {
  return defHttp.post({ url: Api.analyseRsvrMaxMinByStcd, params });
};
//获取覆盖物的弹窗信息tabs
export const findStationDetailCfg = (params: any,) => defHttp.post<any>({ url: Api.findStationDetailCfg, params, }, {});
//大坝示意图
export const findRsvrDam = (params: any,) => defHttp.post<any>({ url: Api.findRsvrDam, params, }, {})
/**
 * 水库信息
 * @param params
 */
export const findRsvrStation = (params) => {
  return defHttp.post({ url: Api.rsvrinfo, params });
};
//水库信息保存
export const updateStRsvrFcchB = (params) => {
  return defHttp.post({ url: Api.updateStRsvrFcchB, params });
};

/**
 * 水文站点信息修改
 */
//基础信息
export const updateStStbprpB = (params) => {
  return defHttp.post({ url: Api.updateStStbprpB, params });
};
//特征值
export const updateStRvFcchB = (params) => {
  return defHttp.post({ url: Api.updateStRvFcchB, params });
};
//TODO 雨量站
export const findPptnStation = (params) => {
  return defHttp.post({ url: Api.findPptnStation, params });
};
export const getRainRealProSource = (params) => {
  return defHttp.post({ url: Api.getRainRealProSource, params });
};
export const findPptnSumByIntv = (params) => {
  return defHttp.post({ url: Api.findPptnSumByIntv, params });
};
export const findPptnMaxByIntv = (params) => {
  return defHttp.post({ url: Api.findPptnMaxByIntv, params });
};

/**
* 水库信息
* @param params
*/
export const findRiverStation = (params) => {
  return defHttp.post({ url: Api.riverinfo, params });
};

export const getRiverRealPro = (params) => {
  return defHttp.post({ url: Api.getRiverRealPro, params });
};

export const findCommunicationByStcd = (params) => {
  return defHttp.post({ url: Api.findCommunicationByStcd, params });
};
export const gateKdTrial = (params) => {
  return defHttp.post({ url: Api.gateKdTrial, params });
};