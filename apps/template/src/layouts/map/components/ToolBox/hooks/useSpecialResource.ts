import {toRaw, unref} from 'vue';

import {GisSymbolKey, getGis} from '@/core/GisCache';
import getLayer from '@/core/Resource/config';
import Resource from '@/core/Resource/core/Resource';
import ResourceManage from '@/core/Resource/core/ResourceManage';
import {resource} from '@/layouts/map/components/ToolBox/config/resource';
import {findNode, diff} from '@dfsj/utils';
import {useSpecialResourceStoreWithOut} from "@/layouts/map/components/ToolBox/store/special.ts";

/**
 * 控制专题图层上图的
 */
//todo 因为不一定是组件勾选声明周期才能加载  还需要其它地方控制加载
//加载图层信息
let manager: any = null;
export function useSpecialResource() {
    onMounted(() => {
    });
    const checked = computed(() => useSpecialResourceStoreWithOut().checked);
    function setCheck(checks: Array<any>) {
        console.log('setCheck');
        useSpecialResourceStoreWithOut().checked = [...checks];
    }
    function additionalCheck(checks: Array<any>) {
        const exist = useSpecialResourceStoreWithOut().checked;
        // const { absent, additional, identical } = diff(exist, checks);
        // console.log('additionalCheck');
        useSpecialResourceStoreWithOut().checked = [...exist, ...checks];
    }

    function absentCheck(checks: Array<any>) {
        const exist = useSpecialResourceStoreWithOut().checked;
        const {absent, additional, identical} = diff(exist, checks);
        console.log('absentCheck');
        useSpecialResourceStoreWithOut().checked = [...absent, ...additional];
    }

    /** 对比*/
    function compareHandle({absent = [], additional = []}) {
        console.log('manager', manager);
        if (additional?.length) {
            additional.forEach(async (v) => {
                const target = findNode(resource, (item) => item.datatype == v, {
                    children: 'subs',
                });
                console.log({target});
                if (!target) return;
                let cfg = await getLayer(target);
                console.log('cfg', cfg);
                let res = new Resource(target.datatype, cfg);
                console.log('res', res);
                manager.add(res);
            });
        }
        if (absent.length) {
            absent.forEach(async (v) => {
                const target = findNode(resource, (item) => item.datatype == v, {
                    children: 'subs',
                });
                console.log({sssss: target});
                if (!target) return;
                manager.remove(target.datatype);
            });
        }
    }

    !manager &&
    watch(
        () => checked.value,
        (value, oldValue, onCleanup) => {
            const newer = toRaw(unref(value)) ?? [];
            const older = toRaw(unref(oldValue)) ?? [];
            const {absent, additional, identical} = diff(older, newer);
            console.log('复选', newer, older);
            console.log('复选', {absent, additional});
            compareHandle({absent, additional});
        }
    );

    function dispose() {
        if (manager) {
            manager.dispose?.();
            manager = null;
            useSpecialResourceStoreWithOut().checked = []
        }
    }

    function install() {
        nextTick(() => {
            if (!manager) manager = new ResourceManage(getGis(GisSymbolKey.default));
        });
    }

    return {
        dispose,
        install,
        setCheck,
        additionalCheck,
        absentCheck,
    };
}
