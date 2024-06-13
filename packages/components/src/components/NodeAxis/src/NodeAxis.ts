import {h}                  from "vue";
import {defineComponent}    from "vue";
import {onMounted}          from "vue";
import {getCurrentInstance} from "vue";
import {PropType}           from "vue";
import NodeRender           from "./NodeRender";
/**
 * 节点轴组件。
 * 节点轴是一条如时间轴一样的组件，组件上显示一条滑槽，滑槽上可以显示一些关键节点（或不显示任何关键节点）。
 * 当鼠标在滑槽上点击时，获得点击的节点位置，并向外派发事件（update:frame）（其他组件收到该事件进行处理）。
 * 渲染节点的方式有多种，但目前仅实现了canvas。
 */
export default defineComponent({
  props: {
    // 具体渲染节点的接口
    render: Object as PropType<NodeRender>,
  },
  emits: ["update:frame"],
  setup(props, context) {
    const instance = getCurrentInstance();
    const accept   = index => context.emit("update:frame", index);
    onMounted(() => {
      props.render.initialize(instance.refs.container as HTMLElement, accept);
      props.render.render();
    });
    return () => h("div", {ref: "container", class: "component node-axis"});
  },
});