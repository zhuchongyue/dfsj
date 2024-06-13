import {defHttp} from '/src/utils/http/axios';

enum Api {
  findAdcdByPadcd = '/station-service/adcd/findAdcdByPadcd', //查询下级行政区-不带地理信息
  findWscdTreeByParentId = '/station-service/adcd/findWscdTreeByParentId', //行政区-根据上级流域编码，查询所有子节点
  findObjectDataByPage = '/station-service/monitorObject/findObjectDataByPage', //查找水库
  findRdResultByPage = '/station-service/rsvrDsp/findRdResultByPage', //预报成果查询
}

export const findAdcdByPadcd = (params: any) => {
  return defHttp.post(
    {
      url: Api.findAdcdByPadcd,
      params: params,
    },
    {
      ignoreCancelToken: false,
    }
  );
};

export const findWscdTreeByParentId = (params: any) => {
  return defHttp.post(
    {
      url: Api.findWscdTreeByParentId,
      params: params,
    },
    {
      ignoreCancelToken: false,
    }
  );
};
export const findObjectDataByPage = (params: any) => {
  return defHttp.post(
    {
      url: Api.findObjectDataByPage,
      params: params,
    },
    {
      ignoreCancelToken: false,
    }
  );
};
export const findRdResultByPage = (params: any) => {
  return defHttp.post(
    {
      url: Api.findRdResultByPage,
      params: params,
    },
    {
      ignoreCancelToken: false,
    }
  );
};
