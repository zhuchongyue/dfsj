import {createVNode, defineComponent, h, Ref, render, toRefs, unref} from 'vue'

export function createComponent(comp: any, props?: any, target?: Ref<HTMLElement>) {
	let vm: any = null
	const CompWrap = defineComponent({
		render() {
			return h(comp, { ...toRefs(props) })
		}
	})

	vm = createVNode(CompWrap)
	setTimeout(() => {
		render(vm, document.createElement('div'))
	}, 100)

	function close() {
		if (vm?.el && vm?.el?.parentNode) {
			vm.el.parentNode.removeChild(vm.el)
		}
	}

	function open(oDom: HTMLElement = unref(target) || unref(props?.container) || document.body) {
		if (!vm || !vm.el) {
			return
		}
		oDom.appendChild(vm.el as HTMLElement)
	}

	if (target) {
		open(unref(target) as HTMLElement)
	}
	return {
		vm,
		close,
		open
	}
}
