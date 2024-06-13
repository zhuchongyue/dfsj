import Event from '../Event'

/**
 * 对外暴露的地图事件
 */
export default class MapEvent extends Event {
	public movement: any

	constructor(type: any, movement: any) {
		super(type)
		this.movement = movement
	}
}
