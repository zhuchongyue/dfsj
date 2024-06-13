/**
 * 事件的分发
 *
 *
 */

import olEvent from 'ol/events/Event'

export default class Event extends olEvent {
	public _cache: {}

	constructor(type: any) {
		super(type)
		this._cache = {}
	}
}
