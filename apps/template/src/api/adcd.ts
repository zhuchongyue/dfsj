/**
 * 地区相关的
 */

import { defHttp } from '/src/utils/http/axios';

enum Api {
    //查询所有子节点-树结构
    findAdcdTreeByLevel = '/station-service/adcd/findAdcdTreeByLevel',
    findWscdTreeByParentId = '/station-service/adcd/findWscdTreeByParentId', //行政区-根据上级流域编码，查询所有子节点

}

export const findAdcdTreeByLevel = (params: any) => {
    return defHttp.post(
        {
            url: Api.findAdcdTreeByLevel,
            params: params,
        },
        {
            ignoreCancelToken: false,
        }
    );
};
