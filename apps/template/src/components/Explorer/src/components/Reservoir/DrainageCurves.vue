<!--泄洪曲线-->
<template>
  <div :class="`${prefixCls} h-full w-full flex flex-col min-h-0 min-w-0`"> 
      <el-form :model="condition" inline>
        <div class="basic">
          <el-form-item prop="gate" label="" >
            <el-select v-model="condition.gate" placeholder="闸门">
              <el-option
                  v-for="item in gates"
                  :key="item.label"
                  :label="item.value"
                  :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="apertures" label="" >
              <el-select
                  multiple
                  :max-collapse-tags="4"
                  collapse-tags
                  filterable
                  allow-create
                  default-first-option
                  v-model="condition.apertures"
                  placeholder="开度"
              >
                <el-option
                    v-for="item in apertures"
                    :key="item.label"
                    :label="item.value"
                    :value="item.key"
                />
              </el-select>
          </el-form-item>
        </div>
        <!-- 转换-->
        <div class="trans">
          <el-form-item
              prop="topoSplitType"
              label=""
              
          >
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
          <el-form-item
              label="">
            <el-input placeholder="请输入水位" v-model="calcCondition.z">
              <template #append>
                <span>m</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
              label="">
            <el-input :placeholder="placeholder" v-model="calcCondition.q">
              <template #append>
                <span>{{ condition.selected == 1 ?'m': 'm³/s'  }}</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="calc"> 转换</el-button>
            <el-button type="danger" @click="reset"> 重置</el-button>
            <span class="calc-result"
            >结果（{{ calcText }}）: {{ calcResult ?? '--' }}  {{ unitText }}
          </span>
          </el-form-item>
        </div>
      </el-form>
    <UnifyChart v-bind="getBindValue"/>
  </div>
</template>
<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {computed, defineProps, onMounted, reactive, ref, shallowReactive, toRefs, unref, watch,} from 'vue';
import {EToolbox, UnifyChart, useLoader} from '@dfsj/components';
import {compProps, gateKdTrial} from '/@/components/Explorer';
import {useAttrs} from '@dfsj/hooks';
import {useDesign} from '/@/hooks/web/useDesign';
import {useDrainageCurves} from '@dfsj/echarts';

const {prefixCls} = useDesign('chart-drainage-curves-page-wrap');
const props = defineProps(compProps);
const {options} = props;
const {target} = toRefs(props);
const attrs = useAttrs({excludeDefaultKeys: false});
// const datasource = ref();

// 查询条件
const condition: any = reactive({
  gate: '',
  apertures: [],
  selected: 2,
});
const calcCondition = reactive({
  z: '',
  q: '',
});
const calcResult = ref(null);
const placeholder = computed(() => {
  return condition.selected == 1 ? '请输入开度' : '请输入流量';
});
const unitText = computed(() => {
  return condition.selected == 1 ? 'm³/s' : 'm';
});
const calcText = computed(() => {
  return condition.selected == 1 ? '流量' : '开度';
});

const gates: any[] = shallowReactive([]),
    apertures: any[] = shallowReactive([]),
    control: any = options.control,
    gate: any = control.gate,
    aperture: any = control.aperture;

const transforms = [
  {
    label: '转换计算：开度 > 流量',
    value: 1,
  },
  {
    label: '转换计算：流量 > 开度',
    value: 2,
  },
];

function calc() {
  let params = {
    dnid: condition.gate,
    stcd: props.target?.stcd,
    z: calcCondition.z,
  };
  if (!calcCondition.z || !calcCondition.q) {
    return ElMessage.info('参数填写不完整！');
  }
  if (condition.selected == 1) {
    params = {
      ...params,
      h: calcCondition.q,
    };
  } else if (condition.selected == 2) {
    params = {
      ...params,
      q: calcCondition.q,
    };
  }

  gateKdTrial(params).then((result) => {
    calcResult.value = result;
  });
}

watch(() => condition.selected, () => {
  reset()
})

function reset() {
  calcResult.value = null;
  calcCondition.q = null;
  calcCondition.z = null;
}

/**
 * 获取闸门信息。如果闸门存在，则继续获取开度信息。
 * 获取之前会清除当前图表数据。
 */
function loadGates() {
  stateful.loading();
  Promise.resolve()
      .then(() => (datasource.value = null))
      .then(() => gate.source(props.target))
      .then((data) => {
        if (data?.length) {
          gates.push(...data);
          condition.gate = data[0][gate.keymap.value];
          // loadApertures();
        } else {
          stateful.completed(true);
        }
      });
}

/**
 * 获取开度信息，如果开度存在，则继续获取曲线数据。
 */
function loadApertures() {
  stateful.loading();
  Promise.resolve()
      .then(() => aperture.source(props.target, condition))
      .then((data) => {
        apertures.length = 0;
        if (data?.length) {
          apertures.push(...data);
          let aps = extract(data, aperture.keymap, aperture.renderCount || 5);
          condition.apertures = aps;
          // fetchData()
        } else {
          stateful.completed(true);
        }
      });
}

/**
 * 抽取开度数据，一般开度有许多条，但没有必要全部显示，因此等距抽取一部分以显示。
 * @param items 所有开度信息
 * @param map 映射对象
 * @param count 抽取数量
 * @return 抽取后的开度数据
 */
function extract(items, map, count): number[] {
  const $extract = (
      range: number[],
      count: number,
      accept: number[] = []
  ): number[] => {
    accept.length = 0;
    let length = range[1] - range[0];
    if (length === 1) {
      accept[0] = range[0];
    } else if (length <= count) {
      for (let i = 0; i < length; i++) accept.push(range[0] + i);
    } else {
      let factor = (count - 1) / (length - 1);
      for (let i = 0; i < length; i++) {
        if (Math.floor((i - 1) * factor) !== Math.floor(i * factor)) {
          accept.push(range[0] + i);
        }
      }
    }
    return accept;
  };
  let range = [0, items.length];
  let indices = $extract(range, count);
  return indices.map((index) => items[index][map.value]);
}

watch(
    () => condition.apertures,
    (value, oldValue, onCleanup) => {
      fetchData();
    },
    {
      // deep:true
    }
);
watch(
    () => gates,
    (gate, oldValue) => {
      if (gate.length > 0) {
        condition.gate = gate[0]['key'];
      }
    },
    {
      // deep:true
    }
);
watch(
    () => condition.gate,
    (gate, oldValue) => {
      if (gate != '') {
        loadApertures();
      }
    },
    {
      deep: true,
    }
);

const {fetchData, stateful, datasource} = useLoader(props, {
  immediate: false,
  condition,
  watchCondition: false,
});
const getBindValue = computed(() => ({
  ...unref(attrs),
  ...props,
  chartHooks: useDrainageCurves,
  toolbox: [EToolbox.Download, EToolbox.Table],
  stateful,
  data: datasource.value,
}));

onMounted(() => {
  loadGates();
});
</script>
<style lang="scss">
$prefixCls: #{$namespace}-chart-drainage-curves-page-wrap;
.#{$prefixCls} {
   .el-form{
     display: flex;
     flex-direction: column;
     .basic{
       display: grid;
       grid-template-columns: 30% 1fr;
     }
     .trans{
       display: grid;
       grid-template-columns:  20% 1fr 1fr 40%;
     }
     .el-form-item{
       margin-bottom: 5px;
     }
   }

  .calc-result {
    font-size: 16px;
    font-weight: bolder;
    color: $primary-color-6;
    margin-left: 10px;
  }

  .el-input__wrapper {
    height: 30px;
  }
}
</style>
