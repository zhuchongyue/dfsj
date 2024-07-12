import {unifyPostHttp} from '/@/utils/http/axios'; 
enum Api {
    aroundQuerySubject= '/station-service/around/findAffectTotalByTif',
    aroundQueryDetails= '/station-service/around/findObjectByUuid',
    aroundQueryCluster= '/station-service/around/findPointClusterUuid',
    aroundQueryExport= '/station-service/around/exportAffectByUuid',
    aroundQuerySummary= '/station-service/around/findAffectDescByUuid',
    aroundQueryExportSubject= '/station-service/around/exportObjectByUuid', 
    aroundQueryAnalysisBrief= '/station-service/around/analysisBrief',
}
export const aroundQuerySubject = (params: any,) => unifyPostHttp(Api.aroundQuerySubject, params);
export const aroundQueryDetails = (params: any,) => unifyPostHttp(Api.aroundQueryDetails, params);
export const aroundQueryCluster = (params: any,) => unifyPostHttp(Api.aroundQueryCluster, params);
export const aroundQueryExport = (params: any,) => unifyPostHttp(Api.aroundQueryExport, params);
export const aroundQuerySummary = (params: any,) => unifyPostHttp(Api.aroundQuerySummary, params);
export const aroundQueryExportSubject = (params: any,) => unifyPostHttp(Api.aroundQueryExportSubject, params);
export const aroundQueryAnalysisBrief = (params: any,) => unifyPostHttp(Api.aroundQueryAnalysisBrief, params);
