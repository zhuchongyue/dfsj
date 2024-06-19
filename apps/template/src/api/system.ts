import { defHttp } from '/src/utils/http/axios';

const Api = {
    adcdTree : "/station-service/adcd/findAdcdTreeWithRiskNode",
    roleList: "/system/userManage/getRoles",
    // userList: "/system/userManage/page",
    userList: "/user/userManage/page",
    deptList: "/system/userManage/getDepts",
    addUser: "/system/userManage/createUser",
    editUser: "/system/userManage/editUser",
    deleteUser: "/system/userManage/deleteUser",
    resetPwd: "/system/userManage/updatePwd",
    lockUser: "/system/userManage/lockUser",
    unlockUser: "/system/userManage/unlockUser",
}

/**
 * 行政区树
 * */
export const getAdcdTreeApi = (params) => {
    return defHttp.post({url: Api.adcdTree, params})
}

/**
 * 获取角色列表
 * */
export const getRoleListApi = () => {
    return defHttp.post({url: Api.roleList})
}


/**
 * 获取用户信息列表
 * */

export const getUserListApi =  (params) => {
    return defHttp.post({url: Api.userList, params})
}

/**
 * 获取机构列表
 * */

export const getDeptListAPi = () => {
    return defHttp.post({url: Api.deptList})
}

/**
 * 添加用户
 * */
export const addUserApi = (params) => {
    return defHttp.post({url: Api.addUser,params},{isTransformResponse: true})
}

/**
 * 编辑用户
 * */
export const editUserApi = (params) => {
    return defHttp.post({url: Api.editUser, params})
}
/**
 * 删除用户
 * */
export const deleteUserApi = (params) => {
    return defHttp.post({url: Api.deleteUser, params})
}

/**
 * 重置密码
 * */
export const resetPwdAPi = (params) => {
    return defHttp.post({url: Api.resetPwd, params})
}

/**
 * 锁定用户
 * */
export const lockUserApi = (params) => {
    return defHttp.post({url: Api.lockUser, params})
}

/**
 * 解锁用户
 * */
export const unlockUserApi = (params) => {
    return defHttp.post({url: Api.unlockUser, params})
}
