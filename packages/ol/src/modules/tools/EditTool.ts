export default class EditTool {
	private _map: any

	constructor() {}

	install(map) {
		this._map = map
		// this._viewer.dataSources.add(this._anchorLayer)
		Object.defineProperty(this._map, 'editTool', {
			value: this,
			writable: false
		})
	}
}
