import {defineStore} from 'pinia';
import {store} from "/@/store";
import {Theme, ThemeTypes} from "/#/global";
import {setCssVar} from "/@/logics/theme/util.ts";
import {mixColor as mix} from "@dfsj/utils"
import {updateColorWeak} from "/@/logics/theme/updateColorWeak.ts";
import {updateGrayMode} from "/@/logics/theme/updateGrayMode.ts";
import {updateDarkTheme} from "/@/logics/theme/dark.ts";
import {ThemeEnum} from "/@/enums/appEnum.ts";
import {getDefaultTheme} from "/@/design/token/themeConfig.ts";
import {updateThemeName} from "/@/logics/theme/updateThemeName.ts";

interface ThemesState {
  grayMode: boolean,
  darkMode: ThemeEnum,
  colorWeak: boolean,
  theme: Theme
}
//TODO 用于主题切换的状态管理<储存>
/**
 * 1、用于已经配置好的颜色值切换  基于TDesign 设计规范
 * 2、基于全局和组件级别的Design Token
 * 3、若没有全部的色彩值   则通过颜色算法生成颜色梯度值。
 */
export const useThemeStore = defineStore({
  id: 'app-themes',
  state: (): ThemesState => ({
    darkMode: ThemeEnum.LIGHT, // 是否是暗黑模式
    grayMode: false, // 是否开始灰色模式，用于特殊悼念日
    colorWeak: false, // 是否开始灰色模式，用于特殊悼念日
    theme: {
      // 主题色
      name:'',
      elColorPrimary: '#409eff',
      // 左侧菜单边框颜色
      colorJson: 'inherit',
    }
  }),
  getters: {
    getDarkMode(): ThemeEnum {
      return this.darkMode
    },
    getTheme(): Theme {
      return this.theme
    },
    getGrayMode(): boolean {
      return this.grayMode
    },
    getColorWeak(): boolean {
      return this.colorWeak
    },
  },
  actions: {
    setGrayMode(grayMode: boolean) {
      this.grayMode = grayMode;
      updateGrayMode(this.getGrayMode)
    },
    setColorWeak(colorWeak: boolean) {
      this.colorWeak = colorWeak;
      updateColorWeak(this.colorWeak)
    },
    setDarkMode(darkMode: ThemeEnum) {
      this.darkMode = darkMode
      updateDarkTheme(this.darkMode)
      this.setPrimaryLight()
    },
    setTheme(theme: Theme) {
      this.theme = Object.assign(this.theme, theme);
      updateThemeName(this.theme.themeNameEn)
      this.setCssVarTheme()
    },
    setCssVarTheme() {
      for (const key in this.theme.colors) {
        setCssVar(`${key}`, this.theme?.colors?.[key])
      }
      setCssVar(`--el-color-primary`, this.theme?.primaryColor)
      this.setPrimaryLight()
    },
    setPrimaryLight() {
      if (this.theme.primaryColor) {
        const elColorPrimary = this.theme.primaryColor
        const color = this.darkMode == ThemeEnum.DARK ? '#000000' : '#ffffff';
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    },
    initTheme() {
      //获取当前的主题；
      const curTheme = getDefaultTheme();
      this.setTheme(curTheme)
    }
  }
});

// Need to be used outside the setup
export function useThemeStoreWithOut() {
  return useThemeStore(store);
}
