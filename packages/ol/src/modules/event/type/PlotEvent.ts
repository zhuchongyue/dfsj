import Event from '../Event'

export default class PlotEvent extends Event {
	public position: any
	public params: any = {};//需要附加的参数

	constructor(type: any, position: any,params?:any) {
		super(type)
		this.position = position
		this.params = params
	}
}
