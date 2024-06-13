import olEvent from 'ol/events/Event'

class LayerGroupEvent extends olEvent {
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

export default LayerGroupEvent
