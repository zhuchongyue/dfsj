<script setup lang="ts">
import {useDesign} from "/@/hooks/web/useDesign";
import {Icon} from "@dfsj/components";
import {reactive,ref} from "vue";
import {useFlyTo} from "/@/core/Resource/hooks/useFlyto";
import Util from "/@/packages/ol/src/modules/utils/Util";
const Mode       = {DECIMAL: 1, DEGREE: 0};
const mode       = ref(Mode.DECIMAL);
const {prefixCls} = useDesign('tool-box-locator');
const loginForm = reactive({
  longitude: "",
  latitude: "",
});
function rule(side): Function {
  return (rule: any, value: any, callback: any) => {
    console.log('value',value)
    if (!value) return callback("请输入数据");
    if (mode.value === Mode.DECIMAL) {
      if (side === 0 && (value < -180 || value > 180)) {
        return callback("经度必须在-180至180之间");
      }
      if (side === 1 && (value < -90 || value > 90)) {
        return callback("纬度必须在-90至90之间");
      }
    } else {
      let nums = (<string>value).split(/[°′″]/).map(e => +e);
      if (side === 0 && (nums[0] < -180 || nums[0] > 180)) {
        return callback("经度必须在-180至180之间");
      }
      if (side === 1 && (nums[0] < -90 || nums[0] > 90)) {
        return callback("纬度必须在-90至90之间");
      }

      if (nums[1] > 60) {
        return callback("分值必须在0至60之间");
      }
      if (nums[2] > 60) {
        return callback("秒值必须在0至60之间");
      }
    }
    return true;
  };
}
const rules = reactive<any>({
  longitude: [{ validator: rule(0), trigger: 'blur' }],
  latitude: [{ validator: rule(1), trigger: 'blur' }],
})

const { fly , flyHome,dispose} = useFlyTo({enableDisposeOnUnmount: false})
function onFlyTo() {
  let lon:any = loginForm.longitude, lat :any= loginForm.latitude;
  if (mode.value === Mode.DEGREE) {
    lon = lon.split(/[°′″]/).reduce((p, v, i) => p + (v || 0) / Math.pow(60, i), 0);
    lat = lat.split(/[°′″]/).reduce((p, v, i) => p + (v || 0) / Math.pow(60, i), 0);
  }
  if (!lat && !lon) return;
  const coordinate = [ +lon,+lat ]

  fly(coordinate , {
    attr:{id: Util.uuid()},
    focus:false,
    marker: true,
  })
}
function handleClear() {
  dispose()
}
</script>

<template>
  <div :class="prefixCls">
    <div class="tbl-item item-section" @click.stop="()=>flyHome()">
      <Icon class="item-section-icon" size="24" :icon="'mdi:home'"/>
      <span>地图初始视角</span>
    </div>

<!--    <div class="tbl-item item-section">-->
<!--      <Icon class="item-section-icon" size="24" :icon="'gis:measure-area-alt'"/>-->

<!--    </div>-->


<!--    <div class="tbl-item item-section">-->
<!--      <Icon class="item-section-icon" size="24" :icon="'game-icons:river'"/>-->

<!--    </div>-->

    <div class="locator-fly">
      <div class="between-icon">
        <Icon size="24"
              @click.stop="mode=1-mode"
              :icon="'mdi:swap-vertical-bold'"/>
      </div>
      <div class="flex-1">
        <el-form
            ref="ruleFormRef"
            :rules="rules"
            :model="loginForm"
        >
          <el-form-item prop="longitude" label="">
            <el-input v-model="loginForm.longitude"
                      :placeholder="mode?'经度（小数）':'经度（度分秒）'"  >
            </el-input>
          </el-form-item>

          <el-form-item prop="latitude" label="">
            <el-input v-model="loginForm.latitude"
                      :placeholder="mode?'纬度（小数）':'纬度（度分秒）'"  >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="between-icon">
        <Icon size="24" :icon="'mdi:send-check'" @click.stop="onFlyTo"/>
      </div>
    </div>

    <div class="tbl-item item-section" @click.stop="handleClear">
      <Icon class="item-section-icon" size="24" :icon="'mdi:broom'"/>
      <span>清除</span>
    </div>

  </div>
</template>

<style lang="scss">
$prefixCls: #{$namespace}-tool-box-locator;
$WRAP_WIDTH: 260px;
.#{$prefixCls} {
  @apply relative z-10 w-full pointer-events-auto;
  min-width: $WRAP_WIDTH;
  .locator-fly { 
    width: 100%;
    min-width: 0;
    display: flex;
    grid-auto-columns: 40px minmax(0, 1fr) 40px;
    grid-auto-rows: 48px;
  }

  .between-icon {
    width: 45px;
    @apply flex items-center justify-center;
  }

  .el-input__wrapper {
    box-shadow: none !important;
    border-bottom: 1px solid #212121;
    border-radius: 0;
    transition: all 0.2s ease-in-out;
    font-size: 16px;

    &:hover, &.is-focus {
      box-shadow: none !important;
      border-bottom: 1px solid var(--el-border-color);
      transition: all 0.2s ease-in-out;
    }
  }
}


</style>