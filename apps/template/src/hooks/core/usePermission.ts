import {useUserStore} from "/src/store/modules/user";
import {computed} from "vue";

type Permission = {
    resource?: string[],
    roles?: string[],
    maxLevel?: string
}

export enum EPermission {
    MANAGEMENT_BTN_ADD = 'MANAGEMENT_BTN_ADD',
    MANAGEMENT_BTN_DEL = 'MANAGEMENT_BTN_DEL',
    MANAGEMENT_BTN_MODIFY = 'MANAGEMENT_BTN_MODIFY',
    MANAGEMENT_BTN_QUERY = 'MANAGEMENT_BTN_QUERY',
    MANAGEMENT_BTN_IMPORT = 'MANAGEMENT_BTN_IMPORT',
    MANAGEMENT_BTN_EXPORT = 'MANAGEMENT_BTN_EXPORT',
}


const roleCodeAllowList = ["ROLE_ADMIN_SYSTEM"] // 角色code白名单

export function usePermission() {
    const userStore = useUserStore();
    const user = computed(() => userStore.getUserInfo) ?? {};

    function hasPermission(permission: Permission, def: Boolean = true) {
        const userResource = user.value?.resourceCodes || [] //当前登录用户拥有的权限列表
        const userRoles = (user?.value?.roles || []).map(role => role.roleCode) //当前登录用户拥有的角色列表
        const userLevel = user?.value?.level //当前登录用户的行政级别
        // 得到与白名单相匹配的roleCode列表
        let hasRoleCodePass = userRoles.some(item => roleCodeAllowList.includes(item.roleCode))
        // 功能权限判断
        let moduleResource = permission?.resource
        let moduleRoles = permission?.roles
        let moduleMaxLevel = permission?.maxLevel
        // 如果permission未来定义，说明没有对此菜单作权限限制，默认是有权限的。
        if (hasRoleCodePass || !permission) return def
        let isAvailable = false
        // 权限
        if (moduleResource && Array.isArray(moduleResource) && moduleResource.length) {
            for (let index = 0; index < moduleResource.length; index++) {
                if (userResource && userResource.includes(moduleResource[index])) {
                    isAvailable = true
                    break;
                }
            }
        }
        // 角色
        if (moduleRoles && Array.isArray(moduleRoles) && moduleRoles.length) {
            for (let index = 0; index < moduleRoles.length; index++) {
                if (userRoles && userRoles.includes(moduleRoles[index])) {
                    isAvailable = true
                    break;
                }
            }
        }
        // 行政级别
        if (moduleMaxLevel && userLevel && userLevel <= moduleMaxLevel) {
            isAvailable = true
        }
        return isAvailable
    }

    return {
        hasPermission
    }
}
