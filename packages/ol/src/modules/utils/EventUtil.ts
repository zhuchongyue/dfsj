/**
 * 绑定自定义事件
 * @param target
 * @param event_name
 * @param fn
 * @param scope
 */

export function connectEvent(target, event_name, fn, scope?) {
	// console.log('connectEvent', target, event_name, fn, scope);

	// console.log(!target.on || typeof target.on != 'function')
	if (!target.on || typeof target.on != 'function') return
	// console.log(!fn || !event_name)
	if (!fn || !event_name) return

	const $fn = (e) => {
		fn.call(scope || null, e)
	}

	target.on(event_name, $fn)

	return $fn
}

/***
 * 取消绑定自定义事件
 * @param target
 * @param event_name
 * @param fn
 */
export function disconnectEvent(target, event_name, fn) {
	if (!target.un || typeof target.un != 'function') return

	if (!fn || !event_name) return

	target.un(event_name, fn)
}
