<script setup lang="ts">
import { ref } from 'vue'
import { ElSwitch } from 'element-plus'
import { useIcon } from '/@/hooks/web/useIcon'
import { useDesign } from '/@/hooks/web/useDesign'
import {useThemeStore} from "/@/store/modules/themes.ts";
import {useI18n} from "vue-i18n";
const emit = defineEmits(['change'])
const prefixCls = useDesign('theme-switch')
const themeStore = useThemeStore()
const { t } = useI18n()
const colorWeakMode = ref(themeStore.getColorWeak)
const colorWeakChange = (show: boolean) => {
  themeStore.setColorWeak(show)
}
</script>

<template>
  <div class="flex justify-between items-center">
    <span class="text-14px">{{ t('layout.setting.colorWeak') }}</span>
    <ElSwitch v-model="colorWeakMode" @change="colorWeakChange" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-switch__core .el-switch__inner .is-icon) {
  overflow: visible;
}
</style>
