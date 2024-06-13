<script setup lang="ts">
import {ref} from 'vue'
import {ElSwitch} from 'element-plus'
import {useIcon} from '/@/hooks/web/useIcon'
import {useDesign} from '/@/hooks/web/useDesign'
import {useThemeStore} from "/@/store/modules/themes.ts";
import {ThemeEnum} from "/@/enums/appEnum.ts";

const emit = defineEmits(['change'])

const prefixCls = useDesign('theme-switch')

const Sun = useIcon({ icon: 'emojione-monotone:sun', color: '#fde047' })

const CrescentMoon = useIcon({ icon: 'emojione-monotone:crescent-moon', color: '#fde047' })

const themeStore = useThemeStore()

// 初始化获取是否是暗黑主题
const darkMode = ref(themeStore.getDarkMode == ThemeEnum.LIGHT)

// 设置switch的背景颜色
const blackColor = 'var(--el-color-black)'

const themeChange = (val: boolean) => {
  if (val) {
    val= ThemeEnum.LIGHT
  }else {
    val= ThemeEnum.DARK
  };
  themeStore.setDarkMode(val)
  emit('change', val)
}
</script>

<template>
  <ElSwitch
    :class="prefixCls"
    v-model="darkMode"
    inline-prompt
    :border-color="blackColor"
    :inactive-color="blackColor"
    :active-color="blackColor"
    :active-icon="Sun"
    :inactive-icon="CrescentMoon"
    @change="themeChange"
  />
</template>

<style lang="scss" scoped>
:deep(.el-switch__core .el-switch__inner .is-icon) {
  overflow: visible;
}
</style>
