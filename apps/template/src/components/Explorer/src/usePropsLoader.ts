/**
 * 提供类似继承效果的方法，调用此方法拿到一些通用属性和方法。
 * @param props 原生组件的props
 * @param context 原生组件的context
 * @param options 位于props里面的options（子组件可以替换掉里面的某些属性）
 * @param override 用于覆盖现有属性或者方法
 */
import {State, StateEnum} from "@dfsj/components";
import {getter, isEmpty} from "@dfsj/utils";
import {debounce} from "@dfsj/hooks";
import {getCurrentInstance, Ref, shallowRef, watch, reactive, unref, onMounted, toRaw, computed} from "vue";
//@ts-ignore
export function usePropsLoader(target , props, context?, override?: any){
    const loaderDelay = props.loaderDelay ?? 400;
    const options = props.options ?? {};
    const loader = options.loader;
    const data: Ref = shallowRef(props.value) // 待呈现数据
    // 状态管理对象
    const stateful: State = new State(props.value != null ? StateEnum.FULL : StateEnum.NONE)

    const statefulValue = computed(()=>{
        return stateful?.stringify
    })
    // 查询条件
    const condition: any = reactive(getter(options.condition) || {})
    const ins:any = context ?? getCurrentInstance();

    const integration =
        override?.integration ||
        function () {
            return { target:toRaw(unref(target)) , condition:toRaw(unref(condition)) }
        }

    function load(): Promise<any> {
        stateful.loading()
        ins?.emit('update:loading', stateful.isLoading);
        return loader(integration())
            .then((value:any) => (data.value = value))
            .catch(() => stateful.error())
            .finally(() => {
                stateful.completed(isEmpty(data.value))
                ins?.emit('update:loading', stateful.isLoading);
            })
    }
    // 防抖处理句柄
    const handler = debounce(load,loaderDelay)
    onMounted(
        function () {
            if (!props.value && loader && options?.immediate !== false) {
                return handler()
            }
        }
    )
    watch(
        () => props.value,
        value => (data.value = value)
    )
    if (options.immediate !== false) {
        watch(() => target, handler,{deep:true})
    }
    watch(
        () => condition,
        () => {
            handler()
        },{
            deep:true
        }
    )

    return {
        data,
        stateful,
        condition,
        load:handler,
        loading:stateful.isLoading,
        statefulValue
    }
}