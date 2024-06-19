import {defineAsyncComponent} from 'vue';

const toolboxCfg = [
    {
        label: '定位',
        image: 'mdi:location',
        //@ts-ignore
        component: defineAsyncComponent(
            () =>
                import(
                    '/src/layouts/map/components/ToolBox/components/CompositeLocator.vue'
                    )
        ),
        closeOnContentClick: false,
    },
    {
        label: '工具',
        image: 'fa6-solid:toolbox',
        //@ts-ignore
        component: defineAsyncComponent(
            () =>
                import('/src/layouts/map/components/ToolBox/components/SimpleMeasure.vue')
        ),
        closeOnContentClick: false,
        closeOnClick: false,
    },
    {
        label: '底图',
        image: 'mdi:map',
        attrs: {name: 'main'},
        //@ts-ignore
        // component: defineAsyncComponent(() => import('/@/layouts/map/components/ToolBox/components/Basemap.vue')),
        //@ts-ignore
        component: defineAsyncComponent(
            () => import('/src/layouts/map/components/ToolBox/components/BaseMap.vue')
        ),
        closeOnContentClick: true,
    }, {
        label: '专题',
        image: 'solar:layers-bold',
        //@ts-ignore
        component: defineAsyncComponent(
            () =>
                import(
                    '/src/layouts/map/components/ToolBox/components/StaticVisualResource.vue'
                    )
        ),
        closeOnContentClick: false,
        closeOnClick: false,
    }
];
const defToolboxCfg = toolboxCfg.filter(Boolean);
export default defToolboxCfg;
