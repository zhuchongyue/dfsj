import { defHttp, gatewayHttp } from '/@/utils/http/axios';

import { FileCenterUploadURL } from './config';

export const enum Api {
  findDictionaryByType = '/station-service/dictionary/findDictionaryByType',
  appHeart = '/system/user/heart', //心跳接口/用于获取服务器时间和统计在线用户
  upload = '/xxx',
  adcdCodeTree = '/station-service/adcd/findAdcdCodeTree', //行政区域
  adcdTreeByLevel = '/station-service/adcd/findAdcdTreeByLevel', //行政区域
  wscdTreeByParentId = '/station-service/adcd/findWscdTreeByParentId', //流域
  stationMap = '/rtu-service/stationObj/getStationMap', //站点分布的站点上图
  menuList = '/station-service/module/list', //菜单
  // menuList ='/mock/module/list',//菜单baseUrl
  stationRealData = '/rtu-service/stationData/findRealData', //点位实时数据
  // 按区域(行政区域、流域)统计断面数量
  sectionCount = '/station-service/floodForecast/getSectionCountByAreaCode',
  //断面上图 查询断面点上图信息（洪水预报-断面点上图）
  sectionPoint4Map = '/station-service/floodForecast/getSectionPoint4Map',
  //获取方案断面wkt  sectionId caseId selectType:2
  findCaseWkt = '/calcu/floodForecast/case/findCaseWkt',
  //图表相关的
  //雨量站实况降水--
  rainRealPro = '/station-service/station/getRainRealPro',
  //水位站实况流量接口
  riverRealPro = '/station-service/station/getRiverRealPro',
  //水库实况出流接口
  rsvrRealPro = '/station-service/station/getRsvrRealPro',
  //水库实况出流接口
  getRsvrRealProAddTime = '/station-service/station/getRsvrRealProAddTime',
  // 水位流量关系曲线
  riverZqrl = '/station-service/station/findRiverZqrl',
  // 库容曲线
  rsvrZvarl = '/station-service/station/findRsvrZvarl',
  // 查询水库闸门信息
  drainage = '/station-service/station/getDrainageByStcd',
  // 闸门
  curves = '/station-service/station/getDrainageCurves',
  // 开度
  drainageH = '/station-service/station/getDrainageHeightByDnid',
  //全文检索
  doSearch = '/station-service/searchDoc/doSearch',

  // 新增水位流量曲线-需要完整提交整条曲线, 且lnnm为同一名称, bgtm均为同一时间， ptno递增
  insertStZqr = '/rw-service/river/insertStZqrlB',
  // 查询水位流量曲线历史版本
  findZqrl = '/rw-service/river/findStZqrlBHistoryVersion',
  // 按版本查询水位流量曲线
  findZqrlByv = '/rw-service/river/findStZqrlBByVersion',

  // 新增库容曲线-需要完整提交整条曲线, 且mstm均为同一时间， ptno递增
  insertRsvr = '/rw-service/rsvr/insertStZvarlB',
  // 查询库容曲线历史版本
  findRsvr = '/rw-service/rsvr/findStZvarlBHistoryVersion',
  // 按版本查询库容曲线
  findRsvrByv = '/rw-service/rsvr/findStZvarlBByVersion',

  // 新增泄流曲线-需要完整提交整条曲线, 且stcd, dnid, height均相同， ptno递增
  insertDrainage = '/station-service/station/addDrainageCurve',
  // 查询闸门泄流曲线历史版本
  findDrainage = '/station-service/station/findDrainageCurveHistoryVersion',
  // 按版本查询泄流曲线
  findDrainageByv = '/station-service/station/findDrainageCurveByVersion',

  // 获取断面WKT  方案配置
  findSectionWkt = '/calcu/floodForecast/section/findSectionWkt',

  // 水位流量曲线-excel 模版导出
  exportStZqrlB = '/rw-service/river/exportStZqrlBTemp',
  // 新增水位流量曲线-excel导入
  importStZqrlB = '/rw-service/river/importStZqrlB',

  // 库容曲线 模版
  exportStZvarlB = '/rw-service/rsvr/exportStZvarlBTemp',
  // 库容曲线数据-excel导入
  importStZvarlB = '/rw-service/rsvr/importStZvarlB',

  // 导出泄流曲线模板
  exportDrainage = '/station-service/station/exportDrainageCurveTemp',

  // 泄流曲线-excel导入
  importDrainage = '/station-service/station/importDrainageCurve',

  //水库来水预报
  rsvrForecast = '/station-service/station/findRsvrForecast', //河道断面
  crossSection = `/station-service/station/findCrossSection`,
  //河道来水预报
  riverForecast = `/station-service/station/findRiverForecast`,
  fileUpload = '/station-service/file/upload',
  //根据stcd，按天查询水文站最新实时数据
  findStRiverRByDate = '/station-service/river/findStRiverRByDate',
  // video 
  'cameraList' = '/station-service/video/findVideoListByStcd',
}

