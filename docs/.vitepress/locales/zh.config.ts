export default {
    label: '中文',
    lang: 'zh',
    link: '/',
    title: '@dfsj 开发文档',
    base: '/zh/',

    manifest: false,
    themeConfig: {
        nav: [
            {
                text: '快速开始',
                items: [
                    {text: '快速上手', link: '/zh/guide/get-start'},
                    {text: '架构图', link: '/zh/guide/framework-chart'},
                    {text: '脚手架', link: '/zh/guide/cli'},
                    {text: '规范', link: '/zh/guide/rules'},
                ],
            },
            {text: 'components', link: '/zh/components/global'},
            {text: 'echarts', link: '/zh/echarts/useAssist'},
            {text: 'ol', link: '/zh/ol/global'},
            {text: 'cesium', link: '/zh/cesium/global'},
            {text: 'guest', link: '/zh/guest/introduce'},
            {text: 'hooks', link: '/zh/hooks/useRequest'},
            {text: 'utils', link: '/zh/utils/is'},
            {text: '拓展', link: '/zh/extension/design' },

            {
                text: '文档/工具',
                items: [
                    {text: 'Cesium(v1.177.0)', link: 'http://10.10.12.217:9399/third-party-docs/cesium/Documentation/index.html'},
                    {text: 'Cesium Sandcastle', link: 'http://10.10.12.217:9399/third-party-docs/cesium/Apps/Sandcastle/index.html'},
                    {text: 'Three', link: 'http://10.10.12.217:9399/third-party-docs/threejs/docs/index.html'},
                    {text: 'Three Editor', link: 'http://10.10.12.217:9399/third-party-docs/threejs/editor/index.html'},
                    {text: 'Earth-UI', link: 'http://10.10.12.217:9399/earth-ui/'},
                    {text: 'Shaper', link: 'http://10.10.12.217:9399/third-party-docs/mapshaper/index.html'},
                    {text: 'Shader', link: 'https://www.shadertoy.com/'},
                    {text: 'GeoAtlas', link: 'https://datav.aliyun.com/portal/school/atlas/area_generator/'},
                    {text: 'Gltf-Viewer', link: 'https://gltf-viewer.donmccurdy.com/'},
                    {text: 'CssPortal', link: 'https://www.cssportal.com/'},
                    {text: 'Iconify', link: 'https://icon-sets.iconify.design/'},
                ],
            },
            {text: '问题建议', link: '/zh/issue/index' },
        ],
        sidebar: {
            '/zh/guide/': [
                {
                    text: '快速开始',
                    items: [
                        {text: '简介', link: '/zh/guide/introduction'},
                        {text: '架构图', link: '/zh/guide/framework-chart'},
                        {text: '快速上手', link: '/zh/guide/get-start'},
                        {text: '脚手架', link: '/zh/guide/cli'},
                        {text: '规范', link: '/zh/guide/rules'},
                        {text: '运行环境', link: '/zh/guide/run-env'},
                        {text: '技术扩展', link: '/zh/guide/tec-ext'},
                    ]
                }
            ],
            '/zh/hooks/': [
                {
                    items: [
                        {
                            text: '<b>Async</b>',
                            items: [{text: 'useRequest', link: '/zh/hooks/useRequest'}]
                        },
                        {
                            text: '<b>Side</b>',
                            items: [
                                {text: 'useDebounce', link: '/zh/hooks/useDebounce'},
                                {text: 'useDebounceFn', link: '/zh/hooks/useDebounceFn'},
                                {text: 'useThrottle', link: '/zh/hooks/useThrottle'},
                                {text: 'useThrottleFn', link: '/zh/hooks/useThrottleFn'},
                                {text: 'useInterval', link: '/zh/hooks/useInterval'},
                                {text: 'useTimeout', link: '/zh/hooks/useTimeout'}
                            ]
                        },
                        {
                            text: '<b>State</b>',
                            items: [
                                {text: 'useToggle', link: '/zh/hooks/useToggle'},
                                {text: 'useBoolean', link: '/zh/hooks/useBoolean'},
                                {text: 'useDate', link: '/zh/hooks/useDate'},
                                {text: 'useSessionStorage', link: '/zh/hooks/useSessionStorage'},
                                {text: 'useLocalStorage', link: '/zh/hooks/useLocalStorage'},
                                {text: 'useCookie', link: '/zh/hooks/useCookie'},
                                {text: 'useNetwork', link: '/zh/hooks/useNetwork'},
                                {text: 'useSet', link: '/zh/hooks/useSet'},
                                {text: 'useMap', link: '/zh/hooks/useMap'},
                                {text: 'useWebSocket', link: '/zh/hooks/useWebSocket'}
                            ]
                        },
                        {
                            text: '<b>UI</b>',
                            items: [
                                {text: 'useVirtualList', link: '/zh/hooks/useVirtualList'},
                                {text: 'useDynamicList', link: '/zh/hooks/useDynamicList'},
                                {text: 'useMediaQuery', link: '/zh/hooks/useMediaQuery'},
                                {text: 'useExternal', link: '/zh/hooks/useExternal'},
                                {text: 'useFullscreen', link: '/zh/hooks/useFullscreen'},
                                {text: 'useDocumentVisibility', link: '/zh/hooks/useDocumentVisibility'},
                                {text: 'useTextSelection', link: '/zh/hooks/useTextSelection'},
                                {text: 'useQRCode', link: '/zh/hooks/useQRCode'}
                            ]
                        },
                        {
                            text: '<b>Advanced</b>',
                            items: [{text: 'useLockFn', link: '/zh/hooks/useLockFn'}]
                        }
                    ]
                }
            ],


            '/zh/components/': [
                {
                    items: [
                        {
                            text: '<b>全局组件</b>',
                            items: [
                                {text: 'Boards抽屉管理器组件', link: '/zh/components/boards'},
                                {text: 'Windows弹窗管理器组件', link: '/zh/components/windows'},
                            ]
                        },
                        {
                            text: '<b>功能组件</b>',
                            items: [
                                {text: 'Form 表单组件', link: '/zh/components/form'},
                                {text: 'Modal 弹窗组件', link: '/zh/components/modal'},
                                {text: 'Table 表格组件', link: '/zh/components/table'},
                                {text: 'Editor 富文本组件', link: '/zh/components/editor'},
                                {text: 'Icon 图标组件', link: '/zh/components/icon'},
                                {text: 'SvgIcon 图标组件', link: '/zh/components/svgicon'},
                                {text: 'DatePicker 日期选择组件', link: '/zh/components/datepicker'},
                                {text: 'Highlight 高亮组件', link: '/zh/components/highlight'},
                                {text: 'InputPassword密码强度组件', link: '/zh/components/inputpassword'},
                                {text: 'Stateful状态组件', link: '/zh/components/stateful'},
                                {text: 'UnifyChart图表组件', link: '/zh/components/unifychart'},
                                {text: 'Video视频播放组件', link: '/zh/components/video'},
                            ]
                        },
                    ]
                }
            ],

            '/zh/echarts/': [
                {
                    items: [
                        {text: 'useAssist转换配置', link: '/zh/echarts/useAssist'},
                        {text: 'useECharts初始化', link: '/zh/echarts/useECharts'},
                        {
                            text: 'useCapacity库容曲线', link: '/zh/echarts/useCapacity'
                        },
                        {
                            text: 'useDrainageCurves泄洪曲线', link: '/zh/echarts/useDrainageCurves'
                        },
                        {
                            text: 'useComplexHydrology复杂水文', link: '/zh/echarts/useComplexHydrology'
                        },
                        {
                            text: 'useCrossSection横断面示意图', link: '/zh/echarts/useCrossSection'
                        },
                        {
                            text: 'useDamSchematic大坝示意图', link: '/zh/echarts/useDamSchematic'
                        },
                        {
                            text: 'useStageflow水位流量图', link: '/zh/echarts/useStageflow'
                        },
                        {
                            text: 'useRainfall降雨量关系图', link: '/zh/echarts/useRainfall'
                        },
                        {
                            text: 'useHydrology基础水文', link: '/zh/echarts/useHydrology'
                        }
                    ]
                }
            ],
            '/zh/utils/': [
                {
                    items: [
                        {
                            text: '通用', link: '/zh/utils/common'
                        },
                        {
                            text: 'is类型', link: '/zh/utils/is'
                        },
                        {
                            text: 'mitt总线',
                            link: '/zh/utils/mitt'
                        },
                        {
                            text: 'color颜色',
                            link: '/zh/utils/color'
                        },
                        {
                            text: 'browser浏览器',
                            link: '/zh/utils/browser'
                        },
                        {
                            text: '图片转换',
                            link: '/zh/utils/file'
                        },
                        {
                            text: '文件下载',
                            link: '/zh/utils/download'
                        },
                        {
                            text: 'uuid',
                            link: '/zh/utils/uuid'
                        },
                        {
                            text: 'BEM规范类名',
                            link: '/zh/utils/bem'
                        },
                        {
                            text: 'propTypes',
                            link: '/zh/utils/propTypes'
                        },
                        {
                            text: 'dom',
                            link: '/zh/utils/dom'
                        },
                        {
                            text: '空值',
                            link: '/zh/utils/empty'
                        },
                        {
                            text: '加密',
                            link: '/zh/utils/encryption'
                        },

                        {
                            text: '缓存',
                            link: '/zh/utils/cache'
                        },
                        {
                            text: '任务',
                            link: '/zh/utils/schedule'
                        },
                        {
                            text: '差值',
                            link: '/zh/utils/diff'
                        },
                        {
                            text: '树',
                            link: '/zh/utils/tree'
                        },
                        {
                            text: '格式化',
                            link: '/zh/utils/format.md'
                        },
                        {
                            text: '验证',
                            link: '/zh/utils/validate.md'
                        },
                    ]
                }
            ],
            '/zh/cesium/': [
                {
                    items: [
                        {text: '全局 API', link: '/zh/cesium/global'},
                        {text: '基础 API', link: '/zh/cesium/base'},
                        {text: '地图 API', link: '/zh/cesium/tile'},
                        {text: '图层 API', link: '/zh/cesium/layer'},
                        {
                            text: '<b>要素 API</b>',
                            items: [
                                {text: '矢量要素', link: '/zh/cesium/overlay-vector'},
                                {text: '图元要素', link: '/zh/cesium/overlay-primitive'},
                                {text: '标绘要素', link: '/zh/cesium/overlay-plot'}
                            ]
                        },
                        {text: '材质 API', link: '/zh/cesium/material'},
                        {text: '工具 API', link: '/zh/cesium/tools'},
                        {
                            text: '效果 API',
                            items: [
                                {text: '场景效果', link: '/zh/cesium/effect-scene'},
                                {text: '动画效果', link: '/zh/cesium/effect-animation'}
                            ]
                        }
                    ]
                }
            ],
            '/zh/ol/': [
                {
                    items: [
                        {text: '全局 API', link: '/zh/ol/global'},
                        {text: '基础 API', link: '/zh/ol/global'},
                        {text: '地图 API', link: '/zh/ol/global'},
                        {
                            text: '<b>影像 API</b>',
                            items: [
                                {text: 'WMS', link: '/zh/ol/global'},
                                {text: 'WMTS', link: '/zh/ol/global'},
                                {text: 'WFS', link: '/zh/ol/global'}
                            ]
                        },
                        {
                            text: '<b>图层 API</b>',
                            items: [
                                {text: 'WKT', link: '/zh/ol/global'},
                                {text: '矢量', link: '/zh/ol/global'},
                                {text: 'GeoJson', link: '/zh/ol/global'}
                            ]
                        },
                        {
                            text: '<b>要素 API</b>',
                            items: [
                                {text: '点要素', link: '/zh/ol/global'},
                                {text: '线要素', link: '/zh/ol/global'},
                                {text: '面要素', link: '/zh/ol/global'}
                            ]
                        },
                        {text: '测量 API', link: '/zh/ol/global'},
                        {text: '标绘 API', link: '/zh/ol/global'}
                    ]
                }
            ],
            '/zh/extension/': [
                {
                    items: [
                        {text: '设计', link: '/zh/extension/design'},
                        {text: 'webgl', link: '/zh/extension/webgl'},
                    ]
                }
            ],
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        outlineTitle: '目录',
        search: {
            provider: 'local'
        }
    }
}
