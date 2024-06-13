import {getCurrentInstance, reactive, Ref, ref, unref, watchEffect} from 'vue';
import {useTimeoutFn} from './useTimeout';
import {clamp} from '../utils';

export interface UseModalDragMoveContext {
  maximum: Ref<boolean>;
  props: any;
  draggable: Ref<boolean>;
  destroyOnClose: Ref<boolean | undefined> | undefined;
  visible: Ref<boolean>;
  moverEl?: string;
}

export function useModalDragMove(context: UseModalDragMoveContext) {
  console.log('拖拽..............................................................');
  const moving = ref(false);
  const locator = reactive({ top: null, bottom: null, left: null, right: null });
  const sign = reactive({ x: undefined, y: undefined, l: undefined, t: undefined });
  const that = getCurrentInstance() as any;
  const getStyle = (dom: any, attr: any) => {
    return getComputedStyle(dom)[attr];
  };
  const drag = (wrap: any) => {
    if (!wrap) return;
    wrap.setAttribute('data-drag', unref(context.draggable));
    const dialogHeaderEl = wrap.querySelector(`.${context.moverEl}`);
    const { proxy } = that;
    const dragDom = proxy.$el;
    // console.log('dragDom', dragDom, dialogHeaderEl);
    if (!dialogHeaderEl || !dragDom || !unref(context.draggable)) return;
    dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.onmousedown = (e: any) => {
      if (!e) return;
      const element = context.props.modally ? that.refs.body : proxy.$el;
      const bounder = element.getBoundingClientRect();
      sign.l = bounder.left;
      sign.t = bounder.top;
      sign.x = e.x;
      sign.y = e.y;
      moving.value = true;
      document.onmousemove = function (event) {
        const moved = sign.x !== event.x || sign.y !== event.y;
        if (moved && moving.value && !context.maximum.value) {
          event.preventDefault();
          delete locator.right;
          delete locator.bottom;
          if (context.props.extent) {
            const ex = context.props.extent;
            const dx = event.x - sign.x;
            const dy = event.y - sign.y;
            console.log('that.refs', that.refs, that);
            const br = that.refs.body.getBoundingClientRect();
            const el = ex.left != null ? ex.left : -Number.MAX_VALUE;
            const et = ex.top != null ? ex.top : -Number.MAX_VALUE;
            const mr =
              ex.right != null ? window.innerWidth - ex.right - br.width : Number.MAX_VALUE;
            const mb =
              ex.bottom != null ? window.innerHeight - ex.bottom - br.height : Number.MAX_VALUE;
            locator.left = clamp(sign.l + dx, el, mr);
            locator.top = clamp(sign.t + dy, et, mb);
          } else {
            const Δx = event.x - sign.x;
            const Δy = event.y - sign.y;

            locator.left = sign.l + Δx;
            locator.top = sign.t + Δy;
          }
          that.emit('update:offset', locator);
        }
      };

      document.onmouseup = () => {
        moving.value = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  };

  const handleDrag = () => {
    const { proxy } = that;
    // const dragWraps = document.querySelectorAll('.ant-modal-wrap');
    const dragWrap = proxy.$el;
    console.log('dragWrap', dragWrap);
    if (!dragWrap) return;
    const display = getStyle(dragWrap, 'display');
    const draggable = dragWrap.getAttribute('data-drag') ?? true;
    console.log({ display, draggable });
    if (display !== 'none') {
      // 拖拽位置
      if (draggable === null || unref(context.destroyOnClose)) {
        drag(dragWrap);
      }
    }
  };

  watchEffect(() => {
    if (!unref(context.visible) || !unref(context.draggable)) {
      return;
    }
    useTimeoutFn(() => {
      handleDrag();
    }, 30);
  });

  return {
    locator,
    sign,
    moving,
  };
}
