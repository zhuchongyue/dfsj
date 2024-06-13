<script setup lang="ts">
import { ElDrawer, ElDivider, ElMessage } from 'element-plus'
import { ref, unref } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useCssVar } from '@vueuse/core'
import ColorRadioPicker from './components/ColorRadioPicker.vue'
import { useClipboard } from '@vueuse/core'
import { useDesign } from '/@/hooks/web/useDesign'

import { domUtils } from "@dfsj/utils"
import {useThemeStore} from "/@/store/modules/themes.ts";
import ThemeRadioPicker from "/@/components/Setting/src/components/ThemeRadioPicker.vue";
import {getTheme, getThemes} from "/@/design/token/themeConfig.ts";
const { setCssVar, getCssVar } = domUtils;
const { prefixCls } = useDesign('setting')
const { t } = useI18n()
const themeStore = useThemeStore()
// 主题色相关
const systemTheme = ref(themeStore.getTheme.themeNameEn)
const setSystemTheme = (name: string) => {
  const theme = getTheme(name)
  console.log('ww',theme)
  themeStore.setTheme(theme)
}

const themes = getThemes();
console.log({themes})

</script>

<template>
    <div class="text-center">
      <!-- 主题 -->
<!--      <ElDivider>{{ t('setting.theme') }}</ElDivider>-->
<!--      <ThemeSwitch @change="themeChange" />-->
      <!-- 系统主题 -->
      <ElDivider>{{ t('layout.setting.sysTheme') }}</ElDivider>
      <ThemeRadioPicker
          v-model="systemTheme"
          :schema="themes"
          @change="setSystemTheme"
      />
    </div>
</template>

<style lang="scss" scoped>
$prefix-cls: '#{$namespace}-setting';

.#{$prefix-cls} {
  border-radius: 6px 0 0 6px;
}
</style>
