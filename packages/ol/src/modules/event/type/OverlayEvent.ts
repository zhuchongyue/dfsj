import Event from '../Event'

interface IArgument {
	coordinate?: []

	[key: string]: any
}

export default class OverlayEvent extends Event {
	public layer: any
	public coordinate: any[]
	public argument: object = {}

	constructor(type: any, layer, argument?: IArgument) {
		super(type)
		this.layer = layer
		this.argument = argument
	}
}
