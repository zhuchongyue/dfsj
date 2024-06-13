/**
 * Application configuration
 */
import {updateColorWeak} from '/@/logics/theme/updateColorWeak';
import {updateGrayMode} from '/@/logics/theme/updateGrayMode';
import {getCommonStoragePrefix, getStorageShortName} from '/@/utils/env';
import {useLocaleStore} from "/@/store/modules/locale.ts";
import {useThemeStore} from "/@/store/modules/themes.ts";
import {ProjectConfig} from "/#/config";
import {Persistent} from "/@/utils/cache/persistent.ts";
import {PROJ_CFG_KEY} from "/@/enums/cacheEnum.ts";
import projectSetting from "/@/settings/projectSetting.ts";
import {deepMerge} from "@dfsj/utils";
import {useAppStore} from "/@/store/modules/app.ts";
import {updateDarkTheme} from "/@/logics/theme/dark.ts";

export function initAppConfigStore() {
    const appStore = useAppStore()
    const localeStore = useLocaleStore();
    const themeStore = useThemeStore();
    let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;
    projCfg = deepMerge(projectSetting, projCfg || {});
    const grayMode = themeStore.grayMode;
    const darkMode = themeStore.darkMode;
    const colorWeak = themeStore.colorWeak;
    appStore.setProjectConfig(projCfg);
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
    updateDarkTheme(darkMode);
    themeStore.initTheme()
    // init store
    localeStore.initLocale();

    setTimeout(() => {
        clearObsoleteStorage();
    }, 16);
}

/**
 * 随着版本的不断迭代，将有越来越多的缓存键存储在localStorage中。.
 * 该方法用于删除无用的密钥
 */
export function clearObsoleteStorage() {
    const commonPrefix = getCommonStoragePrefix();
    const shortPrefix = getStorageShortName();

    [localStorage, sessionStorage].forEach((item: Storage) => {
        Object.keys(item).forEach((key) => {
            if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
                item.removeItem(key);
            }
        });
    });
}
