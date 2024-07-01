import olEvent from 'ol/events/Event'

class LayerEvent extends olEvent {
	public map: any
	public movement: any

	constructor(type, map , movement: any) {
		super(type)
		this.map = map
		this.movement = movement
	}

	/**
	 * Register event for layer
	 * @private
	 */
}

export default LayerEvent
