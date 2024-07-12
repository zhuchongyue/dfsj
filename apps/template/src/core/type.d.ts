export const enum Graphic {
    POINT = 'point',
    BILLBOARD = 'billboard',
    POLYLINE = 'polyline',
    POLYGON = 'polygon',
    OVERLAY = 'overlay',
    TEXT = 'text',
    MARK = 'mark',
    CURSOR = 'cursor',
}
export type GraphicFields = "*" | string[] | { alias: string, field: string, value: any }[];
export type GraphicTypes =  typeof Graphic[keyof typeof Graphic] | Graphic;
/**一个用于从数据中获取某个属性的函数 */
export type PropertyGetter<T extends any = any> = (properties: any) => T;
/** 定义特征图层可能使用的图形类型，除常规图形外，还支持wkt和geojson。 */
declare type FeatureLayerGraphic = GraphicTypes | "wkt" | "geojson";
/**  图形提示信息的字段配置（label-value格式）。 */
export type OverlayContentField = {
    label: string,                  // 字段label
    field: string | PropertyGetter, // 字段field
    units?: string | PropertyGetter,// 字段单位
    default?: any,                  // 默认值
}
/**图形信息提示配置，即当属性移动到图形上时，所显示的信息内容配置。*/
export interface GraphicOverlay {
    fixed?: boolean,                // 是否固定提示信息（固定后鼠标移开不消失）
    title?: string | PropertyGetter,// 提示的标题信息
    loader?: (properties) => Promise<any>, // 如果图形携带的信息无法满足要求，可以设置此函数从服务端获取新信息以显示
    overtime?: number,              // 信息过期时间（提示信息会缓存，可设置此属性以获取最新信息，默认缓存30分钟）
    /** 信息提示内容，可以通过字段集生成，或者直接提供固定文本，或者提供一个函数来动态获取（函数可返回html格式内容）。*/
    content: string | PropertyGetter | OverlayContentField[];
    contentEventType: string  // content触发事件，遗留问题现在只支持传入：‘click’，解决当前交互问题！
}
/** 组合配置，设计为用一套配置满足多种图形的添加要求，但实际上可能无法满足所有的，因此按需配置！ */
export interface CompositeGraphicConfig {
    id: string | PropertyGetter,                       // 获取图形的唯一id，不可重复
    coordinate: string | PropertyGetter,               // 获取图形的坐标数据，wkt、geojson同意适用
    // animation?: Animation.Animate | PropertyGetter<Animation.Animate>, // 动画配置
    projection: { from: string | null, to: string  | null },          // 数据投影配置，必须提供
    selectable?: boolean,                              // 设置该图形是否可选（不可选时，单击图形时不会被收集）
    fields: GraphicFields,                             // 设置图形所携带的数据（只保留关键信息可节省内存开销）
    point?: StyleConfig.Point,                         // 意同
    billboard?: StyleConfig.Billboard,                 // 意同
    polyline?: StyleConfig.Polyline,                   // 意同
    polygon?: StyleConfig.Polygon,                     // 意同
    dynamic?: StyleConfig.Dynamic,                     // 意同
    overlay?: GraphicOverlay,                          // 意同
}
/**
 * 图形样式相关配置。
 */
export namespace StyleConfig {
    /** 适用于渐变线的颜色设置   */
    export type OffsetColor = {
        offset: number,                         // 颜色偏移量(0~1)
        color: string                         // 颜色
    };
    /**  基础样式配置，其他图形的样式需要继承此接口。
     *  注意，某些样式的属性可以用一个函数获得，函数接收一个参数：图形携带的数据。
     */
    export interface Basic {
        zIndex?: number | PropertyGetter,       // 图形层级
        label?: Label | Label[],                // 注意：仅point和billboard支持多个label，其他均不支持
        zooms?: [min: number, max: number],     // 某个缩放（分辨率）范围内图形可见（仅使用于ol，仅特征图层可用）
        views?: [min: number, max: number],     // 某个距离范围内图形可见（仅使用于cesium）
        opacity?: number | PropertyGetter,      // 图形透明度
        overlay?: GraphicOverlay,               // 图形提示信息配置
        highlight: any               // 高亮样式配置，只能是StyleConfig中的某一项（需与style一致）
    }

    /**
     * 点图形配置，点图形不包含图标
     */
    export interface Point extends Basic {
        size?: number | PropertyGetter,          // 尺寸（像素单位）
        color?: string | PropertyGetter,         // 颜色
        outlineWidth?: number | PropertyGetter,  // 外边框宽度
        outlineColor?: string | PropertyGetter,  // 外边框颜色
    }

    /**
     * 图标点图形配置，本质为一个点图形，但可显示一个图标
     */
    export interface Billboard extends Basic {
        color?: string                         // 图标颜色，仅当image为svg时使用
        scale?: number | PropertyGetter,         // 图标缩放值
        image: string | PropertyGetter,          // 图标路径
        rotation?: number | PropertyGetter,      // 图标旋转角度（非弧度）
        offset?: [x: number, y: number],         // 图标便宜量
    }

    /**
     * 线段配置。
     */
    export interface Polyline extends Basic {
        /**
         * 线条颜色，当color为数组时，启用线性渐变，并忽略外边框！！！
         */
        color: string | string[] | OffsetColor[] | PropertyGetter<string | string[] | OffsetColor[]>,
        width: number | PropertyGetter,          // 线宽（像素单位）
        style?: number[] | PropertyGetter,       // 设置虚线，例[5,10]
        lineCap?: CanvasLineCap,                 // context lineCap
        outlineWidth?: number | PropertyGetter,  // 外边框大小
        outlineColor?: string | PropertyGetter,  // 外边框颜色
    }