export const findVideoListByStcd = (params) => {
  return defHttp.post({ url: Api.cameraList, params });
};

export const findDictionaryByTypeApi = (params) => {
  return defHttp.post({ url: Api.findDictionaryByType, params });
};
/**
 * 获取河道来水预报
 * */
export const getRriverForecast = (params) => {
  return defHttp.post(
    { url: Api.riverForecast, params },
    {
      ignoreCancelToken: false,
    }
  );
};
/**
 * 河道横断面
 * */
export const getCrossSection = (params) => {
  return defHttp.post({ url: Api.crossSection, params });
};
/**
 * 获取水库来水预报
 * */
export const getRsvrForecast = (params) => {
  return defHttp.post(
    { url: Api.rsvrForecast, params },
    {
      ignoreCancelToken: false,
    }
  );
};

/**
 * 上传文件 曲线
 * */
export const uploadFileForLine = (url, params, config) => {
  return defHttp.uploadFile(
    { url: url || FileCenterUploadURL, ...config },
    params,
    { isReturnResponse: true }
  );
};

/**
 * 水位流量曲线-excel 模版导出
 * */
export const exportStZqrlBTemp = (params) => {
  return defHttp.post(
    { url: Api.exportStZqrlB, params, responseType: 'blob' },
    { isReturnNativeResponse: true }
  );
};

/**
 * 库容曲线-excel 模版导出
 * */
export const exportStZvarlBTemp = (params) => {
  return defHttp.post(
    { url: Api.exportStZvarlB, params, responseType: 'blob' },
    { isReturnNativeResponse: true }
  );
};

/**
 * 库容曲线-excel 模版导出
 * */
export const exportDrainageCurveTemp = (params) => {
  return defHttp.post(
    { url: Api.exportDrainage, params, responseType: 'blob' },
    { isReturnNativeResponse: true }
  );
};

/** 心跳请求*/
export const appHeart = () => defHttp.post({ url: Api.appHeart });

/**
 * 获取断面WKT
 * */
export const findSectionWkt = (params) => {
  return defHttp.post({ url: Api.findSectionWkt, params });
};

/**
 *
 * 新增库容曲线
 */
export const addDrainageCurve = (params, config) => {
  return defHttp.post({ url: Api.insertDrainage, params }, config);
};

/**
 *
 * 查询库容曲线历史版本
 */
export const findDrainageCurveHistoryVersion = (params) => {
  return defHttp.post({ url: Api.findDrainage, params });
};

/**
 *
 * 按版本查询库容曲线
 */
export const findDrainageCurveByVersion = (params) => {
  return defHttp.post({ url: Api.findDrainageByv, params });
};

/**
 *
 * 新增库容曲线
 */
export const insertStZvarlB = (params, config) => {
  return defHttp.post({ url: Api.insertRsvr, params }, config);
};

/**
 *
 * 查询库容曲线历史版本
 */
export const findStZvarlBHistoryVersion = (params) => {
  return defHttp.post({ url: Api.findRsvr, params });
};

/**
 *
 * 按版本查询库容曲线
 */
export const findStZvarlBByVersion = (params) => {
  return defHttp.post({ url: Api.findRsvrByv, params });
};

/**
 *
 * 新增水位流量曲线
 */
export const insertStZqrlB = (params, config) => {
  return defHttp.post({ url: Api.insertStZqr, params }, config);
};

/**
 *
 * 查询水位流量曲线历史版本
 */
