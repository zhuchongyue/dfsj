import {useRootStoreWithOut} from "@/store/root.ts";
import {aroundQueryDetails, aroundQueryExport, aroundQuerySubject} from "@/components/AroundQuery/src/api.ts";
import {downloadByUrl} from "@dfsj/utils";
import {GisSymbolKey} from "@/core/GisCache.ts";

interface Handlers {
    export: Function;
    summary: Function;
    details: Function;
}

export interface RendererOptions {
    /**  用于加载呈现数据的函数  */
    loader: (target: any) => Promise<any>,
    /** 指示呈现器在初始打开时是否立即查询数据。默认为true。 */
    immediate?: boolean
    /**  查询条件 */
    condition: { [key: string]: any },
    handlers: Handlers,
}

//初始值
export const AroundDefaultOptions = {
    //@ts-ignore
    loader: ({target, condition}) => {
        return aroundQuerySubject({
            adcd: target.adcd,
            around: {
                type: 1,
                lgtd: target.lgtd,
                lttd: target.lttd,
                radius: condition.radius,
            },
            stcd: target.stcd,
        }).then((result:any) => {
            return result
        })
    },
    handlers: {
        export: (data, motypes) => {
            const params = {
                gid: data.gid, motypes: motypes
            }
            aroundQueryExport(params).then((res) => {
                if (!res?.fileId) return;
                const  url  = `/file/file/${res.fileId}`;
                const fileName = res.fileName;
                downloadByUrl({url,fileName})
            })

        },
        summary: () => {
        },
        details: (item) => {
            useRootStoreWithOut().window.once({
                id: "around.query.details",
                title: `${item.name}列表`,
                sizes: ["70vw", "70vh"],
                content: () => import('./DataBrowser.vue'),
                props: {
                    pagination: {page: 1, size: 20},
                    filter: false,
                    loader: (condition, pagination) => {
                        //aroundQueryDetails
                        const params = {
                            page: pagination,
                            uuid: item.uuid,
                        }
                        return aroundQueryDetails(params).then((data: any) => ({
                            pagination: data?.pagination,
                            keymap: data?.keymap,
                            source: data?.source,
                            dimensions: data?.dimensions?.map((label, i) => ({label, field: String(i)})),
                        })).catch()
                    },
                    handlers: {
                        export: () => {

                        },
                        click: () => {

                        },
                        dblclick: () => {

                        }
                    }
                }
            })
        },
    },
    immediate: true,
    condition: {radius: 3},
    control: {
        preset: {
            names: "radius",
            units: "Km",
            items: [
                {value: 3, label: "3km"},
                {value: 5, label: "5km"},
                {value: 20, label: "20km"},
                {value: 50, label: "50km"},
                {value: 100, label: "100km"},
            ],
        },
    },
}
//周边查询
export const AroundQueryProps = {
    sizer: Number,          // 用于监听上层组件尺寸改变的渠道
    value: [Object, Array], // 要呈现资源的部分信息数据（一般由函数提供，但某些特殊情况需要直接提供）
    target: Object,         // 要呈现的资源对象
    options: {
        type: Object as PropType<RendererOptions>,
        default: () => AroundDefaultOptions
    },
    title: {
        type: String,
        default: () => ''
    },
    gisKey: {
        type: Symbol,
        default: () => GisSymbolKey.default
    },
    narrow: {
        type: Boolean,
        default: () => true
    }
}
export declare type Dimension = {
    // 列id，在排序、过滤列时使用
    id?: string,
    // 表头所显示的标签
    label?: string,
    // 字段名称，某些列可以不提供（通常在多行表头中，或者render为index、action时不需要）
    field?: string,
    // 列宽（自行带单位）
    width?: string,
    // 固定列
    fixed?: boolean,
    // 列序号，序号越高的越排在后面，当表头为多列时，此属性非常有用，否则可能出现顺序错误
    index?: number,
    // 提供一个函数对单元格所显示的值进行格式化，比如日期
    format?: (value: any, model?: any) => any,
    // 单元格默认值，当且仅当单元格的值为null或者undefined时使用
    default?: any,
    // 指示此列是否强制显示（当启用过滤列时使用）
    mandatory?: boolean,
    // 如果为true，此列将永不在表格中显示，启用过滤也不行
    // 设置此值是用于弹窗编辑表格数据时，某些列不显示而又希望被编辑
    never?: boolean,
};
export declare type Pagination = {
    // Current page index.
    page: number,
    // Specify how many row count in one page.
    size: number,
    // 分页总数量
    count?: number,
    // 数据总行数
    total?: number,
    // 分页大小，如不提供，将使用默认值
    sizes?: number[],
    // 分页栏可见分页数
    length?: number,
    // 当display为simple时，以简单形式呈现（取消总行数和分页大小选择）
    // 当display为simplest时，以最简形式显示（除为simple的形式外，还不显示预设分页）
    display?: "simple" | "simplest"
};

//详情的
export const AroundQueryDataBrowserProps = {
    // 表头配置
    dimensions: Array as PropType<Dimension[]>,
    // 分页配置
    pagination: [Object] as PropType<Pagination>,
    // 查询条件对象
    condition: Object,
    // 表格事件处理对象（单击，双击）
    // {"row:click"?:(row,keymap)=>void,"row:dblclick"?:(row,keymap)=>void}
    action: Object,
    // 数据加载函数，包含两个参数（condition：查询条件，pagination：分页对象）
    loader: Function,
    // 是否使用条件过滤（如果为false则不允许输入查询条件，如关键字等）
    // 默认过滤仅有一个关键字
    filter: {
        type: Boolean,
        default: true,
    },
}