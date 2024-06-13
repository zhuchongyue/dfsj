# Modal 弹窗组件

 项目的弹窗。
 
 
### 基础用法
<preview path="../../examples/components/Modal/Modal.vue" title="使用方法" description="参照当前实例代码"></preview>
 
## 属性

```ts
export type Options = {
    id: string;
    onAction?: (action: string, model?: {}) => void;
    onSubmit?: (model?: {}) => void;
    onCancel?: () => void;
    content: string | Function;
    directly?: boolean;
    props?: {
        [key: string]: any;
    };
} & Partial<typeof baseProps> &
    Partial<typeof headerProps> &
    Partial<typeof footerProps>;
export const WindowsProps = {
    items: { type: Array as PropType<Options[]> },
    front: String,
    layer: Number,
};
```
 
```ts
 
export const baseProps = {
    visible: Boolean,
    zIndex: {
        type: Number,
        default: () => zIndex++,
    },
    sizes: Array,
    offset: Object /**  初始offset{top,left,right,bottom}.   */,
    overflow: String /** 是否允许内容滚动（css原生属性）.   */,
    maximum: Boolean /**   * 指示弹窗是否允许最大化。   */,
    modally: Boolean /**   * 指示弹窗是否使用遮罩。   */,
    movable: {
        type: [Boolean, String],
        default: true,
    } /**   * 指示弹窗是否允许移动。   */,
    position: {
        type: String,
        default: 'fixed',
    } /**   * 指示弹窗的定位方式（css原生属性）.   */,
    resizeable: Boolean /**   * 指示弹窗是否可以调整大小。   */,
    /**
     * 设置弹窗的移动边界（如果允许移动的话），启用此属性可限制弹窗移出某个范围。
     * 默认情况下，只有上边界为0（防止将header移除屏幕）。
     * >
     * 可选值（可多个同时设定，每个值都可以设置为null）:
     * * top: 上边界;
     * * right: 右边界;
     * * bottom: 下边界;
     * * left: 左边界;
     *
     */
    extent: {
        type: Object,
        default: () => ({ top: 0 }),
    },
    modalClass: String /**   * 附加弹窗顶层class.   */,
    contentClass: String /**   * 附加弹窗内容class   */,
    /**   * 设置弹窗的打开/关闭动画，如果不提供，则使用默认动画。
     *
     * 包含两个字段:
     * * enter: 为 'enter-active-class'
     * * leave: 为 'enter-leave-class'
     */
    animation: Object,
};
//头部的header props
export const headerProps = {
    header: { type: Boolean, default: true },
    maximizer: { type: Boolean, default: true },
    closer: { type: Boolean, default: true },
    // maximum: { type: Boolean, default: false },
    maximum: propTypes.any.def(() =>false),
    headerIcon: { type: String, default: 'mdi:map-marker' },
    title: propTypes.oneOfType([propTypes.func, propTypes.string]).def('--'),
    titleAlign: propTypes.oneOf(['start', 'center', 'end']).def('start'),
    titleBefore: propTypes.func,
    titleAfter: propTypes.func,
    switcherIcon: { type: Object, default: () => switcher },
    closerIcon: { type: Object, default: () => closer },
    onSwitch: propTypes.func.def(() => {}),
    onClose: propTypes.func.def(() => {}),
};
//底部footer props
export const footerProps = {
    footer: { type: Boolean, default: false }, //底部
    cancel: { type: Boolean, default: true }, //底部取消按钮
    submit: { type: Boolean, default: true }, //底部提交按钮
    submitOpt: { type: Object, default: () => submit }, //提交按钮配置
    cancelOpt: { type: Object, default: () => cancel }, //取消按钮配置
    onCancel: propTypes.func.def(() => {}),
    onSubmit: propTypes.func.def(() => {}),
};
```
 