export const findStZqrlBHistoryVersion = (params) => {
  return defHttp.post({ url: Api.findZqrl, params });
};

/**
 *
 * 查询水位流量曲线历史版本
 */
export const findStZqrlBByVersion = (params) => {
  return defHttp.post({ url: Api.findZqrlByv, params });
};

/**
 * 闸门
 */
export const getDrainageCurves = (params) => {
  return defHttp.post(
    { url: Api.curves, params },
    {
      ignoreCancelToken: false,
    }
  );
};

/**
 *
 * 开度
 */
export const getDrainageHeightByDnid = (params) => {
  return defHttp.post({ url: Api.drainageH, params });
};

/**
 *
 * 库容曲线
 */
export const getDrainageByStcd = (params) => {
  return defHttp.post({ url: Api.drainage, params });
};

/**
 *
 * 库容曲线
 */
export const findRsvrZvarl = (params) => {
  return defHttp.post({ url: Api.rsvrZvarl, params });
};

/**
 *
 * 水位流量关系曲线
 */
export const findRiverZqrl = (params) => {
  return defHttp.post({ url: Api.riverZqrl, params });
};

/**
 *
 * 按区域(行政区域、流域)统计断面数量
 */
export const getSectionCountByAreaCode = (params) => {
  return defHttp.post({ url: Api.sectionCount, params });
};

/**
 *
 * 获取用户的菜单信息
 */
export const getMenuList = (params) => {
  return defHttp.post({ url: Api.menuList, params });
};

/**
 * 上传文件
 * */
export const uploadFile = (url, params, config) => {
  return gatewayHttp.uploadFile(
    { url: url || FileCenterUploadURL, ...config },
    params,
    { isReturnResponse: true }
  );
};

/**
 * 行政区-根据编码，获取下级行政区列表列表
 * padcd
 */
export const getAdcdCodeTree = (params) => {
  return defHttp.post({ url: Api.adcdCodeTree, params });
};

/**
 * 行政区-根据编码，获取下级行政区列表列表  可以指定level
 * parentAdcd
 * level
 * self
 */
export const getAdcdTreeByLevel = (params) => {
  return defHttp.post({ url: Api.adcdTreeByLevel, params });
};

/**
 * 行政区-根据上级流域编码，查询所有子节点
 * */

export const getWscdTreeByParentId = (params) => {
  return defHttp.post({ url: Api.wscdTreeByParentId, params });
};

/***
 * 站点上图
 * @param params
 * box  scale  adcd key onlineStatus stationType usfl
 */
export const getStationMap = (params: any) => {
  return defHttp.post(
    {
      url: Api.stationMap,
      params: params,
    },
    {
      ignoreCancelToken: false,
    }
  );
};

/***
 雨量站实况降水
 */
export const getRainRealPro = (params) => {
  return defHttp.post({ url: Api.rainRealPro, params });
};

/***
 水位站实况流量接口
 */
export const getRiverRealPro = (params) => {
  return defHttp.post({ url: Api.riverRealPro, params });
};
/***
 水库实况出流接口
 */
export const getRsvrRealPro = (params) => {
  return defHttp.post({ url: Api.rsvrRealPro, params });
};

export const getRsvrRealProAddTime = (params) => {
  return defHttp.post({ url: Api.getRsvrRealProAddTime, params });
};

/***
 查询断面点上图信息（洪水预报-断面点上图）
 */
export const getSectionPoint4Map = (params) => {
  return defHttp.post({ url: Api.sectionPoint4Map, params });
};
/***
 获取方案断面wkt
 */
export const findCaseWkt = (params) => {
  return defHttp.post({ url: Api.findCaseWkt, params });
};

/***
 全文检索   全局搜索
 */
export const doSearch = (params) => {
  return defHttp.post({ url: Api.doSearch, params });
};
/***
 文件上传 
 */
export const fileUpload = (params) => {
  return defHttp.post({ url: Api.fileUpload, params });
};
/***
 据stcd，按天查询水文站最新实时数据
 */
export const findStRiverRByDate = (params) => {
  return defHttp.post(
    { url: Api.findStRiverRByDate, params },
    { ignoreCancelToken: false }
  );
};
