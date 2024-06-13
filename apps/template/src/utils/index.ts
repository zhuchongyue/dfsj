import {App} from "vue";
/**
 * 注册全局组件
 * @param component
 * @param alias
 */
export const withInstall = <T>(component: T, alias?: string) => {
    console.log("---初始化---", component)
    const comp = component as any;
    comp.install = (app: App) => {
        app.component(comp.name || comp.displayName, component);
        if (alias) {
            app.config.globalProperties[alias] = component;
        }
    };
    return component as T & Plugin;
};
/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
    if (!str) return ''
    return str.replace(/\-(\w)/g, (_, letter: string) => {
        return letter.toUpperCase()
    })
}