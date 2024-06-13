/**
 * 获取加载的图表数据
 * 1、直接请求
 * 2、需要参数请求
 * 3、需要复杂先后接口请求
 * */
import {getCurrentInstance, onMounted, ref, watch} from 'vue';

import {State, StateEnum} from '../../../Stateful';
import {useLoaderProps} from '../props';
import {isEmpty, isNullOrUnDef} from '../../../../utils/is';

export function useLoader(
  props: useLoaderProps,
  { immediate = true, condition = {}, watchCondition = true }
) {
  const datasource = ref();
  const stateful = new State(datasource.value != null ? StateEnum.FULL : StateEnum.NONE);
  const ins = getCurrentInstance();

  watch(
    () => stateful.state,
    (value) => {
      if (ins?.emit) {
        ins.emit('update:loading', stateful.isLoading);
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  watchCondition &&
    !isEmpty(condition) &&
    watch(
      () => condition,
      () => {
        fetchData();
      },
      {
        deep: true,
      }
    );

  const fetchData = async () => {
    stateful.loading();
    if (props.options?.loader) {
      try {
        let result = await props.options.loader({
          target: props.target,
          condition: condition,
        });
        console.log('曲线结果', result);
        if (!isNullOrUnDef(result) && !isEmpty(result)) {
          datasource.value = result;
        } else {
          datasource.value = null;
        }
      } catch (e) {
        stateful.error();
        datasource.value = null;
      } finally {
        let empty = isNullOrUnDef(datasource.value) || isEmpty(datasource.value);
        console.log({ empty });
        stateful.completed(empty);
      }
    }
  };
  immediate &&
    onMounted(() => {
      console.log('立即执行');
      fetchData();
    });

  return {
    datasource,
    fetchData,
    stateful,
  };
}
