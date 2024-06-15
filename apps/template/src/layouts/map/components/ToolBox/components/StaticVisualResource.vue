<script setup lang="ts">
  import { ref } from 'vue';

  import Icon from '/@/components/Icon/src/Icon.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { useStaticVisualResource } from '@/layouts/map/components/ToolBox/hooks/useStaticVisualResource';
  import {
    useStaticVisualResourceStore,
    useStaticVisualResourceStoreWithOut,
  } from '@/layouts/map/components/ToolBox/store/svresource';

  import { resource } from '../config/resource';

  useStaticVisualResource();

  const { prefixCls } = useDesign('static-visual-resource');
  const layers = ref(new Map());
  const activeNames = ref([resource[0].id]);
  const staticVisualResourceStore = useStaticVisualResourceStore();
  function handleChange() {}

  function clear() {
    staticVisualResourceStore.checked = [];
  }
</script>

<template>
  <div :class="prefixCls">
    <div class="layers-broom" @click.stop="clear">
      <Icon :icon="'mdi:broom'" color="#f2c037" />
      清除图层（{{ useStaticVisualResourceStoreWithOut().checked?.length }}）
    </div>
    <div class="layers-collapse">
      <el-collapse v-model="activeNames" @change="handleChange">
        <template v-for="(rs, index) in resource" :key="rs.datatype">
          <el-collapse-item :title="rs.label" :name="rs.id">
            <template #title>
              <span class="collapse-title">
                <img :src="`${rs.icon}`" />
                {{ rs.label }}
              </span>
            </template>

            <el-checkbox-group v-model="staticVisualResourceStore.checked">
              <div
                class="tb-item cursor-pointer item-section-checkbox pointer-events-auto"
                v-for="(t, i) in rs.subs"
                :key="t?.datatype + 'tb'"
              >
                <!--              <Icon size="24" class="item-section-icon" :icon="t.icon"/>-->
                <!--              <span>{{ t.label }}</span>-->
                <!--                <el-checkbox v-model="checked" :label="t.datatype">-->
                <!--                  {{ t.label }}-->
                <!--                </el-checkbox>-->
                <el-checkbox :label="t.datatype" :key="t.datatype">
                  <img :src="`/images/layer/${t.motype}/431.png`" />

                  {{ t.label }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
  </div>
</template>

<style lang="scss">
  $prefixCls: #{$namespace}-static-visual-resource;
  .#{$prefixCls} {
    @apply pointer-events-auto;
    width: 200px;
    .collapse-title {
      font-size: 16px;
      img {
        vertical-align: middle;
      }
    }
    .item-section-checkbox {
      display: flex;
      align-items: center;
      height: 40px;
      .el-checkbox {
        display: flex;
        align-items: center;
        height: 40px;
        img {
          vertical-align: middle;
        }
      }
    }
    .layers-broom {
      color: #f2c037;
      font-size: 14px;
      height: 40px;
      @apply flex justify-center items-center;
    }
    .layers-collapse {
      padding: 0 10px 10px 10px;
    }
  }
</style>
