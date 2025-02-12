/**
 * Prevent repeated clicks
 * @Example v-repeat-click="()=>{}"
 */
import {domUtils} from '@dfsj/utils'
import type {Directive, DirectiveBinding} from 'vue'
import {IntervalHandle, Nullable} from "../types"

const { on, once } = domUtils

const repeatDirective: Directive = {
	beforeMount(el: Element, binding: DirectiveBinding<any>) {
		let interval: Nullable<IntervalHandle> = null
		let startTime = 0
		const handler = (): void => binding?.value()
		const clear = (): void => {
			if (Date.now() - startTime < 100) {
				handler()
			}
			interval && clearInterval(interval)
			interval = null
		}

		on(el, 'mousedown', (e: MouseEvent): void => {
			if ((e as any).button !== 0) return
			startTime = Date.now()
			once(document as any, 'mouseup', clear)
			interval && clearInterval(interval)
			interval = setInterval(handler, 100)
		})
	}
}

export default repeatDirective
