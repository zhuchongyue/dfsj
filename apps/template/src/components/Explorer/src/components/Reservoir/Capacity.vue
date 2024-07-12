<script setup lang="ts">
import {computed, reactive, ref, shallowRef, unref, watch} from "vue";
import {createLinearInterpolator} from 'commons-math-interpolation';
import {EToolbox, UnifyChart, useLoader} from '@dfsj/components';
import {compProps} from '/@/components/Explorer';
import {useAttrs} from '@dfsj/hooks';
import {useDesign} from '/@/hooks/web/useDesign';
import {tools, useCapacity} from '@dfsj/echarts';

const {prefixCls} = useDesign('chart-capacity-page-wrap');
const props = defineProps(compProps);
const attrs = useAttrs({excludeDefaultKeys: false});
/**
 * 顶部表单转换
 */
const t = (v) => (v >= 0 ? tools.numeralFormat(v, '0.000') : '--');
const transforms = shallowRef(null);
const selected = ref(null);
const condition = reactive({
  selected: '',
  input: '',
  out: '',
});
const getSelect = () => {
  return transforms.value?.find((item) => item.value === condition.selected);
};

const convert = (value) => {
  const {dimensions = [], source = []} = value ?? {};
  const values = dimensions
      .map((e, i) => i)
      .map((index, i, all) => {
        try {
          const name = dimensions[index];
          const indices = all.filter((e, j) => j !== i);
          const label = `${dimensions[index]} > ${indices
              .map((idx) => dimensions[idx])
              .join(' / ')}`;
          const fields = indices.map((idx) => ({
            inter: createLinearInterpolator(
                source.map((e) => e[index]),
                source.map((e) => e[idx])
            ),
            label: dimensions[idx],
            value: '',
          }));
          return {name, label, fields, value: label};
        } catch (e) {
          return null;
        }
      })
      .filter((e) => !!e);
  transforms.value = values;
  condition.selected = values[0]?.value;
  selected.value = getSelect();
};

watch(
    () => condition.input,
    (value) => {
      selected.value.fields.forEach((e) => (e.value = t(e.inter(value))));
    },
    {
      deep: true,
    }
);

watch(
    () => condition.selected,
    () => {
      condition.input = '';
      selected.value?.fields.forEach((e) => (e.value = ''));
      selected.value = getSelect();
    },
    {
      deep: true,
    }
);

const {stateful, datasource} = useLoader(props, {
  immediate: true,
  condition,
  watchCondition: false,
});
// const datasource = ref();
const getBindValue = computed(() => ({
  ...unref(attrs),
  ...props,
  data: datasource.value,
  chartHooks: useCapacity,
  stateful,
  toolbox: [EToolbox.Download, EToolbox.Table],
}));
watch(
    () => datasource.value,
    (data) => {
      data && convert(data);
    }
);
</script>

<!--库容曲线-->
<template>
  <div :class="`${prefixCls} h-full w-full min-w-0 min-h-0 flex flex-col`">
    <el-form :model="condition" inline>
      <el-form-item prop="selected" label="">
        <el-select
            v-model="condition.selected"
            class="condition-select"
            placeholder="转换"
        >
          <el-option
              v-for="item in transforms"
              :key="item.label"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="input" label="" class="condition-input">
        <el-input
            v-model="condition.input"
            type="number"
            :disabled="!datasource"
        >
          <template #prepend>
            <span>{{ selected?.name || '不可用' }}</span>
          </template>
        </el-input>
      </el-form-item>
      <template v-for="e in selected?.fields">
        <!-- eslint-disable-next-line vue/valid-v-for -->
        <el-form-item class="condition-output">
          <el-input v-model="e.value" readonly>
            <template #prepend>
              <span>{{ e.label }}</span>
            </template>
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<style lang="scss">
$prefixCls: #{$namespace}-chart-capacity-page-wrap;
.#{$prefixCls}{
   .el-form{
     display: grid;
     grid-template-columns: 30% 1fr 1fr 1fr;
     .el-form-item{
       margin-bottom: 5px;
     }
   }
}
</style>