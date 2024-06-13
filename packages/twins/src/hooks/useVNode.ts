import {createVNode, defineComponent, h, render, unref} from 'vue'

export function useVNode(comp: any, props?: any, target?: HTMLElement) {
	let vm: any = null
	const CompWrap = defineComponent({
		render() {
			return h(comp, { ...props })
		}
	})
	vm = createVNode(CompWrap)
	render(vm, document.createElement('div'))

	function close() {
		if (vm?.el && vm.el.parentNode) {
			vm.el.parentNode.removeChild(vm.el)
		}
	}

	function open(target: HTMLElement = unref(props?.container) || document.body) {
		if (!vm || !vm.el) {
			return
		}
		target.appendChild(vm.el as HTMLElement)
	}

	if (target) {
		open(target)
	}
	return {
		vm,
		close,
		open,
		get $el() {
			return vm?.el as HTMLElement
		}
	}
}
