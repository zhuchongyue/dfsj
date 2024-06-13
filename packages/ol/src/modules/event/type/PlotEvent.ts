import Event from '../Event'

export default class PlotEvent extends Event {
	public position: any

	constructor(type: any, position: any) {
		super(type)
		this.position = position
	}
}
