export interface Role {
    roleId: number;
    roleName: string;
    roleCode: string;
    roleDesc: string;
    resourceList?: any;
}

/**
 * 返回的用户信息 模型
 */
export interface GetUserInfoModel {
    userId: number;
    userName: string;
    realName: string;
    password?: any;
    newPassword?: any;
    deptId: number;
    deptName: string;
    adcd: string;
    adnm: string;
    wscd: string;
    wsnm?: any;
    phone: string;
    level: number;
    levelStr: string;
    email: string;
    tel?: any;
    gender: string;
    genderStr: string;
    subject: string;
    descr: string;
    duration: number;
    moduleInfo: any[];
    roles: Role[];
    rolesStr: string;
    resourceCodes?: any;
    lockFlag: string;
    adcdList: string[];
    wscdList: string[];
    bbox: number[];
    wkt: string;
    lgtd?: any;
    lttd?: any;
    systemTitle: string;
    english: string;
    homePath?: string;
}

/**
 * 登录参数模型
 */
export interface LoginParams {
    username: string;
    password: string;
    phone: string;
    [k: string]: any;
}
export interface ThirdLoginParams {
    token: string;
    thirdType: string;
}
export interface LoginResultModel {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    license: string;
    dept_id: number;
    user_adcd: string;
    user_id: number;
    username: string;
    code?:string | number;
    msg?:string | number;
}