    /**
     * 面图形配置（多面或单面）。
     */
    export interface Polygon extends Basic {
        color?: string | PropertyGetter,         // 填充颜色
        outlineWidth?: number | PropertyGetter,  // 外边框大小
        outlineColor?: string | PropertyGetter,  // 外边框颜色
    }

    /**
     * 图形文本配置，文本一般不单独显示，可随其他图形一并显示，某些图形可显示多个文本（如point、billboard）
     */
    export interface Label extends Basic {
        align?: CanvasTextAlign | PropertyGetter<CanvasTextAlign>,
        font?: string,                           // CSS font
        offset?: [x: number, y: number],         // 文本偏移量（相对中心位置）
        placement?: 'point' | 'line',            // 看ol
        color?: string | PropertyGetter,         // 字体颜色
        rotation?: number | PropertyGetter,      // 文本旋转角度
        outlineWidth?: number | PropertyGetter,  // 文本外边框大小
        outlineColor?: string | PropertyGetter,  // 文本外边框颜色
        text?: string | PropertyGetter           // 具体要显示的文本内容
    }

    /**
     * 动态图形配置，根据属性动态返回图形类型。
     */
    export interface Dynamic extends Basic {
        // graphic: (properties: any) => GraphicTypes,
    }
}

/**
 * 仅用于特征图层{@link FeatureLayerConfig}的图形读取配置。
 * ##特征图层必须提供此配置信息。
 */
export interface ListFormatGraphicConfig extends CompositeGraphicConfig {
    // 固定为list
    type: "list",
    // 渲染图形（即将数据渲染为何种图形）
    graphic?: FeatureLayerGraphic | PropertyGetter<FeatureLayerGraphic>,
}
/**
 * 样式呈现器相关定义。
 * 样式呈现器是用于特征图层{@link FeatureLayerConfig}的样式配置，
 * 通常，特征图层只渲染一种类型的图形（比如点、线、面）。但是，可以通过配置实现
 * 一个特征图层显示多种图形（比如聚合点与普通点，具体实现看下面的定义）。
 */
export namespace StyleRendererConfig {
    export interface Renderer {
        type: string;                // 呈现器类型
    }
    type UniqueRendererItem = {
        /**
         * 样式类型，即图形以何种样式进行渲染。
         *
         * 注意：这里的type不同于graphic的type，
         * graphic的type决定图形类型，
         * 这里的type决定样式类型。
         */
        type: GraphicTypes,
        value: string | number,      // 唯一值，必须与field的返回值一致
        style: any,                  // 样式配置，只能是StyleConfig中的某一项
        highlight: any               // 高亮样式配置，只能是StyleConfig中的某一项（需与style一致）
    };

    /**
     * 唯一值呈现器配置。根据数据项中的某个确定值（只能是string或者number）从{@link UniqueRenderer.items}
     * 中查找对应的配置，来获取图形类型、样式配置及高亮配置来渲染图形。
     * 如果没有找到对应的值，那么将使用默认({@link UniqueRenderer.loses})。
     */
    export interface UniqueRenderer extends Renderer {
        type: "unique",               // 固定为"unique"，不可省略
        /**
         * 从数据中的那个字段来获取唯一值，或者通过函数返回唯一值。
         * 当field为string时，表示从properties中的field指定的字段获取唯一值。
         * 当field为函数时，则由函数决定唯一值（聚合图层时必须是函数，因为无法由单一字段决定）。
         */
        field: string | PropertyGetter<string>,
        /**
         * 默认配置，如果从items没有找到field指定的样式配置，则使用此配置。
         */
        loses?: UniqueRendererItem,
        /**
         * 对field的每一个返回值进行配置
         */
        items?: UniqueRendererItem[],
    }
    type ClassRendererItem = {
        type: GraphicTypes,           // 设置数据被渲染的图形类型
        value: [min: number, max: number], // 取值范围，包含最小值，不包含最大值
        style: any,                   // 样式配置，只能是StyleConfig中的某一项
        highlight: any                // 高亮样式配置，只能是StyleConfig中的某一项（需与style一致）
    }
    /**
     * 分段渲染呈现器配置。即将某个数据范围渲染为某种图形样式。
     * ##属性说明参见{@link UniqueRenderer}。
     */
    export interface ClassRenderer extends Renderer {
        type: "class",
        field: number | PropertyGetter<number>,
        loses?: ClassRendererItem,
        items?: ClassRendererItem[],
    }
}
/**
 * 特征图层专用配置
 */
export interface FeatureLayerConfig {
    type: string,
    custom?: { [key: string]: any },  // 自定义图层参数
    id:string,
    /**
     * 定义数据的加载策略， true 当地图边界改变后重新加载
     */
    listener?:boolean,
    /**
     * 具体的加载函数。当地图加载时会取消正在加载的api请求，以免造成资源浪费。
     * @param options 地图信息（包括extent等其他自定义信息）
     * @param signal 取消api请求的信号
     */
    loader?: (options) => Promise<any[]>,
    /**
     * 图形数据格式，支持geojson，wkt或者list。
     * list表示返回的数据为一个集合，至于如何读取集合中的数据渲染为图形，参见{@link ListFormatGraphicConfig}。
     */
    format?: "geojson" | "wkt" | ListFormatGraphicConfig,
    /**  * 图形提示信息配置。 */
    overlay?: GraphicOverlay,
    /** * 图形唯一值属性或者函数，设计用于对比旧数据与新数据以节省资源（同时避免相同图形发生闪烁）！*/
    identity?: string | PropertyGetter,
    /** * 图形样式呈现器，必须提供！ */
    styleRenderer?: StyleRendererConfig.UniqueRenderer | StyleRendererConfig.ClassRenderer,
}
