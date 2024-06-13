import olEvent from 'ol/events/Event'

class LayerEvent extends olEvent {
	public map: any

	constructor(type, map) {
		super(type)
		this.map = map
	}

	/**
	 * Register event for layer
	 * @private
	 */
}

export default LayerEvent
