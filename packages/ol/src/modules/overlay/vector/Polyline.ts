import Overlay from '../Overlay'
import GeometryHelper from '../../helpers/GeometryHelper'
import {Feature} from 'ol'
import {GeometryFormatType} from '../GeometryType'
import StyleHelper from '../../style/StyleHelper'

export default class Polyline extends Overlay {
    constructor(position, options = {}) {
        super()
        this._position = position
        let geometry = GeometryHelper.getGeomFromGeomData(position, {
            geometryType: GeometryFormatType.Polyline,
            ...options
        })
        this._delegate = new Feature({
            geometry: geometry,
            params: options
        })
    }
    setStyle(style,options = {
        standard: false,
        zoom: null,
        highlight: false
    }) {
        const helper = !options?.standard ? StyleHelper.Polyline(style, this.attr) : style;
        super.setStyle(helper,options)
        return this
    }

    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */
    static fromEntity(entity: Feature) {
        let polyline = undefined
        if (entity) {
            let positions = entity.getGeometry()
            let properties = entity.getProperties()
            polyline = new Polyline(positions, {})
            polyline.attr = {
                ...properties
            }
        }
        return polyline
    }
}

Overlay.registerType('polyline